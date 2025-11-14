import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Download,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

const newTeacherTemplate = {
  nama: "",
  nip: "",
  mataPelajaran: "",
  status: "Aktif",
};

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [formData, setFormData] = useState(newTeacherTemplate);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/guru", { headers });
      if (!response.ok) {
        throw new Error("Gagal memuat data guru");
      }
      const data = await response.json();
      setTeachers(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTeachers(teachers);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    setFilteredTeachers(
      teachers.filter(
        (teacher) =>
          teacher.nama?.toLowerCase().includes(lowered) ||
          teacher.nip?.toLowerCase().includes(lowered) ||
          teacher.mataPelajaran?.toLowerCase().includes(lowered)
      )
    );
  }, [teachers, searchTerm]);

  const resetForm = () => {
    setFormData(newTeacherTemplate);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const endpoint = editingId ? `/api/guru/${editingId}` : "/api/guru";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null);
        throw new Error(payloadError?.message || "Gagal menyimpan data guru");
      }
      setSuccessMessage(
        editingId ? "Data guru berhasil diperbarui" : "Data guru baru berhasil ditambahkan"
      );
      await fetchTeachers();
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id ?? teacher._id);
    setFormData({
      nama: teacher.nama ?? "",
      nip: teacher.nip ?? "",
      mataPelajaran: teacher.mataPelajaran ?? "",
      status: teacher.status ?? "Aktif",
    });
  };

  const handleDelete = async (teacher) => {
    const teacherId = teacher.id ?? teacher._id;
    if (!teacherId) return;

    const confirmation = window.confirm(`Hapus data guru ${teacher.nama}?`);
    if (!confirmation) return;

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/guru/${teacherId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data guru");
      }
      setSuccessMessage("Data guru berhasil dihapus");
      await fetchTeachers();
      if (editingId === teacherId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Gagal menghapus data guru");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPageShell
      title="Kelola Data Guru"
      description="Kendalikan data tenaga pendidik Insantama Leuwiliang, termasuk penugasan mata pelajaran dan status aktif."
      actionSlot={
        <>
          <button
            type="button"
            onClick={fetchTeachers}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Muat Ulang
          </button>
          <a
            href="https://www.postman.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Sinkron Koleksi
          </a>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Briefcase className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {editingId ? "Perbarui Data Guru" : "Tambah Guru Baru"}
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Input data guru untuk memastikan penugasan mata pelajaran dan status keaktifan selalu
            mutakhir.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="nama-guru">
                Nama Guru
              </label>
              <input
                id="nama-guru"
                value={formData.nama}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, nama: event.target.value }))
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="nip-guru">
                NIP / ID Pegawai
              </label>
              <input
                id="nip-guru"
                value={formData.nip}
                onChange={(event) => setFormData((prev) => ({ ...prev, nip: event.target.value }))}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="mapel-guru">
                Mata Pelajaran / Peran
              </label>
              <input
                id="mapel-guru"
                value={formData.mataPelajaran}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, mataPelajaran: event.target.value }))
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="status-guru">
                Status
              </label>
              <select
                id="status-guru"
                value={formData.status}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, status: event.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? "Simpan Perubahan" : "Simpan Guru"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Entry Baru
              </button>
            </div>
          </form>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500">
              {error}
            </p>
          ) : null}
          {successMessage ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-500">
              {successMessage}
            </p>
          ) : null}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700">Daftar Guru</h2>
              <p className="text-sm text-slate-500">
                Total {filteredTeachers.length} guru terdata. Gunakan pencarian untuk mencari sesuai
                nama, NIP, atau mata pelajaran.
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari guru..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">NIP</th>
                  <th className="px-4 py-3">Mata Pelajaran</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-400">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-slate-400" />
                      Memuat data guru...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-400">
                      Tidak ada data guru ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id ?? teacher._id} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-700">{teacher.nama}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{teacher.nip}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{teacher.mataPelajaran}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            teacher.status === "Aktif"
                              ? "bg-emerald-100 text-emerald-600"
                              : teacher.status === "Cuti"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {teacher.status || "Aktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(teacher)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(teacher)}
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
