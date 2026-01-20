import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import adminService from "../../services/adminService";

const styles = {
  container: {
    backgroundColor: "#1A2E40",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "Inter, sans-serif",
    color: "#FFFFFF",
  },
  dashboard: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  card: {
    background: "#2B3E50",
    borderRadius: "1rem",
    padding: "1.5rem 2rem",
    minWidth: "180px",
    textAlign: "center",
    boxShadow: "0 4px 24px 0 rgba(50, 80, 120, 0.15)",
    color: "#B1EDE8",
    fontWeight: "600",
    fontSize: "1.2rem",
    margin: "0.5rem 0",
  },
  cardHeader: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#64CCC5",
    marginBottom: "0.4rem",
  },
  cardValue: {
    fontSize: "2.2rem",
    color: "#fff",
    margin: 0,
    fontWeight: "bold",
  },
  chartCard: {
    background: "#2B3E50",
    borderRadius: "1rem",
    padding: "1.5rem",
    minWidth: "350px",
    flex: 1,
    marginBottom: "2rem",
    maxWidth: "600px",
    height: "320px",
  },
  chartHeader: {
    marginBottom: "1rem",
    fontSize: "1.15rem",
    color: "#64CCC5",
    fontWeight: "700",
  },
};

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [sqlUsers, setSqlUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch from SQL database only
        try {
          const sqlStats = await adminService.getDashboardStats();
          const count = sqlStats.stats?.totalUsers || 0;
          setSqlUsers(count);
          setTotalUsers(count);
        } catch (sqlError) {
          console.warn('SQL data fetch failed:', sqlError);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <section style={styles.container}>Loading...</section>;
  }

  return (
    <section style={styles.container}>
      <div style={styles.dashboard}>
        <article style={styles.card}>
          <div style={styles.cardHeader}>Total Users</div>
          <p style={styles.cardValue}>{totalUsers}</p>
        </article>
      </div>

      <section style={styles.chartCard}>
        <header style={styles.chartHeader}>Engagement (Logs per Day)</header>
        <div style={{ textAlign: "center", marginTop: "1rem", color: "#b1ede8" }}>
          Chart unavailable (Maintenance)
        </div>
      </section>
    </section>
  );
}