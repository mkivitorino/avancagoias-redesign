import { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, Share2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { trpc } from "@/lib/trpc";

const AXES = [
  "Todos",
  "Desenvolvimento Econômico",
  "Infraestrutura",
  "Emprego e Renda",
  "Educação",
  "Saúde",
  "Segurança",
  "Juventude",
  "Cultura e Lazer",
  "Agricultura",
  "Interior e Agro",
  "Meio Ambiente",
];

const AXIS_COLORS: Record<string, string> = {
  "Desenvolvimento Econômico": "bg-orange-600",
  "Infraestrutura": "bg-blue-900",
  "Emprego e Renda": "bg-orange-500",
  "Educação": "bg-blue-600",
  "Saúde": "bg-blue-700",
  "Segurança": "bg-blue-800",
  "Juventude": "bg-yellow-500",
  "Cultura e Lazer": "bg-yellow-600",
  "Agricultura": "bg-green-600",
  "Interior e Agro": "bg-green-700",
  "Meio Ambiente": "bg-cyan-600",
};

interface Vote {
  [key: string]: "up" | "down" | null;
}

export default function Ideas() {
  const [selectedAxis, setSelectedAxis] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [votes, setVotes] = useState<Vote>({});
  const itemsPerPage = 10;

  // Buscar ideias da API
  const { data: ideasData, isLoading, error } = trpc.ideas.list.useQuery({
    page: currentPage,
    limit: itemsPerPage,
    axis: selectedAxis === "Todos" ? undefined : selectedAxis,
    search: searchTerm || undefined,
  });

  const ideas = ideasData?.ideas || [];
  const total = ideasData?.total || 0;
  const hasMore = ideasData?.hasMore || false;
  const totalPages = Math.ceil(total / itemsPerPage);

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

  const handleVote = (ideaId: string, voteType: "up" | "down") => {
    setVotes((prev) => {
      const current = prev[ideaId];
      if (current === voteType) {
        return { ...prev, [ideaId]: null };
      }
      return { ...prev, [ideaId]: voteType };
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (axis: string) => {
    setSelectedAxis(axis);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">
              Confira as ideias enviadas pela população e vote nas que você mais gosta
            </h1>
            <p className="text-lg">
              Total de ideias: <span className="font-bold">{total}</span>
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar ideias por título ou descrição..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8">
            <p className="text-sm font-bold text-gray-600 mb-4">Filtrar por eixo:</p>
            <div className="flex flex-wrap gap-2">
              {AXES.map((axis) => (
                <button
                  key={axis}
                  onClick={() => handleFilterChange(axis)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    selectedAxis === axis
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {axis}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">
              Mostrando {ideas.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
              {Math.min(currentPage * itemsPerPage, total)} de {total} ideias
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="ml-3 text-gray-600">Carregando ideias...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-800">
                Erro ao carregar ideias. Por favor, tente novamente.
              </p>
            </div>
          )}

          {/* Ideas Grid */}
          {!isLoading && ideas.length > 0 ? (
            <div className="grid gap-6 mb-12">
              {ideas.map((idea) => {
                const userVote = votes[idea.id];
                return (
                  <div
                    key={idea.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Header with Axis and Approval */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-2">
                        <span
                          className={`${AXIS_COLORS[idea.axis] || "bg-gray-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}
                        >
                          {idea.axis}
                        </span>
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          100% aprovação
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-3">{idea.title}</h3>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 line-clamp-3">{idea.description}</p>

                    {/* Voting and Share */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => handleVote(idea.id, "up")}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                          userVote === "up"
                            ? "bg-yellow-400 border-yellow-400 text-gray-800"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <ThumbsUp size={18} className="text-green-600" />
                        <span className="font-bold">{idea.votes_up}</span>
                      </button>
                      <button
                        onClick={() => handleVote(idea.id, "down")}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                          userVote === "down"
                            ? "bg-red-400 border-red-400 text-white"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <ThumbsDown size={18} className="text-red-600" />
                        <span className="font-bold">{idea.votes_down}</span>
                      </button>
                      <ShareButton
                        ideaTitle={idea.title}
                        ideaDescription={idea.description}
                        ideaId={idea.id}
                        authorName={idea.author_name}
                        className="ml-auto"
                      />
                    </div>

                    {/* Footer with Author Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{idea.author_name}</span>
                        <span>•</span>
                        <span>{idea.city}</span>
                      </div>
                      <span>{idea.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && ideas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhuma ideia encontrada. Tente ajustar seus filtros.
              </p>
            </div>
          ) : null}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasMore}
                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
