import { useState, useRef } from "react";
import { ThumbsUp, ThumbsDown, Search, Loader2, MapPin, TrendingUp, ChevronLeft, ChevronRight, Share2, PieChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const AXES = [
  "Todos",
  "Desenvolvimento de Goiás",
  "Infraestrutura",
  "Emprego e Renda",
  "Educação",
  "Saúde",
  "Segurança",
  "Juventude e Cultura",
  "Família",
  "Governo que Serve",
  "Interior e Agro",
  "Água e Saneamento",
];

// Cor da borda superior de cada card por eixo
const AXIS_BORDER_COLOR: Record<string, string> = {
  "Desenvolvimento de Goiás": "#f97316",
  "Infraestrutura": "#3b82f6",
  "Emprego e Renda": "#f59e0b",
  "Educação": "#6366f1",
  "Saúde": "#ef4444",
  "Segurança": "#475569",
  "Juventude e Cultura": "#eab308",
  "Família": "#ec4899",
  "Governo que Serve": "#8b5cf6",
  "Interior e Agro": "#22c55e",
  "Água e Saneamento": "#06b6d4",
};

// Badge de eixo: bg + text color
const AXIS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  "Desenvolvimento de Goiás": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Infraestrutura":           { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Emprego e Renda":          { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  "Educação":                 { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe" },
  "Saúde":                    { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  "Segurança":                { bg: "#f8fafc", text: "#334155", border: "#e2e8f0" },
  "Juventude e Cultura":      { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  "Família":                  { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
  "Governo que Serve":        { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  "Interior e Agro":          { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Água e Saneamento":        { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" },
};

// Avatar gradient por inicial
const AVATAR_GRADIENT: Record<string, string> = {
  A: "from-blue-600 to-blue-400",
  B: "from-purple-600 to-purple-400",
  C: "from-blue-700 to-blue-500",
  D: "from-green-600 to-green-400",
  E: "from-red-600 to-red-400",
  F: "from-orange-500 to-amber-400",
  G: "from-orange-400 to-amber-300",
  H: "from-teal-600 to-teal-400",
  I: "from-blue-500 to-cyan-400",
  J: "from-indigo-600 to-indigo-400",
  K: "from-pink-600 to-pink-400",
  L: "from-lime-600 to-lime-400",
  M: "from-blue-800 to-blue-600",
  N: "from-violet-600 to-violet-400",
  O: "from-amber-600 to-amber-400",
  P: "from-slate-600 to-slate-400",
  Q: "from-cyan-600 to-cyan-400",
  R: "from-rose-600 to-rose-400",
  S: "from-sky-600 to-sky-400",
  T: "from-emerald-600 to-emerald-400",
  U: "from-fuchsia-600 to-fuchsia-400",
  V: "from-violet-700 to-violet-500",
  W: "from-yellow-600 to-yellow-400",
  X: "from-red-700 to-red-500",
  Y: "from-green-700 to-green-500",
  Z: "from-red-500 to-rose-400",
};

interface Vote {
  [key: string]: "up" | "down" | null;
}
interface VoteCount {
  [key: string]: { up: number; down: number };
}

function getSessionId(): string {
  const key = "goias_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

export default function Ideas() {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialAxis = urlParams?.get("eixo") || "Todos";
  const [selectedAxis, setSelectedAxis] = useState(initialAxis);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [votes, setVotes] = useState<Vote>({});
  const [voteCounts, setVoteCounts] = useState<VoteCount>({});
  const [pendingVotes, setPendingVotes] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<"recent" | "votes" | "oldest">("recent");
  const sessionId = useRef(typeof window !== "undefined" ? getSessionId() : "");
  const itemsPerPage = 10;

  const { data: ideasData, isLoading, error } = trpc.ideas.list.useQuery({
    page: currentPage,
    limit: itemsPerPage,
    axis: selectedAxis === "Todos" ? undefined : selectedAxis,
    search: searchTerm || undefined,
  });

  const rawIdeas = ideasData?.ideas || [];
  const parseDate = (d: string) => {
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`).getTime() || 0;
  };
  const ideas = [...rawIdeas].sort((a, b) => {
    if (sortOrder === "votes") return (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down);
    if (sortOrder === "oldest") return parseDate(a.date) - parseDate(b.date);
    return parseDate(b.date) - parseDate(a.date); // recent = default
  });
  const total = ideasData?.total || 0;
  const hasMore = ideasData?.hasMore || false;
  const totalPages = Math.ceil(total / itemsPerPage);

  const voteMutation = trpc.ideas.vote.useMutation({
    onSuccess: (data) => {
      // Apenas confirma o estado do voto do usuário — os contadores já foram
      // atualizados pelo optimistic update e não devem ser sobrescritos pelo
      // servidor (que só conta deltas em memória, sem os votos base reais)
      setVotes((prev) => ({ ...prev, [data.ideaId]: data.userVote as "up" | "down" | null }));
      setPendingVotes((prev) => { const s = new Set(prev); s.delete(data.ideaId); return s; });
    },
    onError: (_err, variables) => {
      // Em caso de erro, reverte o optimistic update restaurando os valores originais da ideia
      const idea = ideasData?.ideas.find((i) => i.id === variables.ideaId);
      if (idea) {
        setVoteCounts((prev) => ({
          ...prev,
          [variables.ideaId]: { up: idea.votes_up, down: idea.votes_down },
        }));
        setVotes((prev) => ({ ...prev, [variables.ideaId]: null }));
      }
      setPendingVotes((prev) => { const s = new Set(prev); s.delete(variables.ideaId); return s; });
    },
  });

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { isAuthenticated } = useAuth();

  const handleVote = (idea: { id: string; votes_up: number; votes_down: number }, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (pendingVotes.has(idea.id)) return;
    const currentVote = votes[idea.id];
    const currentCounts = voteCounts[idea.id] || { up: idea.votes_up, down: idea.votes_down };

    // Optimistic update imediato
    if (currentVote === voteType) {
      setVotes((prev) => ({ ...prev, [idea.id]: null }));
      setVoteCounts((prev) => ({
        ...prev,
        [idea.id]: { ...currentCounts, [voteType]: Math.max(0, currentCounts[voteType] - 1) },
      }));
    } else {
      const newCounts = { ...currentCounts };
      if (currentVote) newCounts[currentVote] = Math.max(0, newCounts[currentVote] - 1);
      newCounts[voteType] += 1;
      setVotes((prev) => ({ ...prev, [idea.id]: voteType }));
      setVoteCounts((prev) => ({ ...prev, [idea.id]: newCounts }));
    }

    setPendingVotes((prev) => new Set(prev).add(idea.id));
    voteMutation.mutate({ ideaId: idea.id, voteType, sessionId: sessionId.current });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (axis: string) => {
    setSelectedAxis(axis);
    setCurrentPage(1);
  };

  const startItem = ideas.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8" }}>
      <Header />
      <div className="h-[72px] md:h-[80px]" />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-24 pb-20 text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001F4D 0%, #003380 100%)",
          zIndex: 10,
        }}
      >
        {/* Blob decorativo */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            background: "#FFD700",
            width: 320,
            height: 320,
            top: -40,
            right: -40,
            filter: "blur(80px)",
            opacity: 0.35,
            zIndex: 0,
          }}
        />
        <div className="container mx-auto px-4 relative text-center" style={{ zIndex: 1 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Mural de <span style={{ color: "#FFD700" }}>Ideias</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: "#bfdbfe" }}>
            Confira as ideias enviadas pela população e vote nas que você mais gosta para construirmos juntos o futuro.
          </p>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <PieChart size={16} style={{ color: "#FFD700" }} />
            <span className="font-medium text-sm">
              Total de ideias ativas:{" "}
              <span className="font-bold text-lg ml-1" style={{ color: "#FFD700" }}>
                {total || 179}
              </span>
            </span>
          </div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 pb-20 relative" style={{ zIndex: 20 }}>

        {/* ── Painel de Busca e Filtros (card flutuante) ── */}
        <div
          className="p-6 md:p-8 -mt-10 mb-10 max-w-5xl mx-auto"
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 40px rgba(0,31,77,0.12)",
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          {/* Campo de busca */}
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute text-gray-400"
              style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Buscar ideias por título, palavra-chave ou município..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition-all text-gray-700 font-medium"
              style={{ paddingLeft: 48, paddingRight: 16 }}
            />
          </div>

          {/* Filtros por eixo */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Filtrar por eixo temático:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {AXES.map((axis) => (
                <button
                  key={axis}
                  onClick={() => handleFilterChange(axis)}
                  className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all"
                  style={
                    selectedAxis === axis
                      ? {
                          background: "#001F4D",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(0,31,77,0.25)",
                        }
                      : {
                          background: "#f3f4f6",
                          color: "#4b5563",
                          border: "1px solid #e5e7eb",
                        }
                  }
                >
                  {axis}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Barra de resultados e ordenação ── */}
        <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
          <p className="text-sm font-medium text-gray-500">
            Mostrando{" "}
            <span className="font-bold" style={{ color: "#001F4D" }}>
              {startItem} a {endItem}
            </span>{" "}
            de {total} ideias
          </p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "recent" | "votes" | "oldest")}
            className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg p-2 outline-none cursor-pointer shadow-sm"
            style={{ focusRing: "none" } as any}
          >
            <option value="recent">Mais recentes</option>
            <option value="votes">Mais votadas</option>
            <option value="oldest">Mais antigas</option>
          </select>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin" size={32} style={{ color: "#001F4D" }} />
            <span className="ml-3 text-gray-600 font-medium">Carregando ideias...</span>
          </div>
        )}

        {/* ── Erro ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
            <p className="text-red-800">Erro ao carregar ideias. Por favor, tente novamente.</p>
          </div>
        )}

        {/* ── Grid de Cards ── */}
        {!isLoading && ideas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {ideas.map((idea) => {
              const userVote = votes[idea.id];
              const counts = voteCounts[idea.id] || { up: idea.votes_up, down: idea.votes_down };
              const isPending = pendingVotes.has(idea.id);
              const borderColor = AXIS_BORDER_COLOR[idea.axis] || "#001F4D";
              const badge = AXIS_BADGE[idea.axis] || { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };
              const initial = (idea.author_name || "?")[0].toUpperCase();
              const avatarGrad = AVATAR_GRADIENT[initial] || "from-blue-600 to-blue-400";
              const approvalRate =
                counts.up + counts.down > 0
                  ? Math.round((counts.up / (counts.up + counts.down)) * 100)
                  : 100;

              return (
                <div
                  key={idea.id}
                  className="flex flex-col h-full"
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.03)",
                    borderTop: `4px solid ${borderColor}`,
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    padding: "1.5rem 2rem",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 24px rgba(0,31,77,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
                  }}
                >
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {idea.axis}
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                      style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}
                    >
                      <TrendingUp size={11} /> {approvalRate}% aprovação
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{idea.title}</h3>

                  {/* Descrição */}
                  <p
                    className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    } as any}
                  >
                    {idea.description}
                  </p>

                  {/* Votos e Compartilhar */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => handleVote(idea, "up")}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        ...(userVote === "up"
                          ? { background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" }
                          : { background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" }),
                        opacity: isPending ? 0.7 : 1,
                        cursor: isPending ? "wait" : "pointer",
                        transform: userVote === "up" ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <ThumbsUp size={15} /> {counts.up}
                    </button>
                    <button
                      onClick={() => handleVote(idea, "down")}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        ...(userVote === "down"
                          ? { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }
                          : { background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" }),
                        opacity: isPending ? 0.7 : 1,
                        cursor: isPending ? "wait" : "pointer",
                        transform: userVote === "down" ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <ThumbsDown size={15} /> {counts.down}
                    </button>
                    <ShareButton
                      ideaTitle={idea.title}
                      ideaDescription={idea.description}
                      ideaId={idea.id}
                      authorName={idea.author_name}
                      className="ml-auto"
                    />
                  </div>

                  {/* Rodapé do card */}
                  <div
                    className="flex items-center justify-between pt-4 text-xs"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad} text-white flex items-center justify-center font-bold shadow-inner`}
                      >
                        {initial}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{idea.author_name}</p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <MapPin size={10} className="text-gray-400" /> {idea.city}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 font-medium">{idea.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Sem resultados ── */}
        {!isLoading && ideas.length === 0 && (
          <div className="text-center py-16 max-w-5xl mx-auto">
            <p className="text-gray-500 text-lg">Nenhuma ideia encontrada. Tente ajustar seus filtros.</p>
          </div>
        )}

        {/* ── Paginação ── */}
        {!isLoading && totalPages > 1 && (
          <div
            className="flex items-center justify-center gap-4 mt-4 max-w-5xl mx-auto pt-8"
            style={{ borderTop: "1px solid #e5e7eb" }}
          >
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm"
              style={
                currentPage === 1
                  ? { background: "#f9fafb", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "not-allowed" }
                  : { background: "#fff", color: "#001F4D", border: "1px solid #d1d5db" }
              }
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span
              className="text-sm font-semibold px-4 py-2 rounded-full"
              style={{ background: "#eff6ff", color: "#001F4D" }}
            >
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={!hasMore}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm"
              style={
                !hasMore
                  ? { background: "#f9fafb", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "not-allowed" }
                  : { background: "#fff", color: "#001F4D", border: "1px solid #d1d5db" }
              }
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
