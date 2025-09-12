import { Link } from "react-router-dom";

function BookCard({ book, small }) {
  const getBookCover = (book) => {
    const imageUrl = book.formats?.["image/jpeg"];
    return imageUrl && imageUrl.trim() !== ""
      ? imageUrl
      : "https://via.placeholder.com/150x220?text=No+Cover";
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition-transform"
    >
      <img
        src={getBookCover(book)}
        alt={book.title}
        className={`${small ? "w-28 h-40" : "w-32 h-44"} object-cover rounded-lg mb-4`}
      />
      <h3
        className={`${
          small ? "text-md" : "text-lg"
        } font-semibold text-gray-800 text-center line-clamp-2`}
      >
        {book.title}
      </h3>
      {!small && (
        <p className="text-sm text-gray-600 mt-1">
          {book.authors?.length > 0
            ? book.authors.map((a) => a.name).join(", ")
            : "Unknown Author"}
        </p>
      )}
      <p className="text-sm text-gray-700 mt-2">📥 {book.download_count}</p>
    </Link>
  );
}

export default BookCard;
