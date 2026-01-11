const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Log activity
const logActivity = async (userId, action, details, ipAddress, userAgent) => {
    try {
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
            [userId, action, details, ipAddress, userAgent]
        );
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

// Register new user with email/password
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, phoneNumber, region } = req.body;
    const client = await pool.connect();

    try {
        // Check if user already exists
        const existingUser = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please sign in instead.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const result = await client.query(
            `INSERT INTO users (email, password_hash, full_name, auth_provider, role, phone_number, region) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, uid, email, full_name, role, created_at`,
            [email.toLowerCase(), passwordHash, fullName, 'email', 'researcher', phoneNumber, region]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        // Log activity
        await logActivity(
            user.id,
            'REGISTER',
            'User registered with email/password',
            req.ip,
            req.get('user-agent')
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    } finally {
        client.release();
    }
};

// Sign in with email/password
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND auth_provider = $2',
            [email.toLowerCase(), 'email']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        // Log activity
        await logActivity(
            user.id,
            'LOGIN',
            'User logged in with email/password',
            req.ip,
            req.get('user-agent')
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                emailVerified: user.email_verified,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Google Sign-In (create or login)
exports.googleAuth = async (req, res) => {
    const { email, fullName, googleId, photoURL } = req.body;

    if (!email || !googleId) {
        return res.status(400).json({
            success: false,
            message: 'Email and Google ID are required'
        });
    }

    const client = await pool.connect();

    try {
        // Check if user exists
        let result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        let user;
        let isNewUser = false;

        if (result.rows.length === 0) {
            // Create new user
            result = await client.query(
                `INSERT INTO users (email, full_name, uid, auth_provider, role, email_verified) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, uid, email, full_name, role, created_at`,
                [email.toLowerCase(), fullName, googleId, 'google', 'researcher', true]
            );
            user = result.rows[0];
            isNewUser = true;

            await logActivity(
                user.id,
                'REGISTER',
                'User registered with Google',
                req.ip,
                req.get('user-agent')
            );
        } else {
            user = result.rows[0];

            // Update last login
            await client.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
                [user.id]
            );

            await logActivity(
                user.id,
                'LOGIN',
                'User logged in with Google',
                req.ip,
                req.get('user-agent')
            );
        }

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        res.json({
            success: true,
            message: isNewUser ? 'Account created successfully!' : 'Login successful!',
            token,
            isNewUser,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                emailVerified: true,
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during Google authentication'
        });
    } finally {
        client.release();
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.email, u.full_name, u.role, u.auth_provider, u.email_verified, 
              u.created_at, u.last_login, p.*
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

// Update user profile (KYC data)
exports.updateProfile = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.userId;
        const profileData = req.body;

        // Check if profile exists
        const existingProfile = await client.query(
            'SELECT * FROM user_profiles WHERE user_id = $1',
            [userId]
        );

        let result;
        if (existingProfile.rows.length === 0) {
            // Insert new profile
            result = await client.query(
                `INSERT INTO user_profiles (
          user_id, current_position, institution, country, primary_discipline,
          sub_discipline, research_interests, languages, highest_degree, degree_field,
          institution_name, graduation_year, orcid_id, institutional_email,
          years_of_experience, number_of_publications, publications, past_projects,
          skills, methodologies, looking_to_post, looking_to_join,
          preferred_collaboration_types, time_availability, availability_hours,
          career_goals, bio, website, linkedin, twitter, research_statement,
          profile_completeness, kyc_completed, kyc_completed_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, CURRENT_TIMESTAMP
        ) RETURNING *`,
                [
                    userId,
                    profileData.currentPosition,
                    profileData.institution,
                    profileData.country,
                    profileData.primaryDiscipline,
                    profileData.subDiscipline,
                    profileData.researchInterests,
                    profileData.languages,
                    profileData.highestDegree,
                    profileData.degreeField,
                    profileData.institutionName,
                    profileData.graduationYear,
                    profileData.orcidId,
                    profileData.institutionalEmail,
                    profileData.yearsOfExperience,
                    profileData.numberOfPublications,
                    profileData.publications,
                    profileData.pastProjects,
                    profileData.skills,
                    profileData.methodologies,
                    profileData.lookingToPost,
                    profileData.lookingToJoin,
                    profileData.preferredCollaborationTypes,
                    profileData.timeAvailability,
                    profileData.availabilityHours,
                    profileData.careerGoals,
                    profileData.bio,
                    profileData.website,
                    profileData.linkedin,
                    profileData.twitter,
                    profileData.researchStatement,
                    profileData.profileCompleteness || 0,
                    true
                ]
            );
        } else {
            // Update existing profile
            result = await client.query(
                `UPDATE user_profiles SET
          current_position = $2, institution = $3, country = $4,
          primary_discipline = $5, sub_discipline = $6, research_interests = $7,
          languages = $8, highest_degree = $9, degree_field = $10,
          institution_name = $11, graduation_year = $12, orcid_id = $13,
          institutional_email = $14, years_of_experience = $15,
          number_of_publications = $16, publications = $17, past_projects = $18,
          skills = $19, methodologies = $20, looking_to_post = $21,
          looking_to_join = $22, preferred_collaboration_types = $23,
          time_availability = $24, availability_hours = $25, career_goals = $26,
          bio = $27, website = $28, linkedin = $29, twitter = $30,
          research_statement = $31, profile_completeness = $32,
          kyc_completed = $33, kyc_completed_at = CURRENT_TIMESTAMP
         WHERE user_id = $1
         RETURNING *`,
                [
                    userId,
                    profileData.currentPosition,
                    profileData.institution,
                    profileData.country,
                    profileData.primaryDiscipline,
                    profileData.subDiscipline,
                    profileData.researchInterests,
                    profileData.languages,
                    profileData.highestDegree,
                    profileData.degreeField,
                    profileData.institutionName,
                    profileData.graduationYear,
                    profileData.orcidId,
                    profileData.institutionalEmail,
                    profileData.yearsOfExperience,
                    profileData.numberOfPublications,
                    profileData.publications,
                    profileData.pastProjects,
                    profileData.skills,
                    profileData.methodologies,
                    profileData.lookingToPost,
                    profileData.lookingToJoin,
                    profileData.preferredCollaborationTypes,
                    profileData.timeAvailability,
                    profileData.availabilityHours,
                    profileData.careerGoals,
                    profileData.bio,
                    profileData.website,
                    profileData.linkedin,
                    profileData.twitter,
                    profileData.researchStatement,
                    profileData.profileCompleteness || 0,
                    true
                ]
            );
        }

        await logActivity(
            userId,
            'UPDATE_PROFILE',
            'User updated profile information',
            req.ip,
            req.get('user-agent')
        );

        res.json({
            success: true,
            message: 'Profile updated successfully!',
            profile: result.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    } finally {
        client.release();
    }
};

// Logout (mainly for logging purposes)
exports.logout = async (req, res) => {
    try {
        await logActivity(
            req.user.userId,
            'LOGOUT',
            'User logged out',
            req.ip,
            req.get('user-agent')
        );

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};
