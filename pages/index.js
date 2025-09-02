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

  // Autofocus input saat halaman dibuka
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Reset pakai tombol ESC
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      handleReset();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Fungsi cari
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
      const res = await fetch(`/api/proxy?nomor_berkas=${encodeURIComponent(trimmedNomor)}`);

      if (!res.ok) {
        throw new Error("Gagal mengambil data dari server.");
      }

      const json = await res.json();

      if (json && json.length > 0) {
        setData(json[0]);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setNomorBerkas("");
    setData(null);
    setWarning("");
    setNotFound(false);
    setError("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      <Head>
        <title>Cek Status Berkas ATR/BPN</title>
        <meta
          name="description"
          content="Lihat status dan kelengkapan berkas Anda secara cepat & mudah"
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gray-100">
        {/* === Logo === */}
        <div className="mb-6">
          <Image src="/logo.png" alt="Logo ATR/BPN" width={100} height={100} />
        </div>

        {/* === Judul === */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-blue-700 text-center">
          Cek Status &amp; Kelengkapan Berkas ATR/BPN
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Lihat status dan kelengkapan berkas Anda secara cepat & mudah
        </p>

        {/* === Form Input === */}
        <div className="w-full max-w-md mb-4 space-y-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Masukkan Nomor Berkas"
            className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nomorBerkas}
            onChange={(e) => setNomorBerkas(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          {/* === Tombol Aksi === */}
          <div className="flex justify-center gap-3 mt-2 flex-wrap w-full max-w-md">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition text-base w-full sm:w-auto justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span role="img" aria-label="Cari">🔍</span>
              <span className="truncate">Cari</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-semibold bg-gray-600 hover:bg-gray-700 transition text-base w-full sm:w-auto justify-center"
            >
              <span role="img" aria-label="Reset">🔄</span>
              <span className="truncate">Reset</span>
            </button>
          </div>

          <small className="text-gray-500 text-sm text-center block">
            💡 Tekan <b>ESC</b> untuk reset cepat
          </small>
        </div>

        {/* === Alerts === */}
        {warning && (
          <div className="w-full max-w-md mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center">
            {warning}
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading && <p className="text-gray-600">🔄 Mencari data...</p>}

        {notFound && (
          <p className="text-red-600 font-semibold text-center w-full max-w-md">
            ⚠️ Data dengan nomor berkas &quot;{nomorBerkas}&quot; tidak ditemukan
          </p>
        )}

        {/* === Hasil Pencarian === */}
        {data && <DetailCard data={data} />}
      </div>
    </>
  );
}

// === Komponen Detail Hasil ===
function DetailCard({ data }) {
  const isLengkap =
    !data?.kelengkapan_berkas || data.kelengkapan_berkas.trim() === "";
  const cardColor = isLengkap ? "green" : "red";
  const cardIcon = isLengkap ? "✅" : "❌";

  const cardStyles = {
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

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
      className={`mt-4 p-4 border rounded-xl w-full max-w-md ${cardStyles[cardColor]}`}
    >
      <h2 className="flex items-center gap-2 font-bold mb-3 text-lg">
        <span role="img" aria-label="folder">📂</span>
        {cardIcon} Detail Berkas
      </h2>

      <div className="space-y-1 text-sm sm:text-base">
        <p><b>Nomor Berkas:</b> {data.nomor_berkas}</p>
        <p><b>Tanggal Permohonan:</b> {formatTanggal(data.tanggal_permohonan)}</p>
        <p><b>Nama Pemohon:</b> {data.nama_pemohon}</p>
        <p><b>Jenis Layanan:</b> {data.jenis_layanan}</p>
        <p><b>Kelengkapan:</b> {data.kelengkapan || "-"}</p>
        <p>
          <b>Dokumen:</b>{" "}
          {isLengkap ? (
            <span className="text-green-700 font-semibold">Lengkap ✅</span>
          ) : (
            <span className="text-red-700 font-semibold">
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
