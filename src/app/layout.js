import "./globals.css";

export const metadata = {
  title: "POS System",
  description: "Point of Sales Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}