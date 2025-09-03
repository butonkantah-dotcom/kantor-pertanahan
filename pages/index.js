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

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") handleReset();
  }, [handleReset]);

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
        {/* warna address bar */}
        <meta name="theme-color" content="#e2e8f0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)" />
        <meta
          name="description"
          content="Lihat status dan kelengkapan berkas Anda secara cepat & mudah"
        />
      </Head>

      {/* BG: light gradient lembut, dark solid gelap */}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-indigo-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#0b1220]">
        {/* Container sempit + safe area */}
        <div className="mx-auto max-w-screen-sm safe-px safe-pt safe-pb flex flex-col items-center">
          {/* Logo responsif */}
          <div className="mb-5">
            <Image
              src="/logo.png"
              alt="Logo ATR/BPN"
              width={100}
              height={100}
              priority
              sizes="(max-width: 640px) 64px, 100px"
              className="w-16 h-16 sm:w-[100px] sm:h-[100px]"
            />
          </div>

          {/* Judul + deskripsi */}
          <h1 className="text-[20px] sm:text-3xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-indigo-300 dark:to-fuchsia-300 tracking-tight">
            Cek Status &amp; Kelengkapan Berkas ATR/BPN
          </h1>
          <p className="text-[13px] sm:text-sm text-center text-slate-600 dark:text-slate-300 mb-5">
            Lihat status dan kelengkapan berkas Anda secara cepat & mudah
          </p>

          {/* Input & tombol */}
          <div className="w-full mb-4 space-y-3">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              placeholder="Masukkan Nomor Berkas"
              className="w-full rounded-xl border border-slate-300 bg-white/85 shadow-sm px-4 py-3 text-base
                         focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400
                         dark:bg-white/10 dark:border-white/10 dark:placeholder-slate-400 dark:text-slate-100"
              value={nomorBerkas}
              onChange={(e) => setNomorBerkas(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* Grid tombol: 2 kolom di HP, berjejer di layar besar */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-center sm:gap-3 mt-1">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white
                            bg-gradient-to-br from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600
                            shadow-sm hover:shadow-md ring-1 ring-inset ring-white/40 transition-all duration-200
                            active:scale-[0.98] sm:w-auto dark:from-indigo-500 dark:to-fuchsia-500 dark:hover:from-indigo-600 dark:hover:to-fuchsia-600 ${
                              loading ? 'opacity-60 cursor-not-allowed' : 'col-span-1'
                            }`}
              >
                🔍 Cari
              </button>

              <button
                onClick={handleReset}
                className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold
                           bg-white text-slate-700 hover:text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300
                           shadow-sm hover:shadow-md transition-all duration-200 sm:w-auto
                           dark:bg-white/10 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/15"
              >
                ♻️ Reset
              </button>
            </div>

            <small className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-center block">
              💡 Tekan <b>ESC</b> untuk reset cepat
            </small>
          </div>

          {/* Notifikasi */}
          {warning && (
            <div className="w-full mb-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-center shadow-sm
                            dark:bg-amber-400/10 dark:border-amber-300/20 dark:text-amber-200">
              {warning}
            </div>
          )}

          {error && (
            <div className="w-full mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center shadow-sm
                            dark:bg-rose-400/10 dark:border-rose-300/20 dark:text-rose-200">
              {error}
            </div>
          )}

          {loading && <p className="text-slate-600 dark:text-slate-300">🔄 Mencari data...</p>}

          {notFound && (
            <p className="text-rose-600 dark:text-rose-300 font-semibold text-center w-full">
              ⚠️ Data dengan nomor berkas &quot;{nomorBerkas}&quot; tidak ditemukan
            </p>
          )}

          {/* Hasil */}
          {data && <DetailCard data={data} />}
        </div>
      </div>
    </>
  );
}

/** DetailCard: teks lebih terlihat (text-shadow) + varian dark */
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
      <div className="flex items-center gap-2 text-lg font-bold mb-3 text-shadow">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/25 dark:bg-white/10">📁</span>
        <span>{isLengkap ? "✅" : "❌"} Detail Berkas</span>
      </div>

      <div className="grid gap-1.5 text-[15px] leading-relaxed text-shadow">
        <p><b>Nomor Berkas:</b> {data.nomor_berkas}</p>
        <p><b>Tanggal Permohonan:</b> {formatTanggal(data.tanggal_permohonan)}</p>
        <p><b>Nama Pemohon:</b> {data.nama_pemohon}</p>
        <p><b>Jenis Layanan:</b> {data.jenis_layanan}</p>
        <p><b>Kelengkapan:</b> {data.kelengkapan || "-"}</p>
        <p>
          <b>Dokumen:</b>{" "}
          {isLengkap ? (
            <span className="font-semibold bg-white/25 px-1 rounded text-shadow-soft">Lengkap ✅</span>
          ) : (
            <span className="font-semibold bg-white/25 px-1 rounded text-shadow-soft">
              Kurang ❌ ({data.kelengkapan_berkas})
            </span>
          )}
        </p>
        <p><b>Status Berkas:</b> {data.status_berkas}</p>
        <p><b>Tanggal Selesai:</b> {formatTanggal(data.tanggal_selesai)}</p>
        <p><b>Tahun Permohonan:</b> {data.tahun_permohonan || "-"}</p>
      </div>
    </div>
  );
}
