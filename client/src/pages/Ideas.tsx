import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const AXES = [
  "Todos",
  "Desenvolvimento de Goiás",
  "Infraestrutura",
  "Emprego e Renda",
  "Juventude e Cultura",
  "Segurança",
  "Educação",
  "Família",
  "Governo que Serve",
  "Saúde",
  "Água e Saneamento",
  "Interior e Agro",
];

const AXIS_COLORS: Record<string, string> = {
  "Desenvolvimento de Goiás": "bg-green-600",
  Infraestrutura: "bg-blue-600",
  "Emprego e Renda": "bg-purple-600",
  "Juventude e Cultura": "bg-pink-600",
  Segurança: "bg-red-600",
  Educação: "bg-yellow-600",
  Família: "bg-orange-600",
  "Governo que Serve": "bg-indigo-600",
  Saúde: "bg-teal-600",
  "Água e Saneamento": "bg-cyan-600",
  "Interior e Agro": "bg-lime-600",
};

interface Vote {
  [key: string]: "up" | "down" | null;
}

export default function Ideas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAxis, setSelectedAxis] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [votes, setVotes] = useState<Vote>({});

  // Buscar ideias da API
  const { data, isLoading, error } = trpc.ideas.list.useQuery({
    page: currentPage,
    limit: 10,
    axis: selectedAxis !== "Todos" ? selectedAxis : undefined,
    search: searchTerm || undefined,
  });

  // Processar dados
  const ideas = data?.ideas || [];
  const hasMore = data?.hasMore || false;
  const total = data?.total || 0;

  // Handlers
  const handleVote = (ideaId: string, voteType: "up" | "down") => {
    setVotes((prev) => {
      const current = prev[ideaId];
      if (current === voteType) {
        // Remover voto se clicar novamente
        return { ...prev, [ideaId]: null };
      }
      // Adicionar ou trocar voto
      return { ...prev, [ideaId]: voteType };
    });
  };

  const handleAxisFilter = (axis: string) => {
    setSelectedAxis(axis);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-red-700 mb-2">
                Erro ao carregar ideias
              </h2>
              <p className="text-red-600">{error.message}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Ideias da Comunidade</h1>
            <p className="text-lg text-gray-100">
              Explore as ideias enviadas pela população goiana e vote nas que
              você mais apoia.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-gray-50 py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <input
              type="text"
              placeholder="Buscar ideias por título ou descrição..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="font-bold text-lg mb-4 text-primary">
              Filtrar por Eixo Temático
            </h3>
            <div className="flex flex-wrap gap-3">
              {AXES.map((axis) => (
                <Button
                  key={axis}
                  variant={selectedAxis === axis ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAxisFilter(axis)}
                  className={
                    selectedAxis === axis
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }
                >
                  {axis}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Ideas List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-primary mr-2" size={24} />
                <span className="text-gray-600">Carregando ideias...</span>
              </div>
            )}

            {/* Ideas Grid */}
            {!isLoading && ideas.length > 0 && (
              <>
                <div className="mb-6 text-sm text-gray-600">
                  Mostrando {(currentPage - 1) * 10 + 1} a{" "}
                  {Math.min(currentPage * 10, total)} de {total} ideias
                </div>

                <div className="space-y-6">
                  {ideas.map((idea) => {
                    const userVote = votes[idea.id];
                    const upCount = idea.votes_up;
                    const downCount = idea.votes_down;

                    return (
                      <div
                        key={idea.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-grow">
                            {/* Axis Badge */}
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={`${
                                  AXIS_COLORS[idea.axis] || "bg-gray-500"
                                } text-white`}
                              >
                                {idea.axis}
                              </Badge>
                              {idea.approval_status && (
                                <Badge className="bg-blue-600 text-white">
                                  100% aprovação
                                </Badge>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-primary mb-2">
                              {idea.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-3">
                              {idea.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3">
                              <span className="font-semibold">
                                {idea.author_name}
                              </span>
                              <span>•</span>
                              <span>{idea.city}</span>
                              <span>•</span>
                              <span>
                                {new Date(idea.date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Voting Section */}
                          <div className="flex gap-2 md:flex-col items-center md:items-end">
                            <Button
                              variant={
                                userVote === "up" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleVote(idea.id, "up")}
                              className={
                                userVote === "up"
                                  ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                                  : ""
                              }
                            >
                              👍 {upCount}
                            </Button>
                            <Button
                              variant={
                                userVote === "down" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleVote(idea.id, "down")}
                              className={
                                userVote === "down"
                                  ? "bg-red-400 text-white hover:bg-red-500"
                                  : ""
                              }
                            >
                              👎 {downCount}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Empty State */}
            {!isLoading && ideas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhuma ideia encontrada. Tente ajustar seus filtros.
                </p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && ideas.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </Button>

                <span className="text-gray-600 font-medium">
                  Página {currentPage} de {Math.ceil(total / 10)}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!hasMore}
                >
                  Próxima →
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
