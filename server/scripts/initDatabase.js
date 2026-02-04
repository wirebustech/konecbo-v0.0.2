const pool = require('../config/database');

const createTables = async () => {
  // We get a client from the pool to run multiple queries in transaction if needed,
  // or just use pool.query for simplicity. Using client for consistency with original script.
  const client = await pool.connect();

  try {
    console.log('🔄 Checking/Creating database tables...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'researcher',
        auth_provider VARCHAR(50) DEFAULT 'email',
        email_verified BOOLEAN DEFAULT FALSE,
        phone_number VARCHAR(50),
        region VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
      
      -- Ensure new columns exist for existing tables
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_number') THEN
          ALTER TABLE users ADD COLUMN phone_number VARCHAR(50);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'region') THEN
          ALTER TABLE users ADD COLUMN region VARCHAR(100);
        END IF;
      END $$;
    `);

    // User profiles table (KYC data)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        current_position VARCHAR(255),
        institution VARCHAR(255),
        country VARCHAR(100),
        primary_discipline VARCHAR(255),
        sub_discipline VARCHAR(255),
        research_interests TEXT[],
        languages TEXT[],
        highest_degree VARCHAR(100),
        degree_field VARCHAR(255),
        institution_name VARCHAR(255),
        graduation_year INTEGER,
        orcid_id VARCHAR(50),
        institutional_email VARCHAR(255),
        years_of_experience INTEGER,
        number_of_publications INTEGER,
        publications TEXT[],
        past_projects TEXT,
        skills TEXT[],
        methodologies TEXT[],
        looking_to_post BOOLEAN DEFAULT FALSE,
        looking_to_join BOOLEAN DEFAULT FALSE,
        preferred_collaboration_types TEXT[],
        time_availability VARCHAR(100),
        availability_hours VARCHAR(100),
        career_goals TEXT,
        bio TEXT,
        website VARCHAR(255),
        linkedin VARCHAR(255),
        twitter VARCHAR(255),
        research_statement TEXT,
        profile_completeness INTEGER DEFAULT 0,
        kyc_completed BOOLEAN DEFAULT FALSE,
        kyc_completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `);
    // Ensure new columns exist for user_profiles
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country') THEN
          ALTER TABLE user_profiles ADD COLUMN country VARCHAR(100);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'research_interests') THEN
          ALTER TABLE user_profiles ADD COLUMN research_interests TEXT[];
        END IF;
      END $$;
    `);

    // Listings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        researcher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        description TEXT,
        category VARCHAR(100),
        budget VARCHAR(100),
        deadline DATE,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_listings_researcher_id ON listings(researcher_id);
    `);
    // Activity logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Email verification tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Password reset tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // System Settings Table (for Admin Control)
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Default Settings
    await client.query(`
      INSERT INTO system_settings (key, value, description)
      VALUES 
      ('google_docs_enabled', 'false', 'Enable Google Docs integration'),
      ('google_client_id', '', 'Google OAuth Client ID'),
      ('chat_enabled', 'false', 'Enable Chat feature'),
      ('file_sharing_enabled', 'false', 'Enable File Sharing feature')
      ON CONFLICT (key) DO NOTHING;
    `);

    // Create Default Admin User
    const adminCheck = await client.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    if (adminCheck.rows.length === 0) {
      console.log('👤 Creating default admin user...');
      const bcrypt = require('bcryptjs'); // Require here to avoid top-level dependency issues if package missing
      const salt = await bcrypt.genSalt(10);
      // Default: admin@konecbo.com / admin123
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role, email_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['System Admin', 'admin@konecbo.com', hashedPassword, 'admin', true, true]);
      console.log('✅ Default admin created: admin@konecbo.com / admin123');
    }

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
      CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
    `);

    // Create triggers (wrapped in try-catch logic or safe creation)
    // ... (Omitting full trigger logic to save space, assuming it's idempotent via CREATE OR REPLACE)
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Note: DROP TRIGGER IF EXISTS works well
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
      CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
      CREATE TRIGGER update_listings_updated_at
        BEFORE UPDATE ON listings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Database tables verified/created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    // We don't throw here to prevent server crash on startup transient errors,
    // but for critical errors it might be better to throw.
    throw error;
  } finally {
    client.release();
  }
};

// Check if running directly (CLI) or imported
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Database initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = createTables;
