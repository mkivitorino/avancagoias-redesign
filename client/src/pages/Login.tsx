import { useState } from "react";
import { Link } from "wouter";

const STATES = [
  "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal",
  "Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul",
  "Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí",
  "Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia",
  "Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins",
];

const AGE_RANGES = [
  "Menos de 18 anos","18 a 24 anos","25 a 34 anos","35 a 44 anos",
  "45 a 54 anos","55 a 64 anos","65+ anos",
];

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [livesInGoias, setLivesInGoias] = useState("sim");
  const [state, setState] = useState("Goiás");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? { name, email, password, gender, phone, livesInGoias, state, city, ageRange }
      : { email, password };

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

  const inputClass = "w-full py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,215,0,0.15)]";

  return (
    <div className="antialiased min-h-screen flex" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden p-12"
        style={{ background: "linear-gradient(to bottom right, #001F4D, #003380)" }}
      >
        <div className="absolute w-96 h-96 rounded-full -top-10 -left-20 opacity-60" style={{ background: "#FFD700", filter: "blur(80px)" }} />
        <div className="absolute w-80 h-80 rounded-full bottom-10 right-10 opacity-60" style={{ background: "#60a5fa", filter: "blur(80px)" }} />
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
          <p className="text-blue-100 text-lg leading-relaxed font-light">
            Acesse sua conta para enviar ideias, acompanhar propostas e votar nas soluções que farão a diferença.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto" style={{ backgroundColor: "#F3F6F8" }}>
        <Link href="/">
          <a className="absolute top-6 left-6 sm:top-8 sm:left-8 text-gray-500 hover:text-blue-900 font-medium transition-colors flex items-center gap-2 z-10">
            ← <span className="hidden sm:inline">Voltar</span>
          </a>
        </Link>

        <div className="w-full max-w-md my-12">
          <div className="text-center lg:hidden mb-8 mt-6">
            <span className="font-black text-3xl tracking-tight" style={{ color: "#001F4D" }}>
              GOIAS PODE <span style={{ color: "#FFD700" }}>+</span>
            </span>
          </div>

          <div className="p-8 sm:p-10" style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,31,77,0.08)", border: "1px solid rgba(0,0,0,0.03)" }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#001F4D" }}>
              {isRegister ? "Criar conta" : "Acesse sua conta"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isRegister ? "Complete seu cadastro para participar do movimento Goiás Pode Mais." : "Preencha seus dados para participar da plataforma."}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Nome Completo *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Como devemos te chamar?" className={inputClass} />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">E-mail *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu.email@exemplo.com" className={inputClass} />
                {isRegister && <p className="text-xs text-gray-400 mt-1">Email vinculado à sua conta (não pode ser alterado)</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Senha *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" className={inputClass + " pr-12"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium">
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {isRegister && (
                <>
                  {/* Gênero */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Gênero</label>
                    <div className="flex flex-wrap gap-4">
                      {["Masculino","Feminino","Outro","Prefiro não informar"].map((g) => (
                        <label key={g} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                          <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} className="accent-blue-900" />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Telefone / WhatsApp</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(62) 99999-9999" className={inputClass} />
                  </div>

                  {/* Mora em Goiás */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Você mora em Goiás?</label>
                    <div className="flex gap-6">
                      {[{v:"sim",l:"Sim, moro em Goiás"},{v:"nao",l:"Não, moro em outro estado"}].map((o) => (
                        <label key={o.v} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                          <input type="radio" name="livesInGoias" value={o.v} checked={livesInGoias === o.v} onChange={(e) => { setLivesInGoias(e.target.value); if (e.target.value === "sim") setState("Goiás"); }} className="accent-blue-900" />
                          {o.l}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estado (se não mora em Goiás) */}
                  {livesInGoias === "nao" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Estado</label>
                      <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass + " cursor-pointer"}>
                        <option value="">Selecione...</option>
                        {STATES.filter(s => s !== "Goiás").map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Cidade */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Cidade</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sua cidade" className={inputClass} />
                  </div>

                  {/* Faixa Etária */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Faixa Etária</label>
                    <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={inputClass + " cursor-pointer"}>
                      <option value="">Selecione...</option>
                      {AGE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FFC107)", color: "#001F4D", boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)" }}
                >
                  {loading ? "Carregando..." : isRegister ? "Criar Conta" : "Entrar na Plataforma"}
                </button>
              </div>
            </form>

            <div className="mt-5 text-center">
              <button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); }} className="text-sm font-semibold hover:underline" style={{ color: "#001F4D" }}>
                {isRegister ? "Já tem uma conta? Entrar" : "Não tem conta? Cadastre-se"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
