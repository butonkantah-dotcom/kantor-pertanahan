import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Format tanggal panjang + fallback
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

  // 🔹 Status kelengkapan dengan card berwarna
  const KelengkapanStatus = ({ val }) => {
    if (!val || val.trim() === "") {
      return (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 font-semibold">
          ✅ Data Lengkap
        </div>
      );
    }
    return (
      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
        ❌ Masih ada kekurangan: {val}
      </div>
    );
  };

  const handleSearch = async () => {
    try {
      setError("");
      setData(null);
      setLoading(true);

      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbzY7NFMvt_lUWSBJaJ5CHB9BONrl3y4WpcG0vFGtTnDie_oMvyMOdJhgMTrQki8DAXi/exec?nomor_berkas=${encodeURIComponent(
          nomorBerkas
        )}`
      );

      const json = await res.json();

      if (!json || (Array.isArray(json) && json.length === 0)) {
        setError(`⚠️ Nomor berkas "${nomorBerkas}" tidak ditemukan.`);
      } else {
        setData(Array.isArray(json) ? json[0] : json);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
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

      {/* === Input Cari === */}
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            "Cari"
          )}
        </button>
      </div>

      {/* === Warning === */}
      {error && (
        <div className="mt-4 p-4 border rounded-xl bg-red-50 text-red-700 w-full max-w-md text-center">
          {error}
        </div>
      )}

      {/* === Hasil Data === */}
      {data && (
        <div className="mt-4 p-4 border rounded-xl bg-white shadow w-full max-w-md space-y-2">
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
            <b>Kelengkapan:</b> {data.kelengkapan}
          </p>
          <div>
            <b>Dokumen:</b>
            <KelengkapanStatus val={data.kelengkapan_berkas} />
          </div>
          <p>
            <b>Status:</b> {data.status_berkas || "Belum diproses"}
          </p>
          <p>
            <b>Tanggal Selesai:</b> {formatTanggal(data.tanggal_selesai)}
          </p>
          <p>
            <b>Tahun:</b> {data.tahun_permohonan}
          </p>
        </div>
      )}
    </div>
  );
}
