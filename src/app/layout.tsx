import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Navigation from "~/app/_components/navigation";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "BookInfo - Your Personal Book Library",
  description: "BookInfo is a personal book library that allows you to search for books and save them to your library.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation userData={session?.user}/>
          {children}
        </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
