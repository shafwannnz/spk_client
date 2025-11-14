import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPageShell({ title, description, actionSlot, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {description ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p> : null}
          </div>
          {actionSlot ? <div className="flex flex-wrap gap-3">{actionSlot}</div> : null}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
