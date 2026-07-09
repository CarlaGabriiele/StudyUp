import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyUp",
  description: "Plataforma de estudos para o ENEM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navbar global removida para não duplicar na página inicial e não interferir no design do Login/Cadastro */}
        
        {/* O conteúdo de cada página será renderizado aqui dentro */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}