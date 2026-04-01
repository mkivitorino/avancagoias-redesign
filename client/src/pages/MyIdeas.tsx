import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Send, Loader2, Clock, CheckCircle2, XCircle, FileText, LogIn } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Em análise", color: "#b45309", bg: "#fffbeb", icon: Clock },
  approved: { label: "Aprovada", color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle2 },
  rejected: { label: "Não aprovada", color: "#dc2626", bg: "#fef2f2", icon: XCircle },
};

export default function MyIdeas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: ideas, isLoading } = trpc.submit.myIdeas.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin" size={40} style={{ color: "#001F4D" }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full p-10 rounded-3xl" style={{ background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#eff6ff" }}>
              <LogIn size={28} style={{ color: "#001F4D" }} />
            </div>
            <h1 className="text-2xl font-extrabold mb-3" style={{ color: "#001F4D" }}>Acesso Restrito</h1>
            <p className="text-gray-500 mb-8">Faça login para ver suas ideias enviadas.</p>
            <button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #FFD700, #FFC107)", color: "#001F4D", boxShadow: "0 4px 15px rgba(255,215,0,0.35)" }}
            >
              Fazer Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
      <Header />
      <div className="h-[72px] md:h-[80px]" />

      {/* Hero */}
      <section className="relative pt-16 pb-20 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #001F4D 0%, #003380 100%)" }}>
        <div className="absolute rounded-full pointer-events-none" style={{ background: "#FFD700", width: 300, height: 300, top: -40, right: -40, filter: "blur(80px)", opacity: 0.3 }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Minhas Ideias</h1>
              <p className="text-blue-200 mt-2">Acompanhe o status das suas ideias enviadas</p>
            </div>
            <Link href="/enviar-ideia">
              <a className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5" style={{ background: "#FFD700", color: "#001F4D", boxShadow: "0 4px 15px rgba(255,215,0,0.3)" }}>
                <Send size={16} /> Nova Ideia
              </a>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-10 -mt-8 relative z-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin" size={32} style={{ color: "#001F4D" }} />
            <span className="ml-3 text-gray-600 font-medium">Carregando suas ideias...</span>
          </div>
        ) : !ideas || ideas.length === 0 ? (
          <div className="max-w-lg mx-auto text-center p-12 rounded-2xl" style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#f1f5f9" }}>
              <Send size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#001F4D" }}>Nenhuma ideia enviada</h2>
            <p className="text-gray-500 mb-8">Você ainda não enviou nenhuma ideia. Que tal começar agora?</p>
            <Link href="/enviar-ideia">
              <a className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5" style={{ background: "#001F4D", color: "#fff" }}>
                <Send size={16} /> Enviar Primeira Ideia
              </a>
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {ideas.map((idea) => {
              const status = STATUS_MAP[idea.status] || STATUS_MAP.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={idea.id}
                  className="p-6 rounded-2xl transition-all hover:shadow-lg"
                  style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" }}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold" style={{ color: "#001F4D" }}>{idea.title}</h3>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start"
                      style={{ background: status.bg, color: status.color }}
                    >
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{idea.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#f1f5f9" }}>{idea.axis}</span>
                    {idea.authorCity && <span className="px-2.5 py-1 rounded-full" style={{ background: "#f1f5f9" }}>{idea.authorCity}</span>}
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#f1f5f9" }}>
                      {new Date(idea.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {idea.adminNotes && (
                    <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
                      <span className="font-bold text-blue-800">Observação:</span>{" "}
                      <span className="text-blue-700">{idea.adminNotes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
