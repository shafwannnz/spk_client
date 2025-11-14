import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import DashboardPageShell from "./DashboardPageShell.jsx";

const API_BASE = (() => {
  const backendURL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "http://localhost:3000";
  return `${backendURL}/api/siswa`;
})();


const newStudentTemplate = {
  nama: "",
  nis: "",
  kelas: "",
  alamat: "",
};

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [formData, setFormData] = useState(newStudentTemplate);
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

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_BASE, { headers });
      if (!response.ok) {
        throw new Error("Gagal memuat data siswa");
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    setFilteredStudents(
      students.filter(
        (student) =>
          student.nama?.toLowerCase().includes(lowered) ||
          student.nis?.toLowerCase().includes(lowered) ||
          student.kelas?.toLowerCase().includes(lowered)
      )
    );
  }, [students, searchTerm]);

  const resetForm = () => {
    setFormData(newStudentTemplate);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = JSON.stringify(formData);
      const endpoint = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers,
        body: payload,
      });

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null);
        throw new Error(payloadError?.message || "Gagal menyimpan data siswa");
      }

      setSuccessMessage(
        editingId ? "Data siswa berhasil diperbarui" : "Siswa baru berhasil ditambahkan"
      );
      await fetchStudents();
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id ?? student._id);
    setFormData({
      nama: student.nama ?? "",
      nis: student.nis ?? "",
      kelas: student.kelas ?? "",
      alamat: student.alamat ?? "",
    });
  };

  const handleDelete = async (student) => {
    const studentId = student.id ?? student._id;
    if (!studentId) return;
    const confirmation = window.confirm(`Hapus data siswa ${student.nama}?`);
    if (!confirmation) return;

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/siswa/${studentId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data siswa");
      }
      setSuccessMessage("Data siswa berhasil dihapus");
      await fetchStudents();
      if (editingId === studentId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Gagal menghapus data siswa");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPageShell
      title="Kelola Data Siswa"
      description="Pengelolaan penuh data siswa Sekolah Insantama Leuwiliang. Sinkronkan data melalui koleksi Postman yang sama dengan aplikasi backend."
      actionSlot={
        <>
          <button
            type="button"
            onClick={fetchStudents}
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
            Buka Koleksi Postman
          </a>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <UserPlus className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {editingId ? "Perbarui Data Siswa" : "Tambah Siswa Baru"}
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Isi formulir berikut untuk menambahkan atau memperbarui data siswa. Data akan langsung
            tersimpan ke API.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="nama">
                Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={(event) => setFormData((prev) => ({ ...prev, nama: event.target.value }))}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="nis">
                NIS
              </label>
              <input
                id="nis"
                name="nis"
                value={formData.nis}
                onChange={(event) => setFormData((prev) => ({ ...prev, nis: event.target.value }))}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="kelas">
                Kelas
              </label>
              <input
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, kelas: event.target.value }))
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="alamat">
                Alamat
              </label>
              <textarea
                id="alamat"
                name="alamat"
                rows={3}
                value={formData.alamat}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, alamat: event.target.value }))
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
                {editingId ? "Simpan Perubahan" : "Simpan Siswa"}
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
              <h2 className="text-lg font-semibold text-slate-700">Daftar Siswa</h2>
              <p className="text-sm text-slate-500">
                Total {filteredStudents.length} siswa terdata. Gunakan pencarian untuk menemukan siswa
                secara cepat.
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari nama, NIS, atau kelas"
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
                  <th className="px-4 py-3">NIS</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-400">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-slate-400" />
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-400">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id ?? student._id} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-700">{student.nama}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{student.nis}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{student.kelas}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{student.alamat || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(student)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student)}
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
