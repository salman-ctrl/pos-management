import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      getHeaders: () => {
        let token = get().token;

        if (!token && typeof window !== 'undefined') {
          token = localStorage.getItem('token');
        }

        if (!token && typeof window !== 'undefined') {
          const storage = localStorage.getItem('pos-storage');
          if (storage) {
            try {
              const parsed = JSON.parse(storage);
              token = parsed.state?.token;
            } catch (e) { console.error("Gagal parse storage", e); }
          }
        }

        return token ? { 'Authorization': `Bearer ${token}` } : null;
      },

      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();

          if (data.success) {
            localStorage.setItem('token', data.token);
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true
            });
            return { success: true };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: 'Gagal terhubung ke server' };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, cart: [] });
        localStorage.removeItem('pos-storage');
        localStorage.removeItem('token');
      },

      products: [],
      categories: [],
      customers: [],
      settings: null,
      isLoading: false,

      fetchDataMaster: async () => {
        const headers = get().getHeaders();

        if (!headers) {
          console.warn("Fetch dibatalkan: User belum login / Token tidak ada.");
          return;
        }

        set({ isLoading: true });
        try {
          const [prodRes, catRes, custRes, setRes] = await Promise.all([
            fetch(`${API_URL}/api/products`, { headers }),
            fetch(`${API_URL}/api/products/categories`, { headers }),
            fetch(`${API_URL}/api/customers`, { headers }),
            fetch(`${API_URL}/api/settings`, { headers })
          ]);

          const prodData = await prodRes.json();
          const catData = await catRes.json();
          const custData = await custRes.json();
          const setData = await setRes.json();

          if (prodData.success) set({ products: prodData.data });
          else if (prodRes.status === 401) get().logout();

          // --- FIX: TETAP MENGHAPUS HARDCODED 'SEMUA' AGAR MANAJEMEN KATEGORI TIDAK BUG ---
          if (catData.success) set({ categories: catData.data });

          if (custData.success) set({ customers: custData.data });
          if (setData.success) set({ settings: setData.data });

        } catch (error) {
          console.error("Gagal ambil data master:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      cart: [],

      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === product.id);

        if (product.stock <= 0) return { success: false, message: 'Stok Habis' };

        if (existing) {
          if (existing.qty + 1 > product.stock) return { success: false, message: 'Stok tidak cukup' };

          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, qty: 1 }] });
        }
        return { success: true };
      },

      updateCartQty: (productId, delta) => {
        const { cart, products } = get();

        set({
          cart: cart.map((item) => {
            if (item.id === productId) {
              const masterProduct = products.find(p => p.id === productId);
              if (delta > 0 && masterProduct && item.qty + 1 > masterProduct.stock) {
                return item;
              }
              const newQty = Math.max(0, item.qty + delta);
              return { ...item, qty: newQty };
            }
            return item;
          }).filter((item) => item.qty > 0),
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart, settings } = get();
        const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
        const taxRate = settings?.taxRate ? Number(settings.taxRate) / 100 : 0;
        const tax = subTotal * taxRate;

        return {
          subTotal,
          tax,
          grandTotal: subTotal + tax
        }
      }

    }),
    {
      name: 'pos-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        settings: state.settings
      }),
    }
  )
);