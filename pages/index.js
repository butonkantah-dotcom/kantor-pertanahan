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
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleReset = useCallback(() => {
    setNomorBerkas("");
    setData(null);
    setWarning("");
    setNotFound(false);
    setError("");
    if (inputRef.current) inputRef.current.focus();
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
    const trimmedNomor = nomorBerkas.trim();
    if (!trimmedNomor) {
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
      const res = await fetch(
        `/api/proxy?nomor_berkas=${encodeURIComponent(trimmedNomor)}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data dari server.");
      const json = await res.json();
      if (json && json.length > 0) setData(json[0]);
      else setNotFound(true);
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cek Status Berkas ATR/BPN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Lihat status dan kelengkapan berkas Anda secara cepat & mudah"
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Logo */}
        <div className="mb-6">
          <Image src="/logo.png" alt="Logo ATR/BPN" width={100} height={100} />
        </div>

        {/* Judul */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400 text-center">
          Cek Status &amp; Kelengkapan Berkas ATR/BPN
        </h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
          Lihat status dan kelengkapan berkas Anda secara cepat & mudah
        </p>

        {/* Input dan Tombol */}
        <div className="w-full max-w-md mb-4 space-y-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Masukkan Nomor Berkas"
            className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
            value={nomorBerkas}
            onChange={(e) => setNomorBerkas(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          {/* Tombol Cari & Reset */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 w-full max-w-md">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold 
                bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                shadow-md hover:shadow-lg w-full sm:w-auto
                transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 
                text-sm sm:text-base ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              🔍 Cari
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold 
                bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600
                shadow-md hover:shadow-lg w-full sm:w-auto
                transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 
                text-sm sm:text-base"
            >
              ♻️ Reset
            </button>
          </div>

          <small className="text-gray-500 dark:text-gray-400 text-sm text-center block">
            💡 Tekan <b>ESC</b> untuk reset cepat
          </small>
        </div>

        {/* Notifikasi */}
        {warning && (
          <div className="w-full max-w-md mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
            {warning}
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {loading && <p className="text-gray-600 dark:text-gray-300">🔄 Mencari data...</p>}

        {notFound && (
          <p className="text-red-600 dark:text-red-400 font-semibold text-center w-full max-w-md">
            ⚠️ Data dengan nomor berkas &quot;{nomorBerkas}&quot; tidak ditemukan
          </p>
        )}

        {/* Hasil */}
        {data && <DetailCard data={data} />}
      </div>
    </>
  );
}

// Komponen DetailCard
function DetailCard({ data }) {
  const isLengkap =
    !data?.kelengkapan_berkas || data.kelengkapan_berkas.trim() === "";

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className={`mt-5 w-full rounded-2xl p-4 sm:p-5 shadow-sm ring-1 backdrop-blur-sm ${
        isLengkap
          ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-slate-50 ring-emerald-600/30 dark:from-emerald-600/30 dark:to-emerald-700/30 dark:text-emerald-50 dark:ring-emerald-400/20"
          : "bg-gradient-to-br from-rose-400 to-rose-500 text-slate-50 ring-rose-600/30 dark:from-rose-600/30 dark:to-rose-700/30 dark:text-rose-50 dark:ring-rose-400/20"
      }`}
    >
      {/* Judul */}
      <div className="flex items-center gap-2 text-lg font-bold mb-3 text-shadow">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/25 dark:bg-white/10">
          📁
        </span>
        <span>{isLengkap ? "✅" : "❌"} Detail Berkas</span>
      </div>

      {/* Isi */}
      <div className="grid gap-1.5 text-[15px] leading-relaxed text-shadow">
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
        <p>
          <b>Kelengkapan:</b> {data.kelengkapan || "-"}
        </p>
        <p>
          <b>Dokumen:</b>{" "}
          {isLengkap ? (
            <span className="font-semibold bg-white/25 px-1 rounded text-shadow-soft">
              Lengkap ✅
            </span>
          ) : (
            <span className="font-semibold bg-white/25 px-1 rounded text-shadow-soft">
              Kurang ❌ ({data.kelengkapan_berkas})
            </span>
          )}
        </p>
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
