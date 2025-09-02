import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [nomorBerkas, setNomorBerkas] = useState("");
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [shake, setShake] = useState(false);

  const inputRef = useRef(null);

  const handleSearch = () => {
    const trimmedNomor = nomorBerkas.trim();

    if (!trimmedNomor) {
      setWarning("⚠️ Harap masukkan nomor berkas");
      setData(null);
      setNotFound(false);
      setError("");

      // trigger animasi shake
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setWarning("");
    setError("");
    setNotFound(false);

    // Simulasi pencarian (dummy)
  /*  if (trimmedNomor === "12345") {
      setData({
        nama: "Andi Saputra",
        berkas: "12345",
        status: "✅ Disetujui",
      });
    } else {
      setData(null);
      setNotFound(true);
    }
  };*/

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Cari Nomor Berkas
        </h1>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Masukkan Nomor Berkas"
          className={`border rounded-lg p-3 w-full text-base 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500 transition 
            ${shake ? "animate-shake border-red-500" : ""}`}
          value={nomorBerkas}
          onChange={(e) => setNomorBerkas(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        {/* Tombol Cari */}
        <Button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-2 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          Cari
        </Button>

        {/* Warning */}
        {warning && (
          <p className="text-red-500 text-sm text-center animate-shake">
            {warning}
          </p>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Hasil ditemukan */}
        {data && (
          <Card className="mt-4 animate-fadeIn transform transition-transform hover:scale-105">
            <CardContent className="p-4 space-y-2">
              <p>
                <strong>Nama:</strong> {data.nama}
              </p>
              <p>
                <strong>Nomor Berkas:</strong> {data.berkas}
              </p>
              <p>
                <strong>Status:</strong> {data.status}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Hasil tidak ditemukan */}
        {notFound && (
          <p className="text-yellow-600 text-center mt-4 animate-fadeIn">
            ❌ Nomor berkas tidak ditemukan
          </p>
        )}
      </div>
    </main>
  );
}
