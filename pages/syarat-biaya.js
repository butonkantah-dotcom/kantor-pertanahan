// pages/syarat-biaya.js
import Head from "next/head";
import { useMemo, useState } from "react";

// Isi ini nanti kamu sesuaikan. Ini contoh aman (tanpa kategori).
const DATA = [
  {
    layanan: "Balik Nama",
    syarat: ["KTP & KK pemohon", "Dokumen peralihan (AJB/hibah/waris sesuai kasus)", "Sertipikat asli"],
    biaya: ["PNBP sesuai ketentuan (berdasarkan jenis layanan & objek)"],
  },
  {
    layanan: "Roya / Penghapusan Hak Tanggungan",
    syarat: ["KTP pemohon", "Sertipikat asli", "Surat roya / dokumen pelunasan (sesuai ketentuan)"],
    biaya: ["PNBP sesuai ketentuan"],
  },
  {
    layanan: "Pendaftaran Tanah Pertama Kali",
    syarat: ["KTP & KK", "Alas hak / riwayat tanah", "Dokumen pendukung sesuai ketentuan"],
    biaya: ["PNBP sesuai ketentuan"],
  },
  {
    layanan: "Pemecahan Sertipikat",
    syarat: ["KTP pemohon", "Sertipikat asli", "Dokumen pendukung sesuai ketentuan"],
    biaya: ["PNBP sesuai ketentuan"],
  },
  {
    layanan: "Penggabungan Sertipikat",
    syarat: ["KTP pemohon", "Sertipikat asli yang akan digabung", "Dokumen pendukung sesuai ketentuan"],
    biaya: ["PNBP sesuai ketentuan"],
  },
  {
    layanan: "Pengecekan Sertipikat",
    syarat: ["KTP pemohon", "Data sertipikat / dokumen pendukung yang diminta petugas"],
    biaya: ["PNBP sesuai ketentuan"],
  },
];

export default function SyaratBiaya() {
  const [q, setQ] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return DATA;
    return DATA.filter((d) => {
      const inName = d.layanan.toLowerCase().includes(query);
      const inReq = d.syarat.join(" ").toLowerCase().includes(query);
      return inName || inReq;
    });
  }, [q]);

  return (
    <>
      <Head>
        <title>Syarat & Biaya | SiKABut</title>
        <meta name="description" content="Syarat dan informasi biaya layanan (ringkas) untuk publik" />
      </Head>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <section className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            📋 Syarat & Biaya Layanan
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ketik nama layanan untuk mencari. Informasi biaya mengikuti ketentuan resmi (PNBP) yang berlaku.
          </p>

          <div className="mt-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='🔎 Cari layanan... (contoh: "balik nama", "roya")'
              className="w-full rounded-xl px-4 py-3 text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-indigo-700/30 dark:text-slate-100"
            />
          </div>

          <div className="mt-6 space-y-3">
            {filtered.length === 0 && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                Tidak ada layanan yang cocok dengan pencarian.
              </div>
            )}

            {filtered.map((d, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={d.layanan}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-3 p-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                      {d.layanan}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xl leading-none">
                      {isOpen ? "−" : "+"}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                      <div className="mt-2">
                        <div className="font-bold">Syarat (ringkas):</div>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {d.syarat.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <div className="font-bold">Biaya:</div>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {d.biaya.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Jika layanan yang dicari belum ada, silakan gunakan menu <b>Cek Nomor Berkas</b> atau hubungi petugas pada jam layanan.
          </div>
        </section>
      </main>
    </>
  );
}
