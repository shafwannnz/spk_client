import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react"; // ikon modern

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login berhasil!");
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        setEmail("");
        setPassword("");
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(data.message || "Login gagal");
      }
    } catch {
      setMessage("Terjadi kesalahan server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('')] bg-cover bg-center opacity-20"></div>

      <div className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8 w-full max-w-md text-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full text-white mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m-2.25 0h12a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-9A2.25 2.25 0 016 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Log in to your account</h2>
          <p className="text-gray-500 text-center text-sm mt-1">
            Enter your email and password below to log in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Log in
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              message.includes("berhasil")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
