import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  User,
  Calendar,
  Loader2,
  ShieldAlert,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type StatusFilter = "pending" | "approved" | "rejected" | "all";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pendente", color: "#b45309", bg: "#fffbeb", icon: <Clock size={14} /> },
  approved: { label: "Aprovada", color: "#16a34a", bg: "#f0fdf4", icon: <CheckCircle2 size={14} /> },
  rejected: { label: "Rejeitada", color: "#dc2626", bg: "#fef2f2", icon: <XCircle size={14} /> },
};

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<number, string>>({});

  const { data: ideas, isLoading, refetch } = trpc.admin.ideas.useQuery(
    { status: statusFilter },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateStatus = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao atualizar status");
    },
  });

  const handleApprove = (ideaId: number) => {
    updateStatus.mutate({ ideaId, status: "approved" });
  };

  const handleReject = (ideaId: number) => {
    const notes = rejectNotes[ideaId] || "";
    updateStatus.mutate({ ideaId, status: "rejected", adminNotes: notes || undefined });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-700" size={40} />
        </main>
        <Footer />
      </div>
    );
  }

  // Não autenticado ou não admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div
            className="text-center max-w-md w-full p-10 rounded-3xl"
            style={{ background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.07)" }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#fef2f2" }}>
              <ShieldAlert size={28} style={{ color: "#dc2626" }} />
            </div>
            <h1 className="text-2xl font-extrabold mb-3" style={{ color: "#001F4D" }}>
              Acesso Restrito
            </h1>
            <p className="text-gray-500">Esta área é exclusiva para administradores.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F6F8" }}>
      <Header />

      {/* Hero */}
      <section
        className="pt-32 pb-20 text-white"
        style={{ background: "linear-gradient(135deg, #001F4D 0%, #003380 100%)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-2">
            Painel de <span style={{ color: "#FFD700" }}>Moderação</span>
          </h1>
          <p className="text-blue-200">Gerencie as ideias enviadas pelos cidadãos</p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 -mt-10 mb-20 relative z-10">
        {/* Cards de estatísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "#001F4D", bg: "#fff" },
              { label: "Pendentes", value: stats.pending, color: "#b45309", bg: "#fffbeb" },
              { label: "Aprovadas", value: stats.approved, color: "#16a34a", bg: "#f0fdf4" },
              { label: "Rejeitadas", value: stats.rejected, color: "#dc2626", bg: "#fef2f2" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-5 rounded-2xl text-center"
                style={{ background: s.bg, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.04)" }}
              >
                <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-sm font-medium text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div
          className="p-4 rounded-2xl mb-6 flex flex-wrap gap-2"
          style={{ background: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
        >
          {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: statusFilter === s ? "#001F4D" : "#F3F6F8",
                color: statusFilter === s ? "#fff" : "#64748b",
              }}
            >
              {s === "pending" ? "Pendentes" : s === "approved" ? "Aprovadas" : s === "rejected" ? "Rejeitadas" : "Todas"}
              {s !== "all" && stats && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: statusFilter === s ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                    color: statusFilter === s ? "#fff" : "#64748b",
                  }}
                >
                  {s === "pending" ? stats.pending : s === "approved" ? stats.approved : stats.rejected}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista de ideias */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-700" size={32} />
          </div>
        ) : !ideas || ideas.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
          >
            <BarChart3 size={40} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400 font-medium">Nenhuma ideia encontrada nesta categoria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => {
              const statusInfo = STATUS_LABELS[idea.status];
              const isExpanded = expandedId === idea.id;

              return (
                <div
                  key={idea.id}
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    borderLeft: `4px solid ${idea.status === "approved" ? "#16a34a" : idea.status === "rejected" ? "#dc2626" : "#FFD700"}`,
                  }}
                >
                  {/* Cabeçalho */}
                  <div
                    className="p-5 cursor-pointer flex items-start justify-between gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: statusInfo.bg, color: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: "#eff6ff", color: "#2563eb" }}
                        >
                          <Layers size={11} /> {idea.axis}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight" style={{ color: "#001F4D" }}>
                        {idea.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {idea.authorName || "Anônimo"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(idea.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-gray-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <p className="text-gray-600 leading-relaxed mt-4 mb-5">{idea.description}</p>

                      {idea.adminNotes && (
                        <div
                          className="p-3 rounded-xl mb-4 text-sm"
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                        >
                          <strong>Nota do admin:</strong> {idea.adminNotes}
                        </div>
                      )}

                      {/* Ações — só mostrar para ideias pendentes */}
                      {idea.status === "pending" && (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Nota de rejeição (opcional, só necessária ao rejeitar)..."
                            value={rejectNotes[idea.id] || ""}
                            onChange={(e) =>
                              setRejectNotes((prev) => ({ ...prev, [idea.id]: e.target.value }))
                            }
                            rows={2}
                            className="w-full p-3 rounded-xl text-sm resize-none"
                            style={{ border: "2px solid #E2E8F0", background: "#F8FAFC", outline: "none", fontFamily: "inherit" }}
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(idea.id)}
                              disabled={updateStatus.isPending}
                              className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                              style={{ background: "#f0fdf4", color: "#16a34a", border: "2px solid #bbf7d0" }}
                            >
                              {updateStatus.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleReject(idea.id)}
                              disabled={updateStatus.isPending}
                              className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                              style={{ background: "#fef2f2", color: "#dc2626", border: "2px solid #fecaca" }}
                            >
                              {updateStatus.isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                              Rejeitar
                            </button>
                          </div>
                        </div>
                      )}
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
