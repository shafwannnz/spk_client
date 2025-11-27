import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  Search,
  Award,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

export default function ReportCenter() {
  const [tab, setTab] = useState("ahp"); // "ahp" atau "keputusan"
  const [reports, setReports] = useState([]);
  const [keputusan, setKeputusan] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filteredKeputusan, setFilteredKeputusan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

  // Fetch laporan AHP
  const fetchReportsAhp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/guru/laporan-ahp`, {
        headers,
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Gagal memuat laporan AHP`);
      }
      const data = await response.json();
      const items = Array.isArray(data) ? data : data?.data ?? [];
      
      if (items.length === 0) {
        setReports([]);
        setFilteredReports([]);
        setError("Belum ada data perhitungan AHP. Pastikan perhitungan APK sudah dilakukan.");
        return;
      }
      
      const reports = items.map((item) => ({
        id: item.id_siswa,
        _id: item.id_siswa,
        title: item.nama_siswa || "Tidak ada nama",
        period: `Kelas ${item.kelas || "-"}`,
        description: `Skor: ${(item.scoreAhp || 0).toFixed(4)} | Ranking: #${item.ranking || 0} | ${item.scorePercentage || 0}%`,
        format: "PDF",
        nis: item.nis || "-",
        ranking: item.ranking || 0,
        score: item.scoreAhp || 0,
        scorePercentage: item.scorePercentage || 0,
      }));
      setReports(reports);
      setFilteredReports(reports);
    } catch (err) {
      console.error("fetchReportsAhp error:", err);
      setError(err.message || "Gagal memuat laporan AHP. Pastikan server berjalan.");
      setReports([]);
      setFilteredReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch keputusan
  const fetchKeputusan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/guru/keputusan`, {
        headers,
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Gagal memuat keputusan`);
      }
      const data = await response.json();
      const items = Array.isArray(data) ? data : data?.data ?? [];
      
      if (items.length === 0) {
        setKeputusan([]);
        setFilteredKeputusan([]);
        setError("Belum ada keputusan. Pastikan perhitungan AHP sudah dilakukan.");
        return;
      }
      
      setKeputusan(items);
      setFilteredKeputusan(items);
    } catch (err) {
      console.error("fetchKeputusan error:", err);
      setError(err.message || "Gagal memuat keputusan. Pastikan server berjalan.");
      setKeputusan([]);
      setFilteredKeputusan([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "ahp") {
      fetchReportsAhp();
    } else {
      fetchKeputusan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Search filter untuk AHP
  useEffect(() => {
    if (!searchTerm) {
      setFilteredReports(reports);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    setFilteredReports(
      reports.filter(
        (report) =>
          report.title?.toLowerCase().includes(lowered) ||
          report.period?.toLowerCase().includes(lowered) ||
          report.nis?.toLowerCase().includes(lowered)
      )
    );
  }, [reports, searchTerm]);

  // Search filter untuk keputusan
  useEffect(() => {
    if (!searchTerm) {
      setFilteredKeputusan(keputusan);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    setFilteredKeputusan(
      keputusan.filter(
        (k) =>
          k.siswa_nama?.toLowerCase().includes(lowered) ||
          k.category?.toLowerCase().includes(lowered) ||
          k.siswa_nis?.toLowerCase().includes(lowered)
      )
    );
  }, [keputusan, searchTerm]);

  const handleViewAhp = () => {
    const url = `${API_BASE}/api/guru/laporan-ahp/export`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadAhp = async (report) => {
    try {
      const url = `${API_BASE}/api/guru/laporan-ahp/export`;
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error("Gagal mengunduh");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `laporan-ahp-${report.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.message || "Gagal unduh laporan");
    }
  };

  const handleViewKeputusan = () => {
    const url = `${API_BASE}/api/guru/keputusan/export`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadKeputusan = async () => {
    try {
      const url = `${API_BASE}/api/guru/keputusan/export`;
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error("Gagal mengunduh");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "keputusan-siswa.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.message || "Gagal unduh keputusan");
    }
  };

  return (
    <DashboardPageShell
      title="Lihat & Cetak Hasil Laporan"
      description="Tinjau hasil perhitungan AHP, ranking siswa, serta keputusan yang disarankan. Semua laporan dapat dicetak sebagai PDF."
      actionSlot={
        <button
          type="button"
          onClick={() => (tab === "ahp" ? fetchReportsAhp() : fetchKeputusan())}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Muat Ulang
        </button>
      }
    >
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("ahp")}
          className={`px-4 py-3 font-semibold transition ${
            tab === "ahp"
              ? "border-b-2 border-sky-500 text-sky-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📊 Laporan AHP & Ranking
        </button>
        <button
          onClick={() => setTab("keputusan")}
          className={`px-4 py-3 font-semibold transition ${
            tab === "keputusan"
              ? "border-b-2 border-sky-500 text-sky-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          🏆 Keputusan Siswa
        </button>
      </div>

      {/* TAB: Laporan AHP */}
      {tab === "ahp" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700">Laporan AHP & Ranking</h2>
              <p className="text-sm text-slate-500">
                Data ranking siswa berdasarkan perhitungan AHP dengan skor detail.
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">
              {error}
            </p>
          )}

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-sm text-slate-400">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-slate-400" />
                Memuat laporan AHP...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center text-sm text-slate-400">
                Belum ada data perhitungan AHP. Jalankan perhitungan APK terlebih dahulu.
              </div>
            ) : (
              filteredReports.map((report) => (
                <article
                  key={report.id}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-700">
                          {report.title}
                        </h3>
                        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                          #{report.ranking}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{report.period}</p>
                      <p className="mt-2 text-sm text-slate-500">{report.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                        {report.scorePercentage}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">NIS: {report.nis}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewAhp()}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4" />
                      Lihat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadAhp(report)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      Unduh PDF
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB: Keputusan Siswa */}
      {tab === "keputusan" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700">Keputusan Siswa</h2>
              <p className="text-sm text-slate-500">
                Rekomendasi keputusan siswa berdasarkan hasil perhitungan AHP.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleViewKeputusan}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <FileText className="h-4 w-4" />
                Lihat Semua
              </button>
              <button
                type="button"
                onClick={handleDownloadKeputusan}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Unduh PDF
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">
              {error}
            </p>
          )}

          <div className="mt-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-sm text-slate-400">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-slate-400" />
                Memuat keputusan...
              </div>
            ) : filteredKeputusan.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center text-sm text-slate-400">
                Belum ada keputusan. Pastikan perhitungan AHP sudah dilakukan.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Group by category */}
                {Object.entries(
                  filteredKeputusan.reduce((acc, k) => {
                    if (!acc[k.category]) acc[k.category] = [];
                    acc[k.category].push(k);
                    return acc;
                  }, {})
                ).map(([category, decisions]) => (
                  <div key={category}>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-700">
                      <Award className="h-5 w-5 text-amber-500" />
                      {category}
                    </h3>
                    <div className="space-y-3 pl-7">
                      {decisions.map((decision) => (
                        <article
                          key={`${decision.siswa_id}-${decision.ranking}`}
                          className="rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                                  #{decision.ranking}
                                </span>
                                <h4 className="font-semibold text-slate-900">
                                  {decision.siswa_nama}
                                </h4>
                              </div>
                              <p className="mt-1 text-xs text-slate-400">
                                NIS: {decision.siswa_nis} | Kelas: {decision.siswa_kelas}
                              </p>
                              <p className="mt-3 text-sm text-slate-600">
                                {decision.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                                {decision.scorePercentage}%
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </DashboardPageShell>
  );
}
