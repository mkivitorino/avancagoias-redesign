import { useState } from "react";
import { Link } from "wouter";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao processar");
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="antialiased min-h-screen flex" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Panel - Desktop only */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden p-12"
        style={{ background: "linear-gradient(to bottom right, #001F4D, #003380)" }}
      >
        <div
          className="absolute w-96 h-96 rounded-full -top-10 -left-20 opacity-60"
          style={{ background: "#FFD700", filter: "blur(80px)", animation: "float 10s infinite ease-in-out alternate" }}
        />
        <div
          className="absolute w-80 h-80 rounded-full bottom-10 right-10 opacity-60"
          style={{ background: "#60a5fa", filter: "blur(80px)", animation: "float 10s infinite ease-in-out alternate", animationDelay: "-5s" }}
        />

        <div className="relative z-10 text-center max-w-lg">
          <Link href="/">
            <a className="inline-block mb-12 hover:scale-105 transition-transform">
              <span className="text-white font-black text-4xl tracking-tight">
                GOIAS PODE <span style={{ color: "#FFD700" }}>+</span>
              </span>
            </a>
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Sua voz constrói o futuro do nosso estado.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed font-light mb-12">
            Acesse sua conta para enviar ideias, acompanhar propostas e votar nas soluções que farão a diferença na sua região.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative" style={{ backgroundColor: "#F3F6F8" }}>
        <Link href="/">
          <a className="absolute top-6 left-6 sm:top-8 sm:left-8 text-gray-500 hover:text-blue-900 font-medium transition-colors flex items-center gap-2">
            ← <span className="hidden sm:inline">Voltar</span>
          </a>
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center lg:hidden mb-8 mt-10">
            <span className="font-black text-3xl tracking-tight" style={{ color: "#001F4D" }}>
              GOIAS PODE <span style={{ color: "#FFD700" }}>+</span>
            </span>
          </div>

          <div
            className="p-8 sm:p-10"
            style={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0, 31, 77, 0.08)",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#001F4D" }}>
              {isRegister ? "Criar conta" : "Acesse sua conta"}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {isRegister
                ? "Preencha seus dados para se cadastrar."
                : "Preencha seus dados para participar da plataforma."}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Como devemos te chamar?"
                    className="w-full py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,215,0,0.15)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu.email@exemplo.com"
                  className="w-full py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,215,0,0.15)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,215,0,0.15)]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFC107)",
                    color: "#001F4D",
                    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  {loading
                    ? "Carregando..."
                    : isRegister
                      ? "Criar Conta"
                      : "Entrar na Plataforma"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-sm font-semibold hover:underline"
                style={{ color: "#001F4D" }}
              >
                {isRegister ? "Já tem uma conta? Entrar" : "Não tem conta? Cadastre-se"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Ao entrar, você concorda com nossos<br />
            <span className="font-semibold" style={{ color: "#001F4D" }}>Termos de Uso</span> e{" "}
            <span className="font-semibold" style={{ color: "#001F4D" }}>Política de Privacidade</span>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -50px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
