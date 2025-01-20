# BookInfo - Your Personal Book Library 📚

BookInfo is a web application that allows users to search for books using the Google Books API and save them to their personal library. Built with the T3 Stack (Next.js, TypeScript, Tailwind CSS, tRPC) and featuring authentication through Discord and Google.

## 🌐 Live Demo

Visit the live application at: [https://bookinfo.vercel.app/](https://bookinfo.vercel.app/)

## ✨ Features

- OAuth authentication with Discord and Google
- Search books using Google Books API
- Save books to your personal library
- Responsive design with Tailwind CSS
- Full TypeScript support
- Secure API handling with tRPC
- SQLite database with Prisma ORM

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git
- SQLite (for local development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ashik5/bookinfo.git
cd bookinfo
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add the following variables:

```env
# Next Auth
AUTH_SECRET="your_auth_secret"

# Discord OAuth
AUTH_DISCORD_ID="your_discord_client_id"
AUTH_DISCORD_SECRET="your_discord_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Google Books API
GOOGLE_BOOKS_API_KEY="your_google_books_api_key"

# Database
DATABASE_URL="file:./db.sqlite"
```

4. Set up the database
```bash
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_SECRET` | NextAuth.js secret key | Yes |
| `AUTH_DISCORD_ID` | Discord OAuth client ID | Yes |
| `AUTH_DISCORD_SECRET` | Discord OAuth client secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | Yes |
| `DATABASE_URL` | SQLite database URL | Yes |

## 🏗️ Implementation Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **API Layer**: tRPC
- **Database**: SQLite with Prisma
- **UI Components**: Lucide Icons, Geist Font

### Architecture
- Uses the T3 Stack architecture for full-stack type safety
- Server-side rendering with Next.js App Router
- API routes handled through tRPC for type-safe API calls
- OAuth authentication flow with multiple providers
- SQLite database for simple deployment and development

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch. To deploy your own version:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Add the required environment variables in Vercel's dashboard
5. Deploy!

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

[Ashik5](https://github.com/Ashik5)
