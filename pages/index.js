import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** ========= Util kecil ========= */
const fmtTanggal = (tgl) =>
  !tgl
    ? "-"
    : new Date(tgl).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const shareLink = async (url) => {
  try {
    if (navigator.share) {
      await navigator.share({ url, title: "SI-BERKAT", text: "Cek status berkas" });
      return true;
    }
  } catch {}
  return false;
};

/** ========= Halaman ========= */
export default function Home() {
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState(null);
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  // Ambil nomor berkas dari query URL (?n=XXXX) saat halaman dibuka
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const q = url.searchParams.get("n") || "";
    if (q) {
      setNomor(q);
      setTimeout(() => handleSearch(q), 0);
    }
  }, []);

  // Fokus otomatis input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simpan & muat riwayat pencarian (localStorage)
  const history = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("sib-berkat-history") || "[]");
    } catch {
      return [];
    }
  }, [data, loading, notFound]);

  const pushHistory = (n) => {
    if (typeof window === "undefined") return;
    const current = JSON.parse(localStorage.getItem("sib-berkat-history") || "[]");
    const next = [n, ...current.filter((x) => x !== n)].slice(0, 6);
    localStorage.setItem("sib-berkat-history", JSON.stringify(next));
  };

  // Reset cepat
  const handleReset = useCallback(() => {
    setNomor("");
    setData(null);
    setWarning("");
    setError("");
    setNotFound(false);
    inputRef.current?.focus();
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("n");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Shortcuts
  const keyHandler = useCallback(
    (e) => {
      if (e.key === "Escape") handleReset();
      if (e.key.toLowerCase() === "h" || e.key === "?") setHelpOpen((v) => !v);
    },
    [handleReset]
  );
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [keyHandler]);

  // Cari
  const handleSearch = async (nomorParam) => {
    const query = (nomorParam ?? nomor).trim();
    if (!query) {
      setWarning("⚠️ Harap masukkan nomor berkas");
      setData(null);
      setNotFound(false);
      setError("");
      return;
    }
    setWarning("");
    setError("");
    setNotFound(false);
    setData(null);
    setLoading(true);
    try {
      // Simpan query ke URL (deep link)
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("n", query);
        window.history.replaceState({}, "", url.toString());
      }

      // Panggil API kamu
      const res = await fetch(`/api/proxy?nomor_berkas=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server.");
      const json = await res.json();

      if (json && json.length > 0) {
        const row = json[0];
        setData(row);
        pushHistory(query);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setError("❌ Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Aksi salin & bagikan
  const doCopy = async () => {
    const ok = await copy(nomor || data?.nomor_berkas || "");
    setCopied(ok);
    setTimeout(() => setCopied(false), 1200);
  };
  const doShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : `/?n=${encodeURIComponent(nomor)}`;
    const ok = await shareLink(url);
    if (!ok) {
      await copy(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <>
      <Head>
        <title>SI-BERKAT — Sistem Informasi Berkas Kantor Pertanahan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SI-BERKAT: Cek status & kelengkapan berkas Anda secara cepat dan mudah."
        />
        <meta name="theme-color" content="#e2e8f0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)" />
      </Head>

      {/* HEADER BRANDING */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo ATR/BPN" width={36} height={36} />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                SI-BERKAT
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 -mt-1">
                Sistem Informasi Berkas Kantor Pertanahan
              </p>
            </div>
          </div>

          <button
            onClick={() => setHelpOpen((v) => !v)}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Bantuan (H)"
            title="Bantuan (H)"
          >
            ❓ Bantuan
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-sky-50 to-indigo-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#0b1220]">
        <div className="mx-auto max-w-screen-lg px-4 py-6 sm:py-10">
          {/* HERO */}
          <section className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-indigo-300 dark:to-fuchsia-300">
              Cek Status &amp; Kelengkapan Berkas Anda
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Masukkan nomor berkas, tekan <b>Enter</b> untuk mencari. Tekan <b>ESC</b> untuk reset.
            </p>
          </section>

          {/* SEARCH PANEL */}
          <section className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 shadow-sm p-4 sm:p-5 backdrop-blur">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Masukkan Nomor Berkas"
                    value={nomor}
                    onChange={(e) => setNomor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 rounded-xl px-4 py-3 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-indigo-700/30 dark:text-slate-100"
                  />
                  <button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="whitespace-nowrap rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-60"
                  >
                    🔍 Cari
                  </button>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <kbd className="rounded border px-1.5 py-0.5 bg-slate-50 border-slate-200">Enter</kbd>
                  untuk cari ·
                  <kbd className="rounded border px-1.5 py-0.5 bg-slate-50 border-slate-200">ESC</kbd>
                  untuk reset ·
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="underline decoration-dotted underline-offset-2 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    Bantuan (H)
                  </button>
                </div>

                {/* Riwayat pencarian */}
                {history?.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs mb-1 font-medium text-slate-500 dark:text-slate-400">
                      Pencarian terakhir
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {history.map((h) => (
                        <button
                          key={h}
                          onClick={() => {
                            setNomor(h);
                            handleSearch(h);
                          }}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          #{h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alerts */}
            {warning && (
              <div className="mt-3 rounded-xl p-3 bg-amber-50 border border-amber-200 text-amber-800 text-center">
                {warning}
              </div>
            )}
            {error && (
              <div className="mt-3 rounded-xl p-3 bg-rose-50 border border-rose-200 text-rose-700 text-center">
                {error}
              </div>
            )}
          </section>

          {/* LOADING */}
          {loading && (
            <section className="mx-auto max-w-xl mt-6">
              <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-4">
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* NOT FOUND */}
          {notFound && !loading && (
            <section className="mx-auto max-w-xl mt-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center">
                <div className="text-3xl mb-2">🧐</div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Data tidak ditemukan
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Periksa kembali nomor berkas atau coba beberapa saat lagi.
                </p>
              </div>
            </section>
          )}

          {/* HASIL */}
          {data && !loading && <ResultCard data={data} onCopy={doCopy} onShare={doShare} copied={copied} />}
          
          {/* FAQ */}
          <FAQ />
        </div>
      </main>

      {/* HELP MODAL */}
      {helpOpen && <Help onClose={() => setHelpOpen(false)} />}
    </>
  );
}

/** ========= KOMPONEN: Hasil ========= */
function ResultCard({ data, onCopy, onShare, copied }) {
  const isLengkap = !data?.kelengkapan_berkas || data.kelengkapan_berkas.trim() === "";

  return (
    <section className="mx-auto max-w-xl mt-6">
      <div className="rounded-2xl p-5 shadow-md ring-1 ring-slate-200 bg-white dark:bg-slate-800 dark:ring-slate-700">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-indigo-900/40 dark:text-indigo-200">
              📂
            </span>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Detail Berkas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nomor: <b>{data.nomor_berkas}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Salin nomor berkas"
            >
              {copied ? "✅ Disalin" : "📋 Salin"}
            </button>
            <button
              onClick={onShare}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Bagikan tautan"
            >
              🔗 Bagikan
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Cetak"
            >
              🖨️ Cetak
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 grid gap-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
          <Row label="Tanggal Permohonan" value={fmtTanggal(data.tanggal_permohonan)} />
          <Row label="Nama Pemohon" value={data.nama_pemohon} />
          <Row label="Jenis Layanan" value={data.jenis_layanan} />

          {/* Kelengkapan */}
          <div>
            <div className="font-bold">Kelengkapan</div>
            {isLengkap ? (
              <Alert type="success" text="Semua data lengkap" />
            ) : (
              <Alert type="error" text="Masih ada kekurangan" />
            )}
          </div>

          {/* Dokumen */}
          <div>
            <div className="font-bold">Dokumen</div>
            {isLengkap ? (
              <Alert type="success" text="Data Lengkap" />
            ) : (
              <Alert type="error" text={`Masih ada kekurangan: ${data.kelengkapan_berkas}`} />
            )}
          </div>

          <Row label="Status Berkas" value={data.status_berkas} />
          <Row label="Tanggal Selesai" value={fmtTanggal(data.tanggal_selesai)} />
          <Row label="Tahun Permohonan" value={data.tahun_permohonan || "-"} />
        </div>

        {/* Timeline proses (opsional, contoh sederhana) */}
        <Timeline status={data.status_berkas} />
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <p>
      <b>{label}:</b> {value}
    </p>
  );
}

function Alert({ type = "success", text }) {
  const isSuccess = type === "success";
  return (
    <div
      className={`mt-1 flex items-center gap-2 p-3 rounded-md border font-semibold ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
          : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
      }`}
    >
      <span className="text-lg">{isSuccess ? "✅" : "❌"}</span>
      <span>{text}</span>
    </div>
  );
}

/** ========= Timeline sederhana ========= */
function Timeline({ status = "" }) {
  // Sesuaikan mapping dengan status backend kamu
  const steps = ["Diajukan", "Verifikasi", "Proses", "Selesai"];
  const activeIdx = Math.max(
    0,
    steps.findIndex((s) => status.toLowerCase().includes(s.toLowerCase()))
  );

  return (
    <div className="mt-5">
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
        Perkiraan Proses
      </div>
      <ol className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        {steps.map((s, i) => {
          const done = i <= activeIdx;
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ring-2 ${
                  done
                    ? "bg-emerald-500 text-white ring-emerald-200"
                    : "bg-slate-200 text-slate-600 ring-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`text-sm ${
                  done ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden sm:block mx-2 h-[2px] w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** ========= Bantuan ========= */
function Help({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold">Bantuan SI-BERKAT</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800"
          >
            ✕
          </button>
        </div>
        <div className="p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <ul className="list-disc pl-5 space-y-1">
            <li>Ketik nomor berkas lalu tekan <b>Enter</b> untuk mencari.</li>
            <li>Tekan <b>ESC</b> untuk mengosongkan pencarian.</li>
            <li>Tombol <b>📋 Salin</b> menyalin nomor berkas ke clipboard.</li>
            <li>Tombol <b>🔗 Bagikan</b> membagikan URL khusus berisi nomor berkas.</li>
            <li>Gunakan fitur <b>Pencarian Terakhir</b> untuk mengulang cepat.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** ========= FAQ ========= */
function FAQ() {
  const items = [
    {
      q: "Apa itu SI-BERKAT?",
      a: "SI-BERKAT (Sistem Informasi Berkas Kantor Pertanahan) adalah layanan untuk mengecek status dan kelengkapan berkas secara daring.",
    },
    {
      q: "Bagaimana cara mencari berkas?",
      a: "Masukkan nomor berkas pada kotak pencarian, lalu tekan Enter atau klik tombol Cari.",
    },
    {
      q: "Data saya tidak ditemukan?",
      a: "Pastikan nomor berkas benar. Bila tetap tidak muncul, coba beberapa saat lagi atau hubungi kantor pertanahan setempat.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="mx-auto max-w-xl mt-10 mb-8">
      <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">FAQ</h4>
      <div className="space-y-2">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60"
          >
            <button
              className="w-full flex items-center justify-between p-3 text-left"
              onClick={() => setOpen((v) => (v === idx ? null : idx))}
            >
              <span className="font-medium">{it.q}</span>
              <span>{open === idx ? "−" : "+"}</span>
            </button>
            {open === idx && (
              <div className="px-3 pb-3 text-sm text-slate-600 dark:text-slate-300">{it.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
