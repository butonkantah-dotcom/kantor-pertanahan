import { useState } from "react";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(
     // `https://script.google.com/macros/s/AKfycbzY7NFMvt_lUWSBJaJ5CHB9BONrl3y4WpcG0vFGtTnDie_oMvyMOdJhgMTrQki8DAXi/exec?nomor_berkas=${encodeURIComponent(nomorBerkas)}`
    const res = await fetch(`/api/proxy?nomor_berkas=${encodeURIComponent(nomorBerkas)}`);
    );
    const json = await res.json();
    setData(json[0] || null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
          Cek Status Berkas ATR/BPN
        </h1>

        <input
          type="text"
          value={nomorBerkas}
          onChange={(e) => setNomorBerkas(e.target.value)}
          placeholder="Masukkan Nomor Berkas"
          className="w-full p-3 border rounded-xl mb-3"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
          Cari
        </button>

        {data && (
          <div className="mt-4 p-4 border rounded-xl bg-gray-50">
            <p><b>Nomor Berkas:</b> {data.nomor_berkas}</p>
            <p><b>Nama Pemohon:</b> {data.nama_pemohon}</p>
            <p><b>Jenis Layanan:</b> {data.jenis_layanan}</p>
            <p><b>Status:</b> {data.status_berkas}</p>
            <p><b>Kelengkapan:</b> {data.kelengkapan}</p>
            <p><b>Dokumen:</b> {data.kelengkapan_berkas}</p>
            <p><b>Tanggal Selesai:</b> {data.tanggal_selesai}</p>
            <p><b>Tahun:</b> {data.tahun}</p>
          </div>
        )}
      </div>
    </div>
  );
}
