import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/books?page=${page}&search=${search}`
        );
        setBooks(res.data.results || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, search]);

  // Fetch Top Books
  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books?page=1`);
        const sorted = [...res.data.results]
          .sort((a, b) => b.download_count - a.download_count)
          .slice(0, 10);
        setTopBooks(sorted);
      } catch (error) {
        console.error("Error fetching top books:", error);
      }
    };
    fetchTopBooks();
  }, []);

  // Helper for book cover
  const getBookCover = (book) => {
    const imageUrl = book.formats?.["image/jpeg"];
    if (imageUrl && imageUrl.trim() !== "") {
      return imageUrl; // Valid image
    }
    // Dummy fallback image
    return "https://via.placeholder.com/150x220?text=No+Cover";
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px", color: "#333" }}>
        📚 Book Explorer
      </h1>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author"
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", color: "#555", fontSize: "18px" }}>Loading books...</p>
      )}

      {/* Books Grid */}
      {!loading && books.length === 0 && (
        <p style={{ textAlign: "center", color: "#555", fontSize: "18px" }}>No books found.</p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.2s",
            }}
          >
            <img
              src={getBookCover(book)}
              alt={book.title}
              style={{
                width: "120px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>{book.title}</h3>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
              {book.authors?.length > 0
                ? book.authors.map((a) => a.name).join(", ")
                : "Unknown Author"}
            </p>
            <p style={{ fontSize: "14px", color: "#444" }}>📥 {book.download_count}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "10px" }}>
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ddd",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>

      {/* Top Books */}
      <h2 style={{ textAlign: "center", fontSize: "28px", margin: "40px 0 20px", color: "#333" }}>
        🔥 Top 10 Most Downloaded Books
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {topBooks.map((book) => (
          <div
            key={book.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.2s",
            }}
          >
            <img
              src={getBookCover(book)}
              alt={book.title}
              style={{
                width: "120px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>{book.title}</h3>
            <p style={{ fontSize: "14px", color: "#444" }}>📥 {book.download_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
