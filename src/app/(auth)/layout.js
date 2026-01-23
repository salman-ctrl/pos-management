export const metadata = {
  title: 'Login - POS System',
  description: 'Masuk ke dashboard aplikasi kasir',
};

export default function AuthLayout({ children }) {
  return (
    // Kita biarkan children (halaman login) mengambil alih seluruh styling
    <main className="w-full min-h-screen">
      {children}
    </main>
  );
}