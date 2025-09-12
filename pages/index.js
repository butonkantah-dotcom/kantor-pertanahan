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
        <title>SI-BUTON | Sistem Informasi Berkas Kantor Pertanahan</title>
        <meta
          name="description"
          content="Cek Status & Kelengkapan Berkas ATR/BPN secara cepat & mudah"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        {/* Header Brand — diperbesar */}
        <header className="w-full flex items-center gap-4 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <Image src="/logo.png" alt="Logo ATR/BPN" width={56} height={56} priority />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">SI-BERKAT</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Sistem Informasi Berkas Kantor Pertanahan
            </p>
          </div>
        </header>

        <main className="flex-1 w-full max-w-2xl px-4 sm:px-6 py-6">
          {/* Hero */}
          <section className="text-center mb-6 sm:mb-8">
            <h2
              className="
                text-2xl sm:text-4xl font-extrabold tracking-tight
                text-slate-800 dark:text-slate-100
                sm:text-transparent sm:bg-clip-text
                sm:bg-gradient-to-r sm:from-sky-600 sm:to-indigo-600
                sm:dark:from-indigo-300 sm:dark:to-fuchsia-300
                sm:[-webkit-text-fill-color:transparent]
              "
            >
              Cek Status &amp; Kelengkapan Berkas{" "}
              <span className="whitespace-nowrap">Anda</span>
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
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-60"
            >
              🔍 Cari
            </button>
            <button
              type="button"
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

          {/* Loading: spinner tengah tanpa teks */}
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

          {/* Hasil */}
          {!loading && data && <DetailCard data={data} />}

          {/* FAQ Section */}
          <section className="mt-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
              Pertanyaan yang Sering Diajukan
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
  const isLengkap = !data?.kelengkapan_berkas || String(data.kelengkapan_berkas).trim() === "";

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Menerima string ATAU array dari API
  const parseKekurangan = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map((s) => String(s).trim()).filter(Boolean);
    }
    return String(val)
      .split(/[,;\n]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const kekuranganList = parseKekurangan(data?.kelengkapan_berkas);

  return (
    <div className="mt-6 p-5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-lg mb-3">📂 Detail Berkas</h3>

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
          ) : kekuranganList.length > 1 ? (
            <div className="mt-1">
              <p className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
                ❌ List dokumen yang kurang:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-red-700">
                {kekuranganList.map((item, idx) => (
                  <li key={idx} className="marker:text-red-600">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
              ❌ List dokumen yang kurang: {kekuranganList[0] || String(data.kelengkapan_berkas)}
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
      q: "Mengapa data saya tidak ditemukan?",
      a: "Pastikan nomor berkas sudah benar. Jika masih tidak ditemukan, kemungkinan data belum masuk sistem atau sedang diproses manual di kantor.",
    },
    // Poin #4 dihapus sesuai permintaan
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
