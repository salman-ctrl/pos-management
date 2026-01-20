import { Plus } from 'lucide-react';

const USERS = [
  { id: 1, name: 'Admin Owner', role: 'Owner', email: 'owner@toko.com', status: 'active' },
  { id: 2, name: 'Budi Santoso', role: 'Cashier', email: 'budi@toko.com', status: 'active' },
  { id: 3, name: 'Siti Aminah', role: 'Cashier', email: 'siti@toko.com', status: 'inactive' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
           <p className="text-gray-400 text-sm">Kelola akses staff dan kasir.</p>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors">
           <Plus size={18} /> Tambah User
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {USERS.map((user) => (
          <div key={user.id} className="card-base p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg border border-orange-100">
              {user.name.substring(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800">{user.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-600 font-medium">
                  {user.role}
                </span>
                <span>• Last login: 2 jam lalu</span>
              </div>
              <div className="flex gap-2 mt-2">
                 <button className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">Reset Password</button>
                 <button className="flex-1 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-100 transition-colors">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}