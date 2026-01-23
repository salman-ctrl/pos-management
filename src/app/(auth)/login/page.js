"use client";

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Untuk redirect manual

export default function LoginPage() {
  const router = useRouter();
  
  // State Halaman
  const [step, setStep] = useState('LOGIN'); // 'LOGIN' | 'OTP'
  const [isLoading, setIsLoading] = useState(false);

  // State Form
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Aset Gambar (Tema Resto/Cafe)
  const scrollImages1 = [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  ];

  const scrollImages2 = [
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=600&q=80",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80",
  ];

  // --- Handlers ---

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi API Call & Kirim Email
    setTimeout(() => {
        setIsLoading(false);
        setStep('OTP');
        // Di sini nanti logika backend kirim email sebenernya
        console.log("OTP terkirim ke: ", email);
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi Verifikasi OTP
    setTimeout(() => {
        setIsLoading(false);
        // Jika sukses, redirect ke dashboard
        router.push('/');
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-[#EBEDF2] overflow-hidden font-sans">
      
      {/* --- KIRI: ANIMASI SCROLL --- */}
      <div className="hidden lg:flex flex-[1.2] gap-4 p-4 h-full min-w-0 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#EBEDF2] to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#EBEDF2] to-transparent z-10 pointer-events-none" />

        <div className="flex-1 min-w-0 relative overflow-hidden">
          <div className="animate-scroll-up space-y-4">
            {[...scrollImages1, ...scrollImages1].map((img, idx) => (
              <div key={idx} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src={img} 
                  alt="Login Visual" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 relative overflow-hidden mt-12">
          <div className="animate-scroll-down space-y-4">
            {[...scrollImages2, ...scrollImages2].map((img, idx) => (
              <div key={idx} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src={img} 
                  alt="Login Visual" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- KANAN: FORM AREA --- */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 h-full bg-white lg:rounded-l-[40px] shadow-2xl z-20 relative">
        
        <div className="w-full max-w-[440px] space-y-8">
          
          {/* STEP 1: FORM LOGIN */}
          {step === 'LOGIN' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang!</h1>
                    <p className="text-gray-500 text-sm">Masuk untuk mengelola restoran Anda.</p>
                </div>

                {/* Form */}
                <form className="space-y-6 mt-8" onSubmit={handleLoginSubmit}>
                    <div className="group relative transition-all">
                        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${email ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                            <Mail className={`w-5 h-5 transition-colors ${email ? 'text-orange-500' : 'text-gray-400'}`} />
                            <div className="h-6 w-[1px] bg-gray-200"></div>
                            <div className="flex-1 relative">
                                <input 
                                    type="email" 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full bg-transparent outline-none text-gray-800 font-medium placeholder-transparent z-10 relative"
                                    placeholder="Email Address"
                                    required
                                />
                                <label 
                                    htmlFor="email"
                                    className={`absolute left-0 transition-all duration-200 pointer-events-none text-gray-400 font-medium
                                        ${email 
                                            ? '-top-5 text-xs text-orange-500 font-bold' 
                                            : 'top-0 text-sm peer-focus:-top-5 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:font-bold'
                                        }
                                    `}
                                >
                                    Alamat Email
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="group relative transition-all">
                        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${password ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                            <Lock className={`w-5 h-5 transition-colors ${password ? 'text-orange-500' : 'text-gray-400'}`} />
                            <div className="h-6 w-[1px] bg-gray-200"></div>
                            <div className="flex-1 relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full bg-transparent outline-none text-gray-800 font-medium placeholder-transparent z-10 relative tracking-wider"
                                    placeholder="Password"
                                    required
                                />
                                <label 
                                    htmlFor="password"
                                    className={`absolute left-0 transition-all duration-200 pointer-events-none text-gray-400 font-medium
                                        ${password 
                                            ? '-top-5 text-xs text-orange-500 font-bold' 
                                            : 'top-0 text-sm peer-focus:-top-5 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:font-bold'
                                        }
                                    `}
                                >
                                    Kata Sandi
                                </label>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                            Lupa Password?
                        </a>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Masuk Sekarang
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500 font-medium">
                        Belum punya akun? <a href="#" className="text-orange-600 font-bold hover:underline">Hubungi Admin</a>
                    </p>
                </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <button 
                    onClick={() => setStep('LOGIN')}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={18} /> Kembali
                </button>

                <div className="text-center space-y-2 mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verifikasi OTP</h1>
                    <p className="text-gray-500 text-sm">
                        Masukkan 6 digit kode yang telah kami kirimkan ke email <span className="font-bold text-gray-800">{email}</span>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleOtpSubmit}>
                    <div className="flex justify-center">
                        <input 
                            type="text" 
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                            placeholder="• • • • • •"
                            autoFocus
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading || otpCode.length < 6}
                        className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Verifikasi
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500 font-medium">
                        Tidak menerima kode? <button className="text-orange-600 font-bold hover:underline">Kirim Ulang</button>
                    </p>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}