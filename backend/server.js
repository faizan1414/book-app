import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let cache = {};

// API endpoint
app.get("/api/books", async (req, res) => {
  const { page = 1, search = "" } = req.query;
  const cacheKey = `${page}-${search}`;

  if (cache[cacheKey]) {
    return res.json(cache[cacheKey]);
  }

  const url = `https://gutendex.com/books/?page=${page}&search=${search}`;
  const response = await fetch(url);
  const data = await response.json();

  cache[cacheKey] = data;
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
