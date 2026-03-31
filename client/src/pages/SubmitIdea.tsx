import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Lightbulb,
  User,
  Mail,
  Heading,
  Layers,
  Send,
  RotateCcw,
  LogIn,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface FormData {
  title: string;
  description: string;
  axis: string;
  name: string;
  email: string;
}

const AXES = [
  "Educação",
  "Saúde",
  "Segurança",
  "Infraestrutura",
  "Emprego e Renda",
  "Desenvolvimento de Goiás",
  "Juventude e Cultura",
  "Família",
  "Governo que Serve",
  "Água e Saneamento",
  "Interior e Agro",
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Envie sua ideia",
    desc: "Preencha o formulário acima com sua sugestão e dados de contato.",
    color: "#FFD700",
    bg: "#fffbeb",
    textColor: "#b45309",
    borderColor: "#FFD700",
  },
  {
    step: 2,
    title: "Análise",
    desc: "Nossa equipe técnica analisa todas as ideias recebidas com carinho.",
    color: "#60a5fa",
    bg: "#eff6ff",
    textColor: "#2563eb",
    borderColor: "#60a5fa",
  },
  {
    step: 3,
    title: "Publicação",
    desc: "Ideias viáveis e aprovadas são publicadas para votação da comunidade.",
    color: "#001F4D",
    bg: "#dbeafe",
    textColor: "#001F4D",
    borderColor: "#001F4D",
  },
  {
    step: 4,
    title: "Incorporação",
    desc: "As melhores e mais votadas ideias são incorporadas ao plano de governo.",
    color: "#22c55e",
    bg: "#f0fdf4",
    textColor: "#16a34a",
    borderColor: "#22c55e",
  },
];

export default function SubmitIdea() {
  const { user, isAuthenticated, loading } = useAuth();
  const createIdea = trpc.submit.create.useMutation();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    axis: "",
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user, isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.axis || !formData.name.trim() || !formData.email.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createIdea.mutateAsync({
        axis: formData.axis,
        title: formData.title,
        description: formData.description,
        authorName: formData.name || undefined,
      });
      setSubmitted(true);
      toast.success("Sua ideia foi enviada com sucesso! Obrigado pela participação.");
    } catch (err: any) {
      const msg = err?.message || "Erro ao enviar ideia. Tente novamente.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      axis: "",
      name: user?.name || "",
      email: user?.email || "",
    });
    setSubmitted(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-700" size={40} />
            <p className="text-gray-500 font-medium">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div
            className="text-center max-w-md w-full p-10 rounded-3xl"
            style={{
              background: "#fff",
              boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "#eff6ff" }}
            >
              <LogIn size={28} style={{ color: "#001F4D" }} />
            </div>
            <h1 className="text-2xl font-extrabold mb-3" style={{ color: "#001F4D" }}>
              Acesso Restrito
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Para enviar uma ideia, você precisa estar logado. Faça login ou cadastre-se para continuar.
            </p>
            <button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFC107)",
                color: "#001F4D",
                boxShadow: "0 4px 15px rgba(255,215,0,0.35)",
              }}
            >
              <LogIn size={20} /> Fazer Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div
            className="text-center max-w-md w-full p-10 rounded-3xl"
            style={{
              background: "#fff",
              boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "#f0fdf4" }}
            >
              <CheckCircle2 size={32} style={{ color: "#16a34a" }} />
            </div>
            <h1 className="text-2xl font-extrabold mb-3" style={{ color: "#001F4D" }}>
              Ideia Enviada!
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Obrigado pela sua participação! Sua ideia foi recebida e será analisada pela nossa equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl font-bold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: "#001F4D", color: "#001F4D" }}
              >
                Enviar outra ideia
              </button>
              <button
                onClick={() => (window.location.href = "/ideias")}
                className="flex-1 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFC107)",
                  color: "#001F4D",
                  boxShadow: "0 4px 15px rgba(255,215,0,0.3)",
                }}
              >
                Ver todas as ideias
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
      <Header />

      {/* Hero Banner */}
      <section
        className="relative pt-32 pb-36 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #001F4D 0%, #003380 100%)" }}
      >
        {/* Blob decorativo */}
        <div
          className="absolute -top-10 -left-20 w-96 h-96 rounded-full opacity-40"
          style={{
            background: "#FFD700",
            filter: "blur(80px)",
            animation: "float 12s infinite ease-in-out alternate",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span
            className="inline-block py-1 px-4 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            Participação Cidadã
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Envie Sua <span style={{ color: "#FFD700" }}>Ideia</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Compartilhe suas sugestões para melhorar Goiás. Sua ideia pode fazer a diferença na vida de milhões de goianos!
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 relative z-20 -mt-24 mb-20">
        {/* Form Card */}
        <div
          className="max-w-3xl mx-auto p-6 md:p-12 mb-20"
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção: Detalhes da Proposta */}
            <div className="space-y-6">
              <div
                className="flex items-center gap-3 mb-6 pb-4"
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#eff6ff" }}
                >
                  <Lightbulb size={20} style={{ color: "#001F4D" }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: "#001F4D" }}>
                  Detalhes da Proposta
                </h2>
              </div>

              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                  Título da Ideia <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    maxLength={100}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Descreva sua ideia em poucas palavras"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all"
                    style={{
                      border: "2px solid #E2E8F0",
                      background: "#F8FAFC",
                      outline: "none",
                      fontFamily: "inherit",
                      color: "#1e293b",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FFD700";
                      e.target.style.background = "#fff";
                      e.target.style.boxShadow = "0 0 0 4px rgba(255,215,0,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E2E8F0";
                      e.target.style.background = "#F8FAFC";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <Heading
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#94A3B8" }}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {formData.title.length}/100 caracteres
                  </span>
                </div>
              </div>

              {/* Eixo Temático */}
              <div>
                <label htmlFor="axis" className="block text-sm font-bold text-gray-700 mb-2">
                  Eixo Temático <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="axis"
                    name="axis"
                    value={formData.axis}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl appearance-none cursor-pointer transition-all"
                    style={{
                      border: "2px solid #E2E8F0",
                      background: "#F8FAFC",
                      outline: "none",
                      fontFamily: "inherit",
                      color: formData.axis ? "#1e293b" : "#94A3B8",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FFD700";
                      e.target.style.background = "#fff";
                      e.target.style.boxShadow = "0 0 0 4px rgba(255,215,0,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E2E8F0";
                      e.target.style.background = "#F8FAFC";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="" disabled>
                      Selecione a área principal da sua ideia...
                    </option>
                    {AXES.map((axis) => (
                      <option key={axis} value={axis} style={{ color: "#1e293b" }}>
                        {axis}
                      </option>
                    ))}
                  </select>
                  <Layers
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#94A3B8" }}
                  />
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  maxLength={1000}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explique sua ideia com mais detalhes. Como ela melhoraria Goiás?"
                  className="w-full p-4 rounded-xl resize-y transition-all"
                  style={{
                    border: "2px solid #E2E8F0",
                    background: "#F8FAFC",
                    outline: "none",
                    fontFamily: "inherit",
                    color: "#1e293b",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FFD700";
                    e.target.style.background = "#fff";
                    e.target.style.boxShadow = "0 0 0 4px rgba(255,215,0,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.background = "#F8FAFC";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {formData.description.length}/1000 caracteres
                  </span>
                </div>
              </div>
            </div>

            {/* Seção: Seus Dados */}
            <div
              className="rounded-2xl p-6 md:p-8 mt-8"
              style={{
                background: "rgba(239,246,255,0.5)",
                border: "1px solid #dbeafe",
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: "#fff" }}
                >
                  <User size={20} style={{ color: "#001F4D" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "#001F4D" }}>
                    Seus Dados
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Seus dados de cadastro foram pré-preenchidos automaticamente. Você pode editá-los se necessário.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Seu Nome
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all"
                      style={{
                        border: "2px solid #E2E8F0",
                        background: "#fff",
                        outline: "none",
                        fontFamily: "inherit",
                        color: "#1e293b",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FFD700";
                        e.target.style.boxShadow = "0 0 0 4px rgba(255,215,0,0.15)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E2E8F0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#94A3B8" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Seu Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all"
                      style={{
                        border: "2px solid #E2E8F0",
                        background: "#fff",
                        outline: "none",
                        fontFamily: "inherit",
                        color: "#1e293b",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FFD700";
                        e.target.style.boxShadow = "0 0 0 4px rgba(255,215,0,0.15)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E2E8F0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#94A3B8" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{
                  background: isSubmitting
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #FFD700, #FFC107)",
                  color: "#001F4D",
                  boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(255,215,0,0.3)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Enviar Ideia
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:bg-gray-100"
                style={{
                  border: "2px solid #E2E8F0",
                  color: "#64748b",
                  background: "transparent",
                }}
              >
                <RotateCcw size={16} /> Limpar
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              <span className="text-red-500 font-bold">*</span> Campos obrigatórios. Seus dados serão utilizados apenas para contato sobre sua ideia.
            </p>
          </form>
        </div>

        {/* Como Funciona */}
        <div className="max-w-5xl mx-auto mt-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#001F4D" }}>
              Como Funciona?
            </h2>
            <p className="text-gray-500">
              Entenda o caminho da sua ideia até se tornar parte do plano de governo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="p-6 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.03)",
                  borderTop: `4px solid ${item.borderColor}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black mb-4 shadow-sm"
                  style={{ background: item.bg, color: item.textColor }}
                >
                  {item.step}
                </div>
                <h3 className="font-bold mb-2 text-lg" style={{ color: "#001F4D" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
