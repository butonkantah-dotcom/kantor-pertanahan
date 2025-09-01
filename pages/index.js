import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔧 Fungsi format tanggal (Indonesia panjang)
  const formatTanggal = (tgl) => {
    if (!tgl) return "Belum ditentukan";
    try {
      return new Date(tgl).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Belum ditentukan";
    }
  };

  const handleSearch = async () => {
    if (!nomorBerkas.trim()) {
      setError("⚠️ Nomor berkas harus diisi!");
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/proxy?nomor_berkas=${encodeURIComponent(nomorBerkas)}`
      );
      const json = await res.json();

      if (json && json.length > 0) {
        setData(json[0]);
      } else {
        setError("❌ Data tidak ditemukan untuk nomor berkas tersebut.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Terjadi kesalahan saat mengambil data.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      {/* === LOGO === */}
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo ATR/BPN" width={120} height={120} />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        Cek Status & Kelengkapan Berkas ATR/BPN
      </h1>

      {/* === Input Pencarian === */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Masukkan Nomor Berkas"
          className="border rounded-lg p-2 w-64"
          value={nomorBerkas}
          onChange={(e) => setNomorBerkas(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Cari
        </button>
      </div>

      {/* === Loading Spinner === */}
      {loading && (
        <div className="text-blue-600 font-medium mb-4 animate-pulse">
          🔄 Sedang mencari data...
        </div>
      )}

      {/* === Error Message === */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* === Hasil Data === */}
      {data && (
        <div className="mt-4 p-5 border rounded-xl bg-white shadow w-full max-w-lg">
          {/* Judul dengan ikon 📂 */}
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-700">
            📂 Detail Informasi Berkas
          </h2>

          <p>
            <b>Nomor Berkas:</b> {data.nomor_berkas}
          </p>
          <p>
            <b>Tanggal Permohonan:</b> {formatTanggal(data.tgl_permohonan)}
          </p>
          <p>
            <b>Nama Pemohon:</b> {data.nama_pemohon}
          </p>
          <p>
            <b>Jenis Layanan:</b> {data.jenis_layanan}
          </p>
          <p>
            <b>Status:</b> {data.status || "Belum diproses"}
          </p>

          {/* === Box Status Kelengkapan === */}
          <div
            className={`p-3 mt-3 rounded-lg font-semibold ${
              data.kelengkapan?.toLowerCase() === "lengkap"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {data.kelengkapan?.toLowerCase() === "lengkap"
              ? "✅ Kelengkapan: Lengkap"
              : "❌ Kelengkapan: Tidak Lengkap"}
          </div>

          {/* === Box Status Dokumen === */}
          <div
            className={`p-3 mt-3 rounded-lg font-semibold ${
              !data.kelengkapan_berkas
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {!data.kelengkapan_berkas
              ? "✅ Dokumen: Lengkap"
              : `❌ Dokumen kurang: ${data.kelengkapan_berkas}`}
          </div>

          <p className="mt-3">
            <b>Tanggal Selesai:</b> {formatTanggal(data.tanggal_selesai)}
          </p>
          <p>
            <b>Tahun:</b> {data.tahun}
          </p>
        </div>
      )}
    </div>
  );
}
