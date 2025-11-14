import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

export default function ReportCenter() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
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

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/laporan", {
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal memuat daftar laporan");
      }
      const data = await response.json();
      const items = Array.isArray(data) ? data : data?.data ?? [];
      setReports(items);
      setFilteredReports(items);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          report.format?.toLowerCase().includes(lowered)
      )
    );
  }, [reports, searchTerm]);

  const handleView = (report) => {
    const targetUrl = report.previewUrl ?? report.url ?? `/api/laporan/${report.id ?? report._id}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async (report) => {
    try {
      const endpoint = report.downloadUrl ?? `/api/laporan/export/${report.id ?? report._id}`;
      const response = await fetch(endpoint, {
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal mengunduh laporan");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${report.title ?? "laporan"}.${report.format?.toLowerCase() ?? "pdf"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.message || "Gagal mengunduh laporan");
    }
  };

  return (
    <DashboardPageShell
      title="Lihat & Cetak Hasil Laporan"
      description="Tinjau hasil perhitungan APK, ranking siswa, serta laporan pendukung lainnya. Semua laporan terhubung langsung dengan API."
      actionSlot={
        <button
          type="button"
          onClick={fetchReports}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Muat Laporan
        </button>
      }
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">Daftar Laporan</h2>
            <p className="text-sm text-slate-500">
              Filter laporan berdasarkan jenis atau periode, lalu buka pratinjau atau unduh untuk
              dicetak.
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">
            {error}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-sm text-slate-400">
              <Loader2 className="mb-3 h-6 w-6 animate-spin text-slate-400" />
              Memuat laporan...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center text-sm text-slate-400">
              Belum ada laporan yang tersedia. Jalankan perhitungan APK terlebih dahulu.
            </div>
          ) : (
            filteredReports.map((report) => (
              <article
                key={report.id ?? report._id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-700">{report.title}</h3>
                    <p className="text-xs text-slate-400">{report.period ?? "-"}</p>
                    <p className="mt-3 text-sm text-slate-500">{report.description || report.summary}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {report.format ?? "PDF"}
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  Terakhir diperbarui: {report.updatedAt ?? report.createdAt ?? "-"}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleView(report)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <FileText className="h-4 w-4" />
                    Lihat Laporan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(report)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                    Unduh
                  </button>
                  {report.printUrl ? (
                    <button
                      type="button"
                      onClick={() => window.open(report.printUrl, "_blank", "noopener,noreferrer")}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Printer className="h-4 w-4" />
                      Cetak
                    </button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </DashboardPageShell>
  );
}
