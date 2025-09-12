import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

function Home() {
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
          `https://book-app-2gdd.onrender.com/api/books?page=${page}&search=${search}`
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
        const res = await axios.get(
          `https://book-app-2gdd.onrender.com/api/books?page=1`
        );
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
        📚 Book Explorer
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author"
          className="w-96 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-lg text-gray-600">Loading books...</p>
      )}

      {/* Books Grid */}
      {!loading && books.length === 0 && (
        <p className="text-center text-lg text-gray-600">No books found.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            page === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700"
        >
          Next
        </button>
      </div>

      {/* Top Books */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mt-16 mb-8">
        🔥 Top 10 Most Downloaded Books
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {topBooks.map((book) => (
          <BookCard key={book.id} book={book} small />
        ))}
      </div>
    </div>
  );
}

export default Home;
