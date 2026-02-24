// pages/index.js
import Head from "next/head";
import Link from "next/link";

export default function ProfilKantor() {
  // Silakan isi sesuai data resmi kantor
  const OFFICE_NAME = "Kantor Pertanahan Kabupaten Buton";
  const OFFICE_ADDRESS = "Jl. ........................................";
  const OFFICE_HOURS = "Senin–Jumat | 08.00–16.00 WITA";
  const OFFICE_PHONE = "(040x) xxxxxx";
  const OFFICE_EMAIL = "xxxxx@atrbpn.go.id";

  return (
    <>
      <Head>
        <title>Profil Kantor | SiKABut</title>
        <meta
          name="description"
          content="Profil Kantor Pertanahan Kabupaten Buton dan informasi layanan SiKABut"
        />
      </Head>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <section className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            PROFIL KANTOR
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{OFFICE_NAME}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">📍 Alamat</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">{OFFICE_ADDRESS}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">🕒 Jam Layanan</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">{OFFICE_HOURS}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">☎️ Kontak Resmi</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">Telepon: {OFFICE_PHONE}</div>
              <div className="text-slate-700 dark:text-slate-200">Email: {OFFICE_EMAIL}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">ℹ️ Tentang SiKABut</div>
              <p className="mt-1 text-slate-700 dark:text-slate-200 leading-relaxed">
                SiKABut digunakan untuk mengecek status & kelengkapan berkas permohonan serta melihat
                syarat dan informasi biaya layanan secara ringkas.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/cek-berkas"
              className="inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold text-black
                         bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700
                         border border-slate-300 dark:border-slate-600 shadow-md"
            >
              🔎 Mulai Cek Berkas
            </Link>

            <Link
              href="/syarat-biaya"
              className="inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold
                         bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200
                         border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm"
            >
              📋 Lihat Syarat & Biaya
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Catatan: Informasi biaya mengikuti ketentuan resmi (PNBP) yang berlaku.
          </p>
        </section>
      </main>
    </>
  );
}
