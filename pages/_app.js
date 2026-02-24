import "@/styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";

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
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-extrabold">
            S
          </div>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TopNav />
      <Component {...pageProps} />
    </div>
  );
}
