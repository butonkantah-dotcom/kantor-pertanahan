// pages/index.js
import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        <title>SI-BERKAT | Sistem Informasi Berkas Kantor Pertanahan</title>
        <meta name="description" content="Cek Status & Kelengkapan Berkas ATR/BPN secara cepat & mudah" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        {/* Header Brand */}
        <header className="w-full flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <Image src="/logo.png" alt="Logo ATR/BPN" width={40} height={40} />
          <div>
            <h1 className="text-lg font-bold">SI-BERKAT</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sistem Informasi Berkas Kantor Pertanahan
            </p>
          </div>
        </header>

        <main className="flex-1 w-full max-w-2xl px-4 sm:px-6 py-6">
          {/* Hero */}
          <section className="text-center mb-6 sm:mb-8">
            <h2
              className="
                text-2xl sm:text-3xl font-extrabold tracking-tight
                text-slate-800 dark:text-slate-100
                sm:text-transparent sm:bg-clip-text
                sm:bg-gradient-to-r sm:from-sky-600 sm:to-indigo-600
                sm:dark:from-indigo-300 sm:dark:to-fuchsia-300
                sm:[-webkit-text-fill-color:transparent]
              "
            >
              Cek Status &amp; Kelengkapan Berkas Anda
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Masukkan nomor berkas, tekan <b>Enter</b> untuk mencari. Tekan <b>ESC</b> untuk reset.
            </p>
          </section>

          {/* Input & Tombol */}
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
            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-60"
            >
              🔍 Cari
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl px-5 py-3 font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              ♻️ Reset
            </button>
          </div>

          {/* Notifikasi */}
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
          {loading && <p className="text-slate-600 dark:text-slate-300">🔄 Mencari data...</p>}
          {notFound && (
            <p className="text-red-600 font-semibold text-center">
              ⚠️ Data dengan nomor berkas &quot;{nomorBerkas}&quot; tidak ditemukan
            </p>
          )}

          {/* Hasil */}
          {data && <DetailCard data={data} />}

          {/* FAQ Section */}
          <section className="mt-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
              ❓ Pertanyaan yang Sering Diajukan
            </h3>
            <Faq />
          </section>
        </main>
      </div>
    </>
  );
}

/* ===== Detail Card ===== */
function DetailCard({ data }) {
  const isLengkap = !data?.kelengkapan_berkas || data.kelengkapan_berkas.trim() === "";

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("📋 Data disalin ke clipboard");
  };

  const onShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Detail Berkas",
        text: `Detail Berkas ${data.nomor_berkas}`,
        url: window.location.href,
      });
    } else {
      alert("Fitur share tidak didukung di browser ini");
    }
  };

  return (
    <div className="mt-6 p-5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="flex items-center gap-2 font-bold text-lg mb-3">📂 Detail Berkas</h3>

      <div className="space-y-1 text-sm sm:text-base">
        <p>
          <b>Nomor Berkas:</b> {data.nomor_berkas}
        </p>
        <p>
          <b>Tanggal Permohonan:</b> {formatTanggal(data.tanggal_permohonan)}
        </p>
        <p>
          <b>Nama Pemohon:</b> {data.nama_pemohon}
        </p>
        <p>
          <b>Jenis Layanan:</b> {data.jenis_layanan}
        </p>

        {/* Kelengkapan */}
        <div>
          <b>Kelengkapan:</b>{" "}
          {isLengkap ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">
              ✅ Lengkap
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
              ❌ Kurang
            </span>
          )}
        </div>

        {/* Dokumen */}
        <div>
          <b>Dokumen:</b>{" "}
          {isLengkap ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">
              ✅ Data Lengkap
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
              ❌ Masih ada kekurangan: {data.kelengkapan_berkas}
            </span>
          )}
        </div>

        <p>
          <b>Status Berkas:</b> {data.status_berkas}
        </p>
        <p>
          <b>Tanggal Selesai:</b> {formatTanggal(data.tanggal_selesai)}
        </p>
        <p>
          <b>Tahun Permohonan:</b> {data.tahun_permohonan || "-"}
        </p>
      </div>

      {/* Aksi Cepat */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <button
          onClick={onCopy}
          className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          📋 <span className="text-xs">Salin</span>
        </button>
        <button
          onClick={onShare}
          className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          🔗 <span className="text-xs">Bagikan</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          🖨️ <span className="text-xs">Cetak</span>
        </button>
      </div>
    </div>
  );
}

/* ===== FAQ (Accordion) ===== */
function Faq() {
  const items = [
    {
      q: "Apa itu SI-BERKAT?",
      a: "SI-BERKAT (Sistem Informasi Berkas Kantor Pertanahan) adalah aplikasi untuk mengecek status & kelengkapan berkas permohonan di ATR/BPN.",
    },
    {
      q: "Bagaimana cara mencari berkas saya?",
      a: "Masukkan nomor berkas pada kolom pencarian, lalu tekan tombol Cari atau Enter. Jika data tersedia, detail berkas akan ditampilkan.",
    },
    {
      q: "Kenapa data saya tidak ditemukan?",
      a: "Pastikan nomor berkas sudah benar. Jika masih tidak ditemukan, kemungkinan data belum masuk sistem atau sedang diproses manual di kantor.",
    },
    {
      q: "Apakah bisa digunakan di HP?",
      a: "Ya, SI-BERKAT sudah responsif dan mendukung tampilan di smartphone maupun desktop, serta mendukung mode gelap otomatis.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-800 dark:text-slate-100"
          >
            {item.q}
            <span className="ml-2">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
