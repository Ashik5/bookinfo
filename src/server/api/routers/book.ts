import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";
import { z } from "zod";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const bookRouter = createTRPCRouter({
  getBook: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const { title } = input;
      const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
      const GOOGLE_BOOKS_API_URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        title,
      )}&key=${GOOGLE_BOOKS_API_KEY}`;
      try {
        const response = await axios.get(GOOGLE_BOOKS_API_URL);
        const data = response.data;
        return {
          books:
            data.items?.map((item: any) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || [],
              description:
                item.volumeInfo.description || "No description available.",
              publishedDate: item.volumeInfo.publishedDate || "Unknown",
              coverImage: item.volumeInfo.imageLinks?.thumbnail || null,
            })) || [],
        };
      } catch (error) {
        console.error("Error fetching book data:", error);
        throw new Error("Could not fetch book data. Please try again later.");
      }
    }),

  saveBook: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        authors: z.array(z.string()),
        description: z.string().optional(),
        publishedDate: z.string().optional(),
        coverImage: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const book = await prisma.book.create({
          data: {
            title: input.title,
            authors: input.authors.join(", "),
            description: input.description,
            publishedDate: input.publishedDate,
            coverImage: input.coverImage,
            userId: input.userId,
          },
        });
        return { success: true, book };
      } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Could not save book data.");
      }
    }),

  getUserBooks: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const data = await prisma.book.findMany({
          where: { userId: input.userId },
          include: { user: true },
        });
        return {
          books: data.map((book) => ({
            id: book.id,
            title: book.title,
            authors: book.authors.split(", "),
            description: book.description,
            publishedDate: book.publishedDate,
            coverImage: book.coverImage,
          })),
        };
      } catch (error) {
        console.error("Error fetching user's books:", error);
        throw new Error("Could not fetch user's books.");
      }
    }),

  deleteUserBook: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        bookId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const deletedBook = await prisma.book.deleteMany({
          where: {
            id: input.bookId,
            userId: input.userId,
          },
        });

        if (deletedBook.count === 0) {
          throw new Error("No book found or unauthorized access.");
        }

        return { success: true, message: "Book deleted successfully." };
      } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error("Could not delete book. Please try again.");
      }
    }),
});
