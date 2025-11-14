import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  PlusCircle,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

const newCriterionTemplate = {
  nama: "",
  weight: 0,
  description: "",
};

export default function CriteriaManagement() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consistencyRatio, setConsistencyRatio] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(newCriterionTemplate);
  const [editingId, setEditingId] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const fetchCriteria = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/kriteria", { headers });
      if (!response.ok) {
        throw new Error("Gagal mengambil data kriteria");
      }
      const data = await response.json();
      setCriteria(Array.isArray(data) ? data : data?.data ?? []);
      setConsistencyRatio(data?.consistency ?? null);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat kriteria");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setFormData(newCriterionTemplate);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = editingId ? `/api/kriteria/${editingId}` : "/api/kriteria";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null);
        throw new Error(payloadError?.message || "Gagal menyimpan kriteria");
      }

      setSuccess(editingId ? "Kriteria berhasil diperbarui" : "Kriteria baru berhasil ditambahkan");
      await fetchCriteria();
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (criterion) => {
    setEditingId(criterion.id ?? criterion._id);
    setFormData({
      nama: criterion.nama ?? "",
      weight: Number(criterion.weight ?? 0),
      description: criterion.description ?? "",
    });
  };

  const handleDelete = async (criterion) => {
    const criterionId = criterion.id ?? criterion._id;
    if (!criterionId) return;
    const confirmation = window.confirm(`Hapus kriteria ${criterion.nama}?`);
    if (!confirmation) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/kriteria/${criterionId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus kriteria");
      }
      setSuccess("Kriteria berhasil dihapus");
      await fetchCriteria();
      if (editingId === criterionId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Gagal menghapus kriteria");
    } finally {
      setSubmitting(false);
    }
  };

  const recalculateAhp = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/kriteria/bobot", {
        method: "POST",
        headers,
      });
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null);
        throw new Error(payloadError?.message || "Gagal memperbarui bobot AHP");
      }
      const data = await response.json().catch(() => ({}));
      setSuccess("Bobot AHP berhasil dihitung ulang");
      setConsistencyRatio(data?.consistency ?? data?.CR ?? null);
      await fetchCriteria();
    } catch (err) {
      setError(err.message || "Gagal menghitung ulang bobot kriteria");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPageShell
      title="Kelola Bobot Kriteria (AHP)"
      description="Atur prioritas kriteria dan jalankan perhitungan AHP secara langsung. Gunakan endpoint API yang sama dengan koleksi Postman untuk memastikan konsistensi data."
      actionSlot={
        <button
          type="button"
          onClick={fetchCriteria}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Muat Data
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Kriteria" : "Tambah Kriteria Baru"}
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Lengkapi informasi berikut untuk menambah atau memperbarui kriteria penilaian.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="nama-kriteria">
                Nama Kriteria
              </label>
              <input
                id="nama-kriteria"
                value={formData.nama}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, nama: event.target.value }))
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="bobot-kriteria">
                Bobot (0 - 1)
              </label>
              <input
                id="bobot-kriteria"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.weight}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    weight: Number(event.target.value),
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-1 text-xs text-slate-400">
                Total bobot semua kriteria disarankan mendekati 1.0 untuk konsistensi AHP.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="deskripsi-kriteria">
                Deskripsi
              </label>
              <textarea
                id="deskripsi-kriteria"
                rows={3}
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, description: event.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? "Simpan Perubahan" : "Simpan Kriteria"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <PlusCircle className="h-4 w-4" />
                Kriteria Baru
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              {consistencyRatio != null && consistencyRatio <= 0.1 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <p className="font-semibold">Konsistensi Matriks</p>
            </div>
            <p className="mt-2 text-slate-500">
              {consistencyRatio != null
                ? `Nilai CR saat ini: ${Number(consistencyRatio).toFixed(3)}.`
                : "Belum ada informasi konsistensi yang tersedia."}
              {" "}
              Pastikan nilai CR di bawah 0.1 untuk hasil yang konsisten.
            </p>
            <button
              type="button"
              onClick={recalculateAhp}
              disabled={submitting}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Hitung Ulang Bobot AHP
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">{error}</p>
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
              <h2 className="text-lg font-semibold text-slate-700">Daftar Kriteria</h2>
              <p className="text-sm text-slate-500">
                Klik salah satu baris untuk memperbarui bobot atau deskripsi kriteria tersebut.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Kriteria</th>
                  <th className="px-4 py-3 text-right">Bobot</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-sm text-slate-400">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-slate-400" />
                      Memuat data kriteria...
                    </td>
                  </tr>
                ) : criteria.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-sm text-slate-400">
                      Belum ada kriteria yang tercatat.
                    </td>
                  </tr>
                ) : (
                  criteria.map((criterion) => (
                    <tr
                      key={criterion.id ?? criterion._id}
                      className="cursor-pointer transition hover:bg-slate-50/70"
                      onClick={() => handleEdit(criterion)}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-700">{criterion.nama}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-600">
                        {Number(criterion.weight ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {criterion.description || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(criterion);
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardPageShell>
  );
}
