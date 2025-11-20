import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Timer,
  TrendingUp,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

export default function AhpProcess() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const fetchStatus = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/perhitungan/apk/status", {
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal memuat status perhitungan AHP");
      }
      const data = await response.json();
      setStatus(data);
      setHistory(Array.isArray(data?.history) ? data.history : []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat status perhitungan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startCalculation = async () => {
    setRunning(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/perhitungan/apk", {
        method: "POST",
        headers,
      });
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null);
        throw new Error(payloadError?.message || "Gagal memulai proses AHP");
      }
      const data = await response.json().catch(() => ({}));
      setSuccess(data?.message || "Perhitungan AHP berhasil dimulai");
      await fetchStatus();
    } catch (err) {
      setError(err.message || "Gagal menjalankan perhitungan AHP");
    } finally {
      setRunning(false);
    }
  };

  return (
    <DashboardPageShell
      title="Proses Perhitungan AHP"
      description="Lakukan perhitungan Analytic Hierarchy Process dan perbarui nilai berdasarkan bobot terbaru."
      actionSlot={
        <button
          type="button"
          onClick={fetchStatus}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Muat Status
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Calculator className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Kontrol Perhitungan</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Jalankan ulang perhitungan kapan pun ada perubahan pada data siswa, guru, atau bobot
            kriteria. Sistem akan menggunakan data terbaru dari API.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 text-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <TrendingUp className="h-5 w-5 text-sky-500" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  APK Terakhir Dihitung
                </p>
                <p className="text-2xl font-semibold text-slate-800">
                  {status?.result?.apk
                    ? `${Number(status.result.apk).toFixed(2)}%`
                    : "Belum tersedia"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-slate-500">
              {status?.result?.lastUpdated
                ? `Diperbarui pada ${status.result.lastUpdated}`
                : "Belum ada catatan waktu perhitungan."}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-500"
                style={{
                  width: status?.result?.apk ? `${Math.min(100, status.result.apk)}%` : "0%",
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={startCalculation}
            disabled={running}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
            {running ? "Memproses..." : "Mulai Perhitungan AHP + APK"}
          </button>

          {status?.running ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-600">
              Proses perhitungan sedang berjalan. Anda dapat memantau status di panel sebelah kanan.
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-500">
              {success}
            </p>
          ) : null}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700">Status & Riwayat Proses</h2>
              <p className="text-sm text-slate-500">
                Catatan eksekusi perhitungan AHP yang dikirim ke API backend.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Status Saat Ini</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {status?.running ? "Sedang berjalan" : "Siap dijalankan"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    status?.running ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {status?.running ? "Processing" : "Idle"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {status?.message ??
                  "Tidak ada pesan status terbaru. Jalankan perhitungan untuk memperbarui informasi."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Timer className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-700">
                  Riwayat Eksekusi Terakhir
                </p>
              </div>
              <ul className="mt-3 space-y-3 text-sm text-slate-500">
                {history.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                    Belum ada riwayat perhitungan tercatat.
                  </li>
                ) : (
                  history.slice(0, 5).map((item) => (
                    <li
                      key={item.id ?? item.timestamp}
                      className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold">
                          {item.apk ? `${Number(item.apk).toFixed(2)}%` : "Selesai"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.timestamp ?? item.createdAt ?? "-"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {item.message || "Perhitungan selesai tanpa pesan tambahan."}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardPageShell>
  );
}
