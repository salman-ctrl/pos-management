"use client";

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="px-4 lg:px-6 py-3 lg:py-4 flex gap-2 lg:gap-3 overflow-x-auto no-scrollbar border-b border-gray-50 bg-white/50 backdrop-blur-sm">
        {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.name;
            return (
            <button
                key={cat.id || idx}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap border ${
                    isActive 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
                {cat.name}
            </button>
            )
        })}
    </div>
  );
}