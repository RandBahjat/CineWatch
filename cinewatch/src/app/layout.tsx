import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white antialiased min-h-screen">
        <main className="pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
