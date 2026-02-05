"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const role = user.role;

    if (role === 'CASHIER') {
      if (!pathname.startsWith('/pos')) {
        router.replace('/pos');
        return;
      }
    }

    if (role === 'ADMIN') {
    }
    setIsAuthorized(true);

  }, [router, pathname]);
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-3">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}