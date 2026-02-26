import "@/styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

function TopNav() {
  const router = useRouter();
  const path = router.pathname;

  const Item = ({ href, label }) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-lg text-sm font-semibold transition
          ${
            active
              ? "bg-sky-100 text-sky-800 dark:bg-indigo-900/30 dark:text-indigo-200"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo ATR/BPN"
            width={40}
            height={40}
            priority
          />
          <div className="leading-tight">
            <div className="font-extrabold text-slate-800 dark:text-slate-100">
              SiKABut
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Sistem Kelengkapan Arsip Buton
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Item href="/" label="🏢 Profil Kantor" />
          <Item href="/cek-berkas" label="🔎 Cek Nomor Berkas" />
          <Item href="/syarat-biaya" label="📋 Syarat & Biaya" />
        </nav>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <TopNav />

      {/* Konten Halaman */}
      <div className="flex-grow">
        <Component {...pageProps} />
      </div>

      {/* Footer Global */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center">

          <div className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Media Sosial Resmi
          </div>

          <div className="flex justify-center flex-wrap gap-3 mb-6">
            <a
              href="https://instagram.com/kantahkabbuton"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition"
            >
              Instagram
            </a>

            <a
              href="https://facebook.com/Kantahkab Buton"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              Facebook
            </a>

            <a
              href="https://youtube.com/@KantahKabButon"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
            >
              YouTube
            </a>

            <a
              href="https://tiktok.com/@KantahButon1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-sm font-semibold transition"
            >
              TikTok
            </a>

            <a
            href="https://x.com/kantahkabbuton"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-sm font-semibold transition"
            >
            X 
            </a>
            </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Kantor Pertanahan Kabupaten Buton
            <br />
            Sistem Kelengkapan Arsip Buton (SiKABut)
          </div>

        </div>
      </footer>
    </div>
  );
}
