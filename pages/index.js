import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [notFound, setNotFound] = useState(false);

  const inputRef = useRef(null);

  // Auto focus saat halaman load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Listener tombol ESC untuk reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = async () => {
    if (!nomorBerkas.trim()) {
      setWarning("⚠️ Harap masukkan nomor berkas");
      setData(null);
      setNotFound(false);
      return;
    }

    setWarning("");
    setLoading(true);
    setNotFound(false);
    setData(null);

    try {
      const res = await fetch(
        `/api/proxy?nomor_berkas=${encodeURIComponent(nomorBerkas)}`
      );
      const json = await res.json();

      if (json && json.length > 0) {
        setData(json[0]);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNomorBerkas("");
    setData(null);
    setWarning("");
    setNotFound(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const isLengkap =
    !data?.kelengkapan_berkas || data.kelengkapan_berkas.trim() === "";
  const cardColor = isLengkap ? "green" : "red";
  const cardIcon = isLengkap ? "✅" : "❌";

  const cardStyles = {
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      {/* === LOGO === */}
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo ATR/BPN" width={120} height={120} />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Cek Status & Kelengkapan Berkas ATR/BPN
      </h1>

      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Masukkan Nomor Berkas"
            className="border rounded-lg p-2 w-64"
            value={nomorBerkas}
            onChange={(e) => setNomorBerkas(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Cari
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            title="Shortcut: ESC"
          >
            Reset
          </button>
        </div>
        <small className="text-gray-500 text-sm">
          💡 Tekan <b>ESC</b> untuk reset cepat
        </small>
      </div>

      {warning && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {warning}
        </div>
      )}

      {loading && <p className="text-gray-600">🔄 Mencari data...</p>}

      {notFound && (
        <p className="text-red-600 font-semibold">
          ⚠️ Data dengan nomor berkas "{nomorBerkas}" tidak ditemukan
        </p>
      )}

      {data && (
        <div
          className={`mt-4 p-4 border rounded-xl w-[400px] ${cardStyles[cardColor]}`}
        >
          {/* === Judul Card dengan Ikon === */}
          <h2 className="flex items-center gap-2 font-bold mb-3">
            <span role="img" aria-label="folder">📂</span>
            {cardIcon} Detail Berkas
          </h2>

          <p><b>Nomor Berkas:</b> {data.nomor_berkas}</p>
          <p><b>Tanggal Permohonan:</b> {formatTanggal(data.tanggal_permohonan)}</p>
          <p><b>Nama Pemohon:</b> {data.nama_pemohon}</p>
          <p><b>Jenis Layanan:</b> {data.jenis_layanan}</p>
          <p><b>Kelengkapan:</b> {data.kelengkapan}</p>
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
          <p><b>Tahun Permohonan:</b> {data.tahun_permohonan}</p>
        </div>
      )}
    </div>
  );
}
