import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;
const app = express();

app.get("/", (req, res) => {
  res.send(
    "🚀 PostgreSQL Test API is running... visit /test-db to check connection"
  );
});

app.get("/test-db", async (req, res) => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl:
      process.env.POSTGRES_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    await client.connect();
    const result = await client.query("SELECT NOW()");
    res.send({
      status: "✅ Connected successfully",
      server_time: result.rows[0].now,
      host: process.env.POSTGRES_HOST,
    });
  } catch (err) {
    res.status(500).send({
      status: "❌ Connection failed",
      error: err.message,
    });
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);
