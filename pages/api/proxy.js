// pages/api/proxy.js

// (Opsional) taruh URL Apps Script di ENV agar mudah diganti tanpa ubah kode:
// proses via: GAS_ENDPOINT_URL="https://script.google.com/macros/s/....../exec"
const GAS_URL =
  process.env.GAS_ENDPOINT_URL ||
  "https://script.google.com/macros/s/AKfycbzY7NFMvt_lUWSBJaJ5CHB9BONrl3y4WpcG0vFGtTnDie_oMvyMOdJhgMTrQki8DAXi/exec";

export default async function handler(req, res) {
  // CORS minimal (sebenarnya tidak wajib karena dipanggil dari domain yang sama)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { nomor_berkas = "" } = req.query;
  const trimmed = String(nomor_berkas || "").trim();

  if (!trimmed) {
    return res.status(400).json({ error: "Parameter 'nomor_berkas' wajib diisi." });
  }

  try {
    // Hindari cache
    const url = `${GAS_URL}?nomor_berkas=${encodeURIComponent(trimmed)}&ts=${Date.now()}`;

    const response = await fetch(url, {
      // Next.js (Node 18+) sudah ada fetch global
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res
        .status(502)
        .json({ error: "Gagal mengambil data dari sumber", detail: text || response.statusText });
    }

    const data = await response.json().catch(() => null);

    // Pastikan selalu kirim JSON array atau objek apa adanya dari GAS
    return res.status(200).json(data ?? []);
  } catch (err) {
    console.error("[/api/proxy] Error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan internal saat mengambil data." });
  }
}
