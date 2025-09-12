import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://gutendex.com/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading book details...</p>;
  if (!book) return <p className="text-center mt-10">Book not found.</p>;

  // Book cover helper
  const getBookCover = () => {
    const imageUrl = book.formats?.["image/jpeg"];
    return imageUrl && imageUrl.trim() !== ""
      ? imageUrl
      : "https://via.placeholder.com/200x300?text=No+Cover";
  };

  // Get PDF link separately
  const getPdfLink = () => {
    const formats = book.formats || {};
    return Object.entries(formats).find(([key]) => key.includes("pdf"));
  };

  // Other download links
  const getDownloadLinks = () => {
    const formats = book.formats || {};
    return Object.entries(formats).filter(
      ([key, value]) =>
        (key.includes("text") || key.includes("epub") || key.includes("html")) &&
        value &&
        value.startsWith("http")
    );
  };

  // Human-readable labels
  const formatLabel = (format) => {
    if (format.includes("epub")) return "EPUB";
    if (format.includes("html")) return "HTML";
    if (format.includes("plain")) return "Plain Text";
    return "Other";
  };

  const pdfLink = getPdfLink();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-indigo-600 hover:underline mb-6 inline-block">
        ← Back to Books
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <img
          src={getBookCover()}
          alt={book.title}
          className="w-48 h-64 object-cover rounded-lg shadow-md"
        />

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{book.title}</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Author(s): </span>
            {book.authors?.length > 0
              ? book.authors.map((a) => a.name).join(", ")
              : "Unknown"}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Languages: </span>
            {book.languages?.join(", ")}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">Downloads: </span>
            {book.download_count}
          </p>

          {/* Download Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📥 Download Options:</h2>
            <div className="flex flex-wrap gap-3">
              {/* PDF button only if available */}
              {pdfLink && (
                <a
                  href={pdfLink[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  📕 PDF
                </a>
              )}

              {/* Other formats */}
              {getDownloadLinks().length > 0 ? (
                getDownloadLinks().map(([format, url]) => (
                  <a
                    key={format}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    {formatLabel(format)}
                  </a>
                ))
              ) : (
                !pdfLink && <p className="text-gray-500">No downloads available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
