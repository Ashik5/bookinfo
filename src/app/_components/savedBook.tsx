"use client";
import React, { useState, useEffect } from "react";
import {Trash2,User,X,Star} from "lucide-react";
import { api } from "~/trpc/react";

interface Book {
  id: string;
  title: string;
  authors: string[];
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

function SavedBook({ userData }: { userData: User | null }) {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const {data} = api.book.getUserBooks.useQuery({ userId: userData?.id || "" });
  const removeBookMutation = api.book.deleteUserBook.useMutation();

  useEffect(() => {
    if (data) {
      setSavedBooks(data.books.map(book => ({
        ...book,
        coverImage: book.coverImage || '',
        description: book.description || '',
        publishedDate: book.publishedDate || ''
      })));
    }
  }, [data]);
  const handleDelete = (id: string) => {
    removeBookMutation.mutate({ userId: userData?.id || "", bookId:id });
    setSavedBooks(savedBooks.filter((book) => book.id !== id));
  };
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(book.id);
                        }}
                        className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </button>
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

export default SavedBook;
