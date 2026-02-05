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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch from SQL database only
        try {
          const sqlStats = await adminService.getDashboardStats();
          const count = sqlStats.stats?.totalUsers || 0;
          const activity = sqlStats.stats?.recentActivity || [];

          setTotalUsers(count);
          setChartData(activity);
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
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#445566" />
              <XAxis dataKey="date" stroke="#B1EDE8" style={{ fontSize: '0.8rem' }} />
              <YAxis stroke="#B1EDE8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A2E40', borderColor: '#64CCC5', color: '#fff' }}
                itemStyle={{ color: '#64CCC5' }}
              />
              <Line type="monotone" dataKey="count" stroke="#64CCC5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", marginTop: "4rem", color: "#8899aa" }}>
            No activity data available yet.
          </div>
        )}
      </section>
    </section>
  );
}