// pages/api/getData.js
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nomor } = req.query;

  // Validasi input
  if (!nomor) {
    return res.status(400).json({ error: "Nomor berkas wajib diisi" });
  }

  /**
   * ⬇️ Disini kamu bisa ganti dengan query ke database / API / Google Spreadsheet
   * Misalnya:
   * const result = await fetchFromDatabase(nomor);
   */

  // Untuk sementara, langsung balas "belum ada data"
  return res.status(404).json({ error: "Nomor berkas tidak ditemukan di sistem" });
}
