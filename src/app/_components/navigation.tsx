"use client";
import React, { useState} from "react";
import {
  BookOpen,
  User,
  LogOut,
  BookMarked,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface User {
  id?: string;
  name: string;
  email: string;
  image: string;
}

function Navigation({ userData }: { userData: User | null }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const user: User = {
    name: userData?.name || "Guest",
    email: userData?.email || "",
    image: userData?.image || "",
  };
  return (
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => redirect("/")}>
                BookInfo
              </h1>
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  src={user.image}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden text-sm font-medium text-gray-700 md:block">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        redirect("/saved-books");
                      }}
                    >
                      <BookMarked className="mr-2 h-4 w-4" />
                      Saved Books
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}

export default Navigation;
