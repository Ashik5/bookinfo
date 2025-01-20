"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Save,
  Trash2,
  User,
  LogOut,
  BookMarked,
  ChevronDown,
  X,
  Star,
} from "lucide-react";
import { api } from "~/trpc/react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface Book {
  id: string;
  title: string;
  authors: [string];
  coverImage: string;
  description: string;
  publishedDate: string;
}

interface User {
  id?: string;
  name: string;
  email: string;
  image: string;
}

function HomePage({ userData }: { userData: User | null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const saveBookMutation =  api.book.saveBook.useMutation();

  const {
    data,
    isLoading: queryLoading,
    error,
  } = api.book.getBook.useQuery(
    { title: searchQuery },
    {
      enabled: !!searchQuery,
    },
  );

  useEffect(() => {
    if (data) {
      setCurrentBooks(data.books);
    }
  }, [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = (book:Book) => {
    saveBookMutation.mutate({
      userId: userData?.id || "",
      title: book.title,
      authors: book.authors,
      description: book.description,
      publishedDate: book.publishedDate,
      coverImage: book.coverImage,
    });
  };


  const BookCard = ({ book }: { book: Book }) => (
    <div
      className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:scale-[1.02]"
      onClick={() => setSelectedBook(book)}
    >
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={book.coverImage}
            alt={book.title}
          />
        </div>
        <div className="p-8">
          <div className="flex items-center gap-2">
            {book && (
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                ★ 5
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            {book.title}
          </h3>
          <p className="mt-1 text-gray-500">{book.authors[0]}</p>
          <p className="mt-2 line-clamp-2 text-gray-500">{book.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Published: {book.publishedDate}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave(book);
              }}
              className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Save className="mr-1 h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BookDetailsModal = ({
    book,
    onClose,
  }: {
    book: Book;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6 md:p-8">
            <div className="gap-8 md:flex">
              <div className="mb-6 md:mb-0 md:w-1/3">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-[400px] w-full rounded-lg object-cover shadow-lg"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Published</span>
                    <span className="font-medium">{book.publishedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Genre</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  {book.title}
                </h2>
                <p className="mb-6 text-xl text-gray-600">
                  by {book.authors[0]}
                </p>
                <div className="prose max-w-none">
                  <p className="leading-relaxed text-gray-700">
                    {book.description}
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      handleSave(book);
                      onClose();
                    }}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter book title..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
        {/* Current Book Result */}
        {currentBooks && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Search Result
            </h2>
            <div className="space-y-6">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Saved Books */}
        {savedBooks.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Saved Books
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedBooks.map((book) => (
                <div
                  key={book.id}
                  className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="flex gap-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-32 w-24 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{book.title}</h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {book.authors[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </main>
  );
}

export default HomePage;
