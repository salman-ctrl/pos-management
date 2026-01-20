import { Box, MoreVertical, Plus } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Makanan', count: 12 },
  { id: 2, name: 'Minuman', count: 8 },
  { id: 3, name: 'Snack', count: 5 },
  { id: 4, name: 'Bahan Baku', count: 24 },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Kategori</h2>
           <p className="text-gray-400 text-sm">Kelola pengelompokan produk.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors">
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="card-base p-6 hover:shadow-md transition-all group cursor-pointer relative hover:border-orange-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Box size={24} />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={18} />
              </button>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">{cat.name}</h4>
            <p className="text-sm text-gray-500">{cat.count} Produk</p>
          </div>
        ))}
      </div>
    </div>
  );
}