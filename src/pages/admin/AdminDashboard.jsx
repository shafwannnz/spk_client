import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  LogOut,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  UserCog,
  Calculator,
  GraduationCapIcon,
  KeyRound,
  ChartNoAxesColumn,
} from "lucide-react";

// const statsOverview = [
//   {
//     title: "Jumlah Siswa",
//     value: "512",
//     subtitle: "14 rombongan belajar aktif",
//     change: "+32 siswa tahun ini",
//     icon: GraduationCap,
//     accent: "from-sky-500/20 to-sky-500/5",
//   },
//   {
//     title: "Jumlah Guru",
//     value: "68",
//     subtitle: "18 wali kelas & 6 pembina ekstrakurikuler",
//     change: "+5 guru baru",
//     icon: UserCog,
//     accent: "from-emerald-500/20 to-emerald-500/5",
//   },
//   {
//     title: "Kriteria AHP Aktif",
//     value: "6",
//     subtitle: "Pembobotan terakhir 30 Okt 2025",
//     change: "Perlu review dalam 3 hari",
//     icon: SlidersHorizontal,
//     accent: "from-indigo-500/20 to-indigo-500/5",
//   },
//   {
//     title: "Nilai APK",
//     value: "87.6%",
//     subtitle: "Target minimum 85%",
//     change: "+3.2% dibanding 2024",
//     icon: Calculator,
//     accent: "from-amber-500/20 to-amber-500/5",
//   },
// ];

const featureActions = [
  {
    title: "Kelola Data Siswa",
    description:
      "Tambah, ubah, hapus, dan arsipkan data siswa Insantama Leuwiliang dengan sinkronisasi real-time.",
    icon: GraduationCap,
    apiRoutes: [
    ],
    primaryLabel: "Kelola Siswa",
    primaryRoute: "/dashboard/siswa",
  },
  {
    title: "Kelola Bobot Kriteria (AHP)",
    description:
      "Atur matriks perbandingan berpasangan dan validasi konsistensi untuk mendukung keputusan sekolah.",
    icon: FileSpreadsheet,
    apiRoutes: [
    ],
    primaryLabel: "Kelola Kriteria",
    primaryRoute: "/dashboard/kriteria",
    secondaryLabel: "Pantau Konsistensi",
    secondaryRoute: "/dashboard/ahp",
  },
  {
    title: "Kelola Data Guru",
    description:
      "Sinkronkan profil guru, penempatan mapel, dan status pembinaan menggunakan koleksi Postman.",
    icon: UserCog,
    apiRoutes: [
    ],
    primaryLabel: "Kelola Guru",
    primaryRoute: "/dashboard/guru",
  },
  {
    title: "Proses Perhitungan APK",
    description:
      "Jalankan perhitungan otomatis berdasarkan bobot kriteria dan data terbaru untuk menyajikan nilai APK.",
    icon: ChartNoAxesColumn,
    apiRoutes: [
    ],
    primaryLabel: "Mulai Perhitungan",
    primaryRoute: "/dashboard/ahp",
  },
  {
    title: "Lihat & Cetak Hasil Laporan",
    description:
      "Review rekap nilai, ranking siswa, serta ekspor laporan ke PDF/Excel langsung dari dashboard.",
    icon: Printer,
    apiRoutes: [
    ],
    primaryLabel: "Cetak / Unduh",
    primaryRoute: "/dashboard/laporan",
  },
];

const integrationLogs = [
  {
    id: 1,
    time: "17:40",
    status: "Berhasil",
    variant: "success",
    method: "POST /api/siswa/import",
    description: "Sinkronisasi 32 siswa baru dari Postman koleksi 'PPDB 2025'.",
  },
  {
    id: 2,
    time: "16:05",
    status: "Perlu Cek",
    variant: "warning",
    method: "PUT /api/guru/54",
    description: "Perubahan status guru belum tervalidasi oleh tim HR.",
  },
  {
    id: 3,
    time: "14:22",
    status: "Berhasil",
    variant: "success",
    method: "GET /api/kriteria/matriks",
    description: "Matriks AHP diekspor untuk evaluasi komite akademik.",
  },
];

const agendaItems = [
  {
    id: 1,
    title: "Validasi data siswa semester ganjil",
    schedule: "2 Nov 2025 · 09.00 WIB",
    owner: "Tim Kesiswaan",
  },
  {
    id: 2,
    title: "Review bobot kriteria AHP",
    schedule: "3 Nov 2025 · 13.30 WIB",
    owner: "Komite Akademik",
  },
  {
    id: 3,
    title: "Generate laporan APK untuk Kepala Sekolah",
    schedule: "4 Nov 2025 · 08.00 WIB",
    owner: "Operator SPK",
  },
];

const ahpCriteria = [
  { name: "Kedisiplinan", weight: 0.32, trend: "+0.02", lastUpdated: "30 Okt 2025" },
  { name: "Akhlak & Sikap", weight: 0.27, trend: "+0.01", lastUpdated: "30 Okt 2025" },
  { name: "Akademik", weight: 0.21, trend: "-0.01", lastUpdated: "29 Okt 2025" },
  { name: "Keaktifan Ekstrakurikuler", weight: 0.12, trend: "Stabil", lastUpdated: "28 Okt 2025" },
  { name: "Kehadiran", weight: 0.08, trend: "Stabil", lastUpdated: "27 Okt 2025" },
];

const apkSummary = {
  cycle: "Semester Ganjil 2025",
  score: 87.6,
  change: "+3.2 dibanding 2024",
  note: "Bobot tertinggi pada kedisiplinan dan akhlak; rekomendasi fokus mentoring akademik.",
};

const reportSummaries = [
  {
    id: 1,
    title: "Rekap APK Semester",
    period: "Ganjil 2025",
    lastGenerated: "01 Nov 2025 · 15:12",
    format: "PDF & XLS",
  },
  {
    id: 2,
    title: "Ranking Siswa per Kriteria",
    period: "Oktober 2025",
    lastGenerated: "31 Okt 2025 · 20:45",
    format: "PDF",
  },
  {
    id: 3,
    title: "Monitoring Data Guru",
    period: "Triwulan III",
    lastGenerated: "29 Okt 2025 · 10:18",
    format: "XLS",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const monitoringAlerts = useMemo(
    () => [
      {
        id: 1,
        label: "Sinkronisasi Postman terakhir 2 menit lalu",
        tone: "positive",
      },
      {
        id: 2,
        label: "1 endpoint AHP menunggu verifikasi konsistensi",
        tone: "warning",
      },
      {
        id: 3,
        label: "Target APK semester ini sudah terpenuhi",
        tone: "positive",
      },
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const goTo = (route) => {
    if (route) {
      navigate(route);
    }
  };

  const openExternal = (href) => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white font-semibold">
              IL
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Dashboard Admin – Insantama Leuwiliang
              </p>
              <p className="text-xs text-slate-400">
                Sistem Pendukung Keputusan Sekolah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari siswa, guru, atau laporan..."
                className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600"
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hidden h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 md:flex"
            >
              <TrendingUp className="h-4 w-4" />
              Ringkasan APK
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
          <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="flex h-full flex-col gap-6 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-lg">
              <p className="text-sm font-medium text-white/80">Selamat datang, Admin</p>
              <h1 className="text-2xl font-bold">
                Sistem Pendukung Keputusan Sekolah Insantama Leuwiliang
              </h1>
              <p className="max-w-2xl text-sm text-white/80">
                Kelola data siswa dan guru, atur bobot kriteria AHP, jalankan perhitungan APK,
                serta cetak laporan akademik dari satu dasbor terintegrasi.
              </p>

              <div className="mt-auto flex flex-wrap gap-3">
                <button
                  onClick={() => goTo("/dashboard/ahp")}
                  className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                >
                  Mulai Perhitungan APK
              </button>
            </div>
          </div>

          <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Status Integrasi & Monitoring
              </p>
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              {monitoringAlerts.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                >
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      item.tone === "positive" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => goTo("/dashboard/ahp")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Riwayat Sinkronisasi
            </button>
          </div>
        </section>

        {/* <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {statsOverview.map(({ title, value, subtitle, change, icon, accent }) => {
            const IconComponent = icon;
            return (
              <article
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}
                >
                  <IconComponent className="h-5 w-5 text-slate-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
                <p className="mt-2 text-xs font-medium text-emerald-500">{change}</p>
              </article>
            );
          })}
        </section> */}

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Fitur Utama Sistem Pendukung Keputusan
                </p>
                <p className="text-xs text-slate-400">
                  Kelola modul utama dan integrasikan dengan koleksi Postman sekolah
                </p>
              </div>
            </header>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {featureActions.map(
                ({
                  title,
                  description,
                  icon,
                  apiRoutes,
                  primaryLabel,
                  primaryRoute,
                  secondaryLabel,
                  secondaryRoute,
                  secondaryHref,
                }) => {
                  const IconComponent = icon;
                  return (
                    <article
                      key={title}
                      className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                          <IconComponent className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-slate-700">{title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{description}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        {apiRoutes.map(({ method, path }) => (
                          <span
                            key={`${method}-${path}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm"
                          >
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                method === "GET"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : method === "POST"
                                  ? "bg-sky-100 text-sky-600"
                                  : "bg-amber-100 text-amber-600"
                              }`}
                            >
                              {method}
                            </span>
                            {path}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => goTo(primaryRoute)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          {primaryLabel}
                        </button>
                        {secondaryLabel ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (secondaryRoute) {
                                goTo(secondaryRoute);
                              } else if (secondaryHref) {
                                openExternal(secondaryHref);
                              }
                            }}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            {secondaryLabel}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Aktivitas Integrasi API
                  </p>
                  <p className="text-xs text-slate-400">
                    Catatan sinkronisasi dari koleksi Postman
                  </p>
                </div>
                <RefreshCw className="h-4 w-4 text-slate-400" />
              </header>
              <ul className="mt-4 space-y-4 text-sm text-slate-500">
                {integrationLogs.map(({ id, time, status, variant, method, description }) => (
                  <li
                    key={id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-700">{status}</p>
                        <p className="text-xs text-slate-400">
                          {time} · {method}
                        </p>
                      </div>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          variant === "success" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Agenda Operasional
                  </p>
                  <p className="text-xs text-slate-400">
                    Prioritas harian tim operator SPK
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-slate-400" />
              </header>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {agendaItems.map(({ id, title, schedule, owner }) => (
                  <li
                    key={id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <p className="text-slate-700">{title}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                      {schedule}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Penanggung jawab: {owner}
                    </p>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Keluar dari Dashboard
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Analisis Hierarki Proses (AHP)
                </p>
                <p className="text-xs text-slate-400">
                  Tinjau bobot prioritas dan konsistensi kriteria
                </p>
              </div>
              <ClipboardList className="h-4 w-4 text-slate-400" />
            </header>
            <p className="mt-4 text-sm text-slate-500">
              Pantau pembobotan kriteria agar proses perhitungan APK tetap akurat. Pastikan nilai
              Konsistensi Rasio (CR) di bawah 0.1 sebelum melanjutkan ke proses APK.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Kriteria</th>
                    <th className="px-4 py-3 text-right">Bobot</th>
                    <th className="px-4 py-3 text-right">Perubahan</th>
                    <th className="px-4 py-3 text-right">Update Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {ahpCriteria.map(({ name, weight, trend, lastUpdated }) => (
                    <tr key={name} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-700">{name}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">
                        {weight.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-emerald-500">
                        {trend}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-400">
                        {lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => goTo("/dashboard/kriteria")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Cek Konsistensi Matriks
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Perhitungan APK & Laporan
                </p>
                <p className="text-xs text-slate-400">
                  Hasil terbaru dan laporan siap cetak
                </p>
              </div>
              <Calculator className="h-4 w-4 text-slate-400" />
            </header>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Nilai APK Terbaru
                  </p>
                  <p className="mt-1 text-4xl font-bold text-slate-800">
                    {apkSummary.score.toFixed(1)}%
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {apkSummary.cycle}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{apkSummary.note}</p>
              <p className="mt-2 text-xs font-medium text-emerald-500">{apkSummary.change}</p>
              <div className="mt-4 h-2 rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500"
                  style={{ width: `${Math.min(100, apkSummary.score)}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => goTo("/dashboard/ahp")}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Jalankan APK Ulang
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/dashboard/laporan")}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Kirim ke Kepala Sekolah
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/40 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Laporan Siap Cetak
                </p>
                <Printer className="h-4 w-4 text-slate-400" />
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {reportSummaries.map(({ id, title, period, lastGenerated, format }) => (
                  <li
                    key={id}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-700">{title}</p>
                        <p className="text-xs text-slate-400">{period}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {format}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Terakhir dibuat: {lastGenerated}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => goTo("/dashboard/laporan")}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Lihat
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("/dashboard/laporan")}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goTo("/dashboard/laporan")}
                className="mt-5 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cetak Semua Laporan
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
