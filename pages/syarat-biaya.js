// pages/syarat-biaya.js
import Head from "next/head";
import { useMemo, useState } from "react";

const DATA = [
  {
    layanan: "Formulir Ahli Media",
    syarat: [
      "Identitas pemohon dan penerima kuasa (fotocopy KTP)",
      "Formulir Pendaftaran",
      "Sertifikat Tanah (Asli)",
    ],
    biaya: ["Tarif Pendaftaran : Rp. 50.000,00",
           "Tarif Kutipan : Rp. 100.000,00"],
    waktu: ["Estimasi 14 (empat belas) hari kerja"],
  },

  {
    layanan: "Formulir Pemetaan Bidang Tanah",
    subjudul: "Pemetaan Tanah PKD",
    syarat: [
      "Identitas pemohon dan penerima kuasa (fotocopy KTP)",
      "Formulir Pendaftaran Pemetaan Bidang",
      "FC Sertifikat Tanah",
      ],
    biaya: {
    keterangan: "Tarif Pelayanan Pengukuran disesuaikan dengan luas tanah | Biaya Pengukuran",
    rumus: [
      {
        luas: "Luas tanah sampai dengan 10 hektar:",
        formula: "Tu = (L / 500 × HSBKu) + Rp100.000,00",
      },
      {
        luas: "Luas tanah lebih dari 10 hektar sampai dengan 1.000 hektar:",
        formula: "Tu = (L / 4.000 × HSBKu) + Rp14.000.000,00",
      },
      {
        luas: "Luas tanah lebih dari 1.000 hektar:",
        formula: "Tu = (L / 10.000 × HSBKu) + Rp134.000.000,00",
      },
    ],
    pendaftaran: "Tarif Pendaftaran: Rp 50.000,00",
  },
    waktu: ["14 (empat belas) hari kerja"],
  },

  {
    layanan: "Permohonanan Pengukuran",
    subjudul: "Pengukuran Standar, Pengembalian Batas / Rekonstruksi, Permohonan Hak Atas Tanah",
    syarat: [
      "Surat permohonan (DI 13)",
      "Tanda bukti hak atas tanah (SertiFikat pipil/Surat Ketetapan Ipeda SPPT. Padol/Surat Jual Beli Tanah sebelum tahun 1962/Berita acara penelitian lapangan obyek P 2 T)",
      "Tanda bukti pelunasan PBB tahun terakhir",
      "Surat pernyataan persetujuan para penyanding",
      "Sketsa tanah",
      "Surat kuasa tertulis yang sah",
      "Identitas pemohon dan penerima kuasa (fotocopy KTP)",
      ],
    biaya: {
    keterangan: "Tarif Pelayanan Pengukuran disesuaikan dengan luas tanah | Biaya Pengukuran",
    rumus: [
      {
        luas: "Luas tanah sampai dengan 10 hektar:",
        formula: "Tu = (L / 500 × HSBKu) + Rp 100.000,00",
      },
      {
        luas: "Luas tanah lebih dari 10 hektar sampai dengan 1.000 hektar:",
        formula: "Tu = (L / 4.000 × HSBKu) + Rp 14.000.000,00",
      },
      {
        luas: "Luas tanah lebih dari 1.000 hektar:",
        formula: "Tu = (L / 10.000 × HSBKu) + Rp134.000.000,00",
      },
    ],
    pendaftaran: "Tarif Pendaftaran: Rp 50.000,00",
  },
    waktu: ["14 (empat belas) hari kerja"],
  },

  {
    layanan: "Permohonanan Pendaftaran Tanah Untuk Pertama Kali",
    subjudul: "Tanah Belum Terdaftar",
    syarat: [
      "Surat permohonan (DI 13)",
      "Bukti hak lengkap (sesuai PP24/97 Pasal 24 Jo. Peraturan Menteri Negara Agraria/KPBN No. 3 Tahun 1997) (Apabila bukti hak tidak lengkap atau tidak ditambah dengan Surat Pernyataan dari pemohon penguasaan fisik bidang tanah sekurang-kurangnya 20 tahun disaksikan 2 orang saksi diketahui Kades/Lurah dan Apabila bukti hak tidak ada ditambah dengan surat keterangan Kepala Desa/Lurah)",
      "Fotocopy identitas (KTP, KK) pemohon dan kuasa apabila dikuasakan, yang telah dicocokkan dengan aslinya oleh petugas loket",
      "Surat kuasa tertulis dan penerima hak apabila yang mengajukan permohonan pendaftaran hak bukan penerima hak",
      "Akta PPAT sesuai Pasal 103 PMNA/KPBN No. 3 Tahun 1997",
      ],
    biaya: {
    keterangan: "Tarif Pelayanan Pengukuran disesuaikan dengan luas tanah",
    rumus: [
      {
        luas: "Tarif Pengukuran:",
        formula: "Tu = (L / 500 × HSBKu) + Rp 100.000,00 (A)",
      },
      {
        luas: "Tarif Panitia A:",
        formula: "Tpa = (L / 500 × HSBKpa) + Rp 350.000,00 (B)",
      },
      {
        luas: "Tarif Pendaftaran Pertama Kali: Rp 50.000,00",
      },
      {
        luas: "Tarif Kutipan Surat Ukur: Rp 100.000,00",
      },
    ],
    pendaftaran: "Total Tarif: A + B + Rp.50.000,00 + Rp. 100.000,00",
  },
    waktu: ["98 (sembilan puluh delapan) hari kerja"],
  },

  {
    layanan: "Pertimbangan Teknis Pertanahan",
    subjudul: "Persetujuan atau Penolakan Izin Lokasi, Penegasan Status dan Rekomendasi Penguasaan Tanah Timbul, Perubahan Penggunaan dan Pemanfaatan Tanah",
    syarat: [
      "Permohonan IPPT",
      "Fotocopy KTP Akta Pendirian",
      "Fotocopy bukti pemilikan",
      "Sketsa dan letak lokasi",
      "Pernyataan rencana penguunaan dan pemanfaatan tanah serta tahapan kegiatan",
      "Proposal rencana penggunaan dan pemanfaatan tanah serta tahapan kegiatan",
      "Rekomendasi dari instansi teknis terkait (6 dan 7 untuk Badan Hukum dan Instansi Pemerintah)",
      "Surat Kuasa",
      "Surat-Surat lain",
      ],
    biaya: {
    rumus: [
      {
        luas: "Dalam rangka Ijin lokasi:",
        formula: "Tptil = (L / 500 × HSBKpb) + Rp 5.000.000,00",
      },
      {
        luas: "Dalam rangka penetapan lokasi:",
        formula: "L / 500 × Tptil",
      },
      {
        luas: "Dalam rangka Ijin perubahan penggunaan:",
        formula: "L Tptil = (L / 500 x HSBKpb) + Rp. 350.000,00",
      },
    ],
  },
    waktu: ["14 (empat belas) hari kerja"],
  },

    {
    layanan: "Pendaftaran Hak Tanggungan",
    syarat: [
      "Surat Pengantar dari PPAT",
      "Surat Permohonan dari Penerima HT (Kreditur)",
      "Sertifikat Asli",
    ],
    biaya: ["PNBP sesuai ketentuan"],
    waktu: ["Sesuai ketentuan"],
  },

  

  
  
  {
    layanan: "Balik Nama",
    syarat: [
      "KTP & KK pemohon",
      "Dokumen peralihan (AJB/hibah/waris sesuai kasus)",
      "Sertipikat asli",
    ],
    biaya: ["PNBP sesuai ketentuan (berdasarkan jenis layanan & objek)"],
    waktu: ["Sesuai ketentuan"],
  },
  {
    layanan: "Roya / Penghapusan Hak Tanggungan",
    syarat: [
      "KTP pemohon",
      "Sertipikat asli",
      "Surat roya / dokumen pelunasan (sesuai ketentuan)",
    ],
    biaya: ["PNBP sesuai ketentuan"],
    waktu: ["Sesuai ketentuan"],
  },
  {
    layanan: "Pendaftaran Tanah Pertama Kali",
    syarat: [
      "KTP & KK",
      "Alas hak / riwayat tanah",
      "Dokumen pendukung sesuai ketentuan",
    ],
    biaya: ["PNBP sesuai ketentuan"],
    waktu: ["Sesuai ketentuan"],
  },
  {
    layanan: "Pemecahan Sertipikat",
    syarat: [
      "KTP pemohon",
      "Sertipikat asli",
      "Dokumen pendukung sesuai ketentuan",
    ],
    biaya: ["PNBP sesuai ketentuan"],
    waktu: ["Sesuai ketentuan"],
  },
  {
    layanan: "Penggabungan Sertipikat",
    syarat: [
      "KTP pemohon",
      "Sertipikat asli yang akan digabung",
      "Dokumen pendukung sesuai ketentuan",
    ],
    biaya: ["PNBP sesuai ketentuan"],
    waktu: ["Sesuai ketentuan"],
  },
  {
    layanan: "Pengecekan Sertipikat",
    syarat: [
      "Formulir permohonan yang diisi dan ditandatangani",
      "Surat kuasa apabila dikuasakan",
      "Fotokopi identitas (KTP)",
      "Sertipikat hak atas tanah / HMSRS",
      "Surat pengantar dari PPAT (jika ada)",
    ],
    biaya: ["Tarif Pendaftaran: Rp50.000"],
    waktu: ["1 (satu) hari kerja"],
  },
];

export default function SyaratBiaya() {
  const [q, setQ] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return DATA;

    return DATA.filter((d) => {
      const inName = d.layanan.toLowerCase().includes(query);
      const inReq = d.syarat.join(" ").toLowerCase().includes(query);
      return inName || inReq;
    });
  }, [q]);

  return (
    <>
      <Head>
        <title>Persyaratan, Biaya & Waktu Layanan | SiKABut</title>
      </Head>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <section className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            📋 Persyaratan, Biaya & Waktu Layanan
          </h1>

          <div className="mt-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="🔎 Cari layanan..."
              className="w-full rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="mt-6 space-y-3">
            {filtered.map((d, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={d.layanan}
                  className="rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex justify-between p-4 text-left"
                  >
                    <div>
                      <div className="font-bold">
                        {d.layanan}
                      </div>


                      {isOpen && d.subjudul && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                          ({d.subjudul})
                        </div>
                      )}  
                    </div>
                  
                    <span className="font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-sm">
                      <div className="mt-2 font-bold">Persyaratan:</div>
                      <ul className="list-disc pl-5 mt-2">
                        {d.syarat.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>

                     <div className="mt-4">
                      <div className="font-bold">Biaya Pelayanan:</div>
                    
                      {Array.isArray(d.biaya) ? (
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {d.biaya.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <p className="mt-2">{d.biaya.keterangan}</p>
                    
                          <ul className="list-disc pl-5 mt-2 space-y-3">
                            {d.biaya.rumus.map((item, idx) => (
                              <li key={idx}>
                                <div className="font-semibold">{item.luas}</div>
                                <div className="ml-2">{item.formula}</div>
                              </li>
                            ))}
                          </ul>
                    
                          <p className="mt-2">{d.biaya.pendaftaran}</p>
                        </>
                      )}
                    </div>

                      <div className="mt-4 font-bold">Jangka Waktu Penyelesaian:</div>
                      <ul className="list-disc pl-5 mt-2">
                        {d.waktu.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-sm text-slate-500">
            Jika layanan yang dicari belum ada, silakan gunakan menu <b>Cek Nomor Berkas</b> atau hubungi petugas pada jam layanan.
          </div>

        </section>
      </main>
    </>
  );
}
