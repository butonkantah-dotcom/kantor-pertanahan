// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi cari data
  const handleSearch = async () => {
    if (!nomor.trim()) {
      setError("Nomor berkas wajib diisi");
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/getData?nomor=${nomor}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Terjadi kesalahan");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi reset
  const handleReset = () => {
    setNomor("");
    setData(null);
    setError(null);
  };

  // Reset cepat dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo ATR/BPN"
        className="w-32 h-32 mb-4"
      />

      {/* Judul */}
      <h1 className="text-2xl font-bold text-center mb-2">
        Cek Status & Kelengkapan Berkas ATR/BPN
      </h1>
      <p className="text-sm text-center text-gray-600 mb-6">
        Lihat status dan kelengkapan berkas Anda secara cepat & mudah
      </p>

      {/* Input */}
      <input
        type="text"
        placeholder="Masukkan Nomor Berkas"
        value={nomor}
        onChange={(e) => setNomor(e.target.value)}
        className="w-full max-w-md border border-gray-400 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tombol Aksi */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔍 Cari
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
        >
          ⏪ Reset
        </button>
      </div>

      {/* Info Reset Cepat */}
      <p className="text-gray-600 text-sm mb-6">
        💡 Tekan <b>ESC</b> untuk mengatur ulang dengan cepat
      </p>

      {/* Status Loading */}
      {loading && <p className="text-blue-600 font-medium">🔄 Sedang mencari...</p>}

      {/* Error */}
      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {/* Hasil */}
      {data && (
        <div className="bg-white shadow-md rounded-lg p-4 border w-full max-w-md text-center">
          <p><b>Nomor Berkas:</b> {data.berkas}</p>
          <p><b>Nama:</b> {data.nama}</p>
          <p><b>Status:</b> {data.status}</p>
          <p><b>Tahun Permohonan:</b> {data.tahun_permohonan}</p>
        </div>
      )}
    </div>
  );
}
