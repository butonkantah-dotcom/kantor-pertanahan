// pages/index.js
import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

export default function Home() {
  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285322459918";
  const WA_GREETING =
    process.env.NEXT_PUBLIC_WHATSAPP_GREETING ||
    "Halo Admin Kantor Pertanahan Buton, saya ingin mengirim berkas tambahan (non-asli).";
  const WA_HOURS_TXT = "Layanan buka (08:00–16:00 WITA)";

  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);

  const handleReset = useCallback(() => {
    setNomorBerkas("");
    setData(null);
    setWarning("");
    setNotFound(false);
    setError("");
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") handleReset();
    },
    [handleReset]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearch = async () => {
    const trimmed = nomorBerkas.trim();
    if (!trimmed) {
      setWarning("⚠️ Harap masukkan nomor berkas");
      setData(null);
      setNotFound(false);
      setError("");
      return;
    }
    setWarning("");
    setLoading(true);
    setNotFound(false);
    setData(null);
    setError("");
    try {
      const res = await fetch(`/api/proxy?nomor_berkas=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server.");
      const json = await res.json();
      if (json && json.length > 0) setData(json[0]);
      else setNotFound(true);
    } catch (err) {
      console.error(err);
      setError("❌ Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SiKABut | Sistem Kelengkapan Arsip Buton</title>
        <meta name="description" content="Cek Status & Kelengkapan Berkas ATR/BPN secara cepat & mudah" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <header className="w-full flex items-center gap-4 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <Image src="/logo.png" alt="Logo ATR/BPN" width={56} height={56} priority />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">SiKABut</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Sistem Kelengkapan Arsip Buton</p>
          </div>
        </header>

        <main className="flex-1 w-full max-w-2xl px-4 sm:px-6 py-6">
          {/* Hero */}
          <section className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              Cek Status &amp; Kelengkapan Berkas Anda
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Masukkan nomor berkas, tekan <b>Enter</b> untuk mencari. Tekan <b>ESC</b> untuk reset.
            </p>
          </section>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Masukkan Nomor Berkas"
              className="flex-1 rounded-xl px-4 py-3 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-indigo-700/30 dark:text-slate-100"
              value={nomorBerkas}
              onChange={(e) => setNomorBerkas(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* Tombol Cari: gradien + border */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="appearance-none rounded-xl px-5 py-3 font-semibold text-white
                         !bg-gradient-to-br !from-sky-500 !to-indigo-600
                         hover:from-sky-600 hover:to-indigo-700
                         border border-slate-300 dark:border-slate-600
                         disabled:opacity-60 shadow-md"
            >
              🔍 Cari
            </button>

            {/* Tombol Reset: abu-abu + border */}
            <button
              onClick={handleReset}
              className="appearance-none rounded-xl px-5 py-3 font-semibold 
                         bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200
                         border border-slate-300 dark:border-slate-600
                         hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm"
            >
              ♻️ Reset
            </button>
          </div>

          {/* Alerts */}
          {warning && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center">
              {warning}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
            </div>
          )}

          {!loading && notFound && (
            <p className="text-red-600 font-semibold text-center">
              ⚠️ Data dengan nomor berkas &quot;{nomorBerkas}&quot; tidak ditemukan
            </p>
          )}

          {!loading && data && <DetailCard data={data} />}

          {/* WhatsApp Box (satu-satunya tombol WA) */}
          <HotlineBox number={WA_NUMBER} greeting={WA_GREETING} hoursText={WA_HOURS_TXT} />

          {/* FAQ */}
          <section className="mt-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">Pertanyaan yang Sering Diajukan</h3>
            <Faq />
          </section>
        </main>
      </div>
    </>
  );
}

/* ===== Utils ===== */
function normalizeWa(numRaw) {
  let n = String(numRaw || "").replace(/[\s+()-]/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  if (!n.startsWith("62")) n = "62" + n;
  return n;
}
function buildWhatsAppUrl(numRaw, text) {
  const n = normalizeWa(numRaw);
  const encoded = encodeURIComponent(text || "");
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  return isMobile
    ? `https://wa.me/${n}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${n}&text=${encoded}`;
}

/* ===== Komponen tombol WhatsApp ===== */
function WhatsAppHotlineButton({ number, greeting, className = "" }) {
  const handleOpenWA = (e) => {
    e.preventDefault();
    const url = buildWhatsAppUrl(number, greeting);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <a
      href="#"
      onClick={handleOpenWA}
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#25D366] hover:brightness-95 text-white font-semibold shadow-md transition ${className}`}
      aria-label="Buka WhatsApp Hotline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M380.9 97.1C339 55.1 283.2 32 224.5 32 106 32 9.1 128.9 9.1 247.4c0 42.6 11.2 84.1 32.5 120.5L0 480l115.3-40.9c34.8 19 74.1 29 114.1 29h.1c118.5 0 215.4-96.9 215.4-215.4 0-58.6-23.1-114.4-65-156.4zM224.6 438.6h-.1c-35.9 0-71.1-9.6-101.8-27.7l-7.3-4.3-68.4 24.3 23.5-70.2-4.8-7.4C46 321.3 36.6 284.7 36.6 247.4 36.6 146 123 59.6 224.5 59.6c50.3 0 97.6 19.6 133.1 55.1 35.5 35.6 55.1 82.9 55.1 133.1 0 101.5-86.5 190.8-188.1 190.8zm101.6-138.6c-5.6-2.8-33.1-16.3-38.2-18.2-5.1-1.9-8.8-2.8-12.6 2.8s-14.4 18.2-17.7 22c-3.3 3.7-6.5 4.2-12.1 1.4-33.1-16.5-54.8-29.4-76.7-66.7-5.8-10 5.8-9.3 16.5-31 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.6-30.2-17.2-41.3-4.5-10.9-9.1-9.4-12.6-9.6-3.3-.2-7.1-.2-10.9-.2s-10 1.4-15.2 7.1c-5.2 5.6-19.9 19.4-19.9 47.3s20.4 54.8 23.2 58.6c2.8 3.7 40.1 61.4 96.9 86.1 13.5 5.8 24.1 9.3 33 12 13.9 4.4 26.7 3.8 36.8 2.3 11.2-1.7 33.1-13.6 37.8-26.9 4.7-13.1 4.7-24.3 3.3-26.8-1.3-2.4-5.1-3.9-10.7-6.7z" />
      </svg>
      <span>WhatsApp Hotline</span>
    </a>
  );
}

/* ===== Kotak Hotline ===== */
function HotlineBox({ number, greeting, hoursText }) {
  return (
    <section className="mt-8">
      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
        <p className="text-[15px] sm:text-base leading-relaxed mb-3 text-center">
          Jika terdapat <b>berkas yang kurang dan tidak bersifat asli</b>, silakan kirim melalui <b>WhatsApp Hotline</b>.
        </p>
        <p className="text-[15px] sm:text-base leading-relaxed text-center">
          Dokumen asli tetap dibawa langsung ke loket pelayanan.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{hoursText}</span>
          </div>
          <WhatsAppHotlineButton number={number} greeting={greeting} />
        </div>
      </div>
    </section>
  );
}

/* ===== Kartu Detail ===== */
function DetailCard({ data }) {
  const isLengkap =
    !data?.kelengkapan_berkas || String(data.kelengkapan_berkas).trim() === "";

  const formatTanggal = (tgl) =>
    tgl ? new Date(tgl).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-";

  const parseKekurangan = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    return String(val).split(/[,;\n]+/g).map((s) => s.trim()).filter(Boolean);
  };

  const kekuranganList = parseKekurangan(data?.kelengkapan_berkas);

  return (
    <div className="mt-6 p-5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-lg mb-3">📂 Detail Berkas</h3>

      <div className="space-y-1 text-sm sm:text-base">
        <p><b>Nomor Berkas:</b> {data.nomor_berkas}</p>
        <p><b>Tanggal Permohonan:</b> {formatTanggal(data.tanggal_permohonan)}</p>
        <p><b>Nama Pemohon:</b> {data.nama_pemohon}</p>
        <p><b>Jenis Layanan:</b> {data.jenis_layanan}</p>

        <div>
          <b>Kelengkapan:</b>{" "}
          {isLengkap ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">✅ Lengkap</span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">❌ Kurang</span>
          )}
        </div>

        <div>
          <b>Dokumen:</b>{" "}
          {isLengkap ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">✅ Data Lengkap</span>
          ) : kekuranganList.length > 1 ? (
            <div className="mt-1">
              <p className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">❌ List dokumen yang kurang:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-red-700">
                {kekuranganList.map((it, i) => <li key={i}>{it}</li>)}
              </ol>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
              ❌ List dokumen yang kurang: {kekuranganList[0] || String(data.kelengkapan_berkas)}
            </span>
          )}
        </div>

        <p><b>Status Berkas:</b> {data.status_berkas}</p>
        <p><b>Tanggal Selesai:</b> {formatTanggal(data.tanggal_selesai)}</p>
        <p><b>Tahun Permohonan:</b> {data.tahun_permohonan || "-"}</p>

        {isLengkap ? (
          <p className="mt-4 text-center font-bold text-lg text-slate-800 dark:text-slate-200">
            🕒 Berkas Anda sudah lengkap. Mohon menunggu proses verifikasi dan tahapan layanan berikutnya. Status akan diperbarui di aplikasi.
          </p>
        ) : (
          <div className="mt-4 text-center">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              ⚠️ Berkas Anda belum lengkap.
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Silakan lengkapi dokumen sesuai daftar di atas.
            </p>
            {/* Tidak ada kalimat "Dokumen non-asli …" dan tidak ada tombol WA */}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== FAQ ===== */
function Faq() {
  const items = [
    {
      q: "Apa itu SiKABut?",
      a: "SiKABut (Sistem Kelengkapan Arsip Buton) adalah aplikasi untuk mengecek status & kelengkapan berkas permohonan di ATR/BPN.",
    },
    {
      q: "Bagaimana cara mencari berkas saya?",
      a: "Masukkan nomor berkas pada kolom pencarian, lalu tekan tombol Cari atau Enter. Jika data tersedia, detail berkas akan ditampilkan.",
    },
    {
      q: "Mengapa data saya tidak ditemukan?",
      a: "Pastikan nomor berkas sudah benar. Jika masih tidak ditemukan, kemungkinan data belum masuk sistem atau sedang diproses manual di kantor.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-800 dark:text-slate-100"
            aria-expanded={openIndex === i}
            aria-controls={`faq-panel-${i}`}
          >
            {item.q}
            <span className="ml-2">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div id={`faq-panel-${i}`} className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
