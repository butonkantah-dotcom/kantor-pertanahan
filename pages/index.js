// pages/index.js
import Head from "next/head";
import Link from "next/link";

export default function ProfilKantor() {
  // Silakan isi sesuai data resmi kantor
  const OFFICE_NAME = "Kantor Pertanahan Kabupaten Buton";
  const OFFICE_ADDRESS = "Jl. Poros Pasarwajo Lasalimu";
  const OFFICE_HOURS = "Senin–Jumat | 08.00–16.00 WITA";
  const OFFICE_PHONE = "085322459918";
  const OFFICE_EMAIL = "butonkantah@gmail.com";

  return (
    <>
      <Head>
        <title>Profil Kantor | SiKABut</title>
        <meta
          name="description"
          content="Profil Kantor Pertanahan Kabupaten Buton dan informasi layanan SiKABut"
        />
      </Head>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <section className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            PROFIL KANTOR
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{OFFICE_NAME}</p>
            {/* Sekilas + Foto */}
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              SEKILAS TENTANG KANTAH BUTON
            </h2>
          
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Foto kiri */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <img
                  src="https://drive.google.com/uc?export=view&id=13__cgCqrNd-KFR_BWIsLgQyJ-fMMaW3e"
                  alt="Kantor Pertanahan Kabupaten Buton"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
          
              {/* Teks kanan */}
              <div className="text-slate-700 dark:text-slate-200 leading-relaxed space-y-3">
                <p>
                  Kabupaten Buton merupakan salah satu wilayah administrasi di Provinsi Sulawesi Tenggara dengan pusat pemerintahan berada di Kecamatan Pasarwajo. Kecamatan ini berperan sebagai pusat kegiatan pemerintahan, sosial, ekonomi, serta pelayanan publik bagi masyarakat. Secara geografis, Kabupaten Buton terletak di bagian selatan Pulau Sulawesi dan termasuk wilayah pesisir yang memiliki kombinasi daratan dan perairan laut yang luas, sehingga mencerminkan karakteristik wilayah maritim yang kuat. Secara astronomis, Kabupaten Buton berada pada posisi 04°40'–06°00' Lintang Selatan dan 122°00'–123°30' Bujur Timur, dengan kondisi topografi yang beragam meliputi pesisir pantai, dataran rendah, hingga perbukitan. Luas wilayah daratan Kabupaten Buton mencapai ±2.681,22 km², sedangkan wilayah lautnya lebih luas dibandingkan wilayah daratan.
                </p>
                <p>
                  Kantor Pertanahan Kabupaten Buton beralamat di Jalan Poros Pasarwajo - Lasalimu, Kecamatan Pasarwajo, Kelurahan Wakoko. Wilayah kerja Kantor Pertanahan Kabupaten Buton mencakup 7 kecamatan, yaitu Kecamatan Kapontori, Pasarwajo, Lasalimu, Lasalimu Selatan, Siontapina, Wolowa, dan Wabula. Secara administratif, Kabupaten Buton memiliki total 95 desa/kelurahan yang terdiri dari 83 desa dan 12 kelurahan.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">📍 Alamat</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">{OFFICE_ADDRESS}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">🕒 Jam Layanan</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">{OFFICE_HOURS}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">☎️ Kontak Resmi</div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">Telepon: {OFFICE_PHONE}</div>
              <div className="text-slate-700 dark:text-slate-200">Email: {OFFICE_EMAIL}</div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="font-bold">ℹ️ Tentang SiKABut</div>
              <p className="mt-1 text-slate-700 dark:text-slate-200 leading-relaxed">
                SiKABut digunakan untuk mengecek status & kelengkapan berkas permohonan serta melihat
                syarat dan informasi biaya layanan.
              </p>
            </div>
          </div>

          <div className="mt-6">
          <div className="font-bold text-slate-800 dark:text-slate-100 mb-2">🗺️ Lokasi Kantor</div>
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.680782199696!2d122.85801097428882!3d-5.465311254472208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da40f4190d5af23%3A0x80a6e638b5636093!2sKANTOR%20PERTANAHAN%20KAB.BUTON!5e0!3m2!1sen!2sid!4v1772082014253!5m2!1sen!2sid"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kantor Pertanahan Kabupaten Buton"
            />
          </div>
        </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/cek-berkas"
              className="inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold text-black
                         bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700
                         border border-slate-300 dark:border-slate-600 shadow-md"
            >
              🔎 Mulai Cek Berkas
            </Link>

            <Link
              href="/syarat-biaya"
              className="inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold
                         bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200
                         border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm"
            >
              📋 Lihat Syarat & Biaya
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Catatan: Informasi biaya mengikuti ketentuan resmi (PNBP) yang berlaku.
          </p>
        </section>
      </main>
    </>
  );
}
