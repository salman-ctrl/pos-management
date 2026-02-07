import Image from 'next/image';

export const metadata = {
  title: 'Akses POS System',
  description: 'Masuk ke dashboard aplikasi kasir',
};

export default function AuthLayout({ children }) {
  const scrollImages1 = [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", // Azure Ocean EDP
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", // Urban Oversized Tee
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", // Raw Denim Jacket
    "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?w=600&q=80",
  ];
  const scrollImages2 = [
    "https://mendeez.com/cdn/shop/files/CLR-CHANGED-4-3.jpg?crop=region&crop_height=1074&crop_left=0&crop_top=2&crop_width=720&v=1756380429&width=720", // Slim-Fit Chino Navy
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80", // Rose Velvet Bloom
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", // Linen Summer Shirt
    "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&q=80", // Citrus Fresh Musk
  ];

  return (
    <div className="flex h-screen w-full bg-[#EBEDF2] overflow-hidden font-sans">

      <div className="hidden lg:flex flex-[1.2] gap-4 p-4 h-full min-w-0 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#EBEDF2] to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#EBEDF2] to-transparent z-10 pointer-events-none" />

        <div className="flex-1 min-w-0 relative overflow-hidden">
          <div className="animate-scroll-up space-y-4">
            {[...scrollImages1, ...scrollImages1].map((img, idx) => (
              <div key={idx} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
                <img src={img} alt="Visual" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 relative overflow-hidden">
          <div className="animate-scroll-down space-y-4">
            {[...scrollImages2, ...scrollImages2].map((img, idx) => (
              <div key={idx} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
                <img src={img} alt="Visual" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 h-full bg-white lg:rounded-l-[40px] shadow-2xl z-20 relative">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>

    </div>
  );
}