export default async function handler(req, res) {
  const { nomor_berkas } = req.query;

  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzY7NFMvt_lUWSBJaJ5CHB9BONrl3y4WpcG0vFGtTnDie_oMvyMOdJhgMTrQki8DAXi/exec?nomor_berkas=${encodeURIComponent(nomor_berkas)}`
    );

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
