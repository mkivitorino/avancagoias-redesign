import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Idea {
  id: number;
  title: string;
  description: string;
  axis: string;
  votes: { favor: number; contra: number };
  userVote: "favor" | "contra" | null;
}

// Mock data - em produção, virá de uma API
const mockIdeas: Idea[] = [
  {
    id: 1,
    title: "Melhorar infraestrutura de escolas",
    description:
      "Investir em reformas e modernização das escolas públicas do estado.",
    axis: "Educação",
    votes: { favor: 234, contra: 12 },
    userVote: null,
  },
  {
    id: 2,
    title: "Ampliar acesso a saúde mental",
    description: "Criar centros de atendimento psicológico em todas as regiões.",
    axis: "Saúde",
    votes: { favor: 189, contra: 8 },
    userVote: null,
  },
  {
    id: 3,
    title: "Aumentar segurança nas ruas",
    description: "Implementar mais policiamento comunitário e câmeras.",
    axis: "Segurança",
    votes: { favor: 456, contra: 34 },
    userVote: null,
  },
  {
    id: 4,
    title: "Programa de empreendedorismo",
    description: "Apoiar pequenos negócios com crédito e capacitação.",
    axis: "Emprego e Renda",
    votes: { favor: 312, contra: 15 },
    userVote: null,
  },
  {
    id: 5,
    title: "Recuperação de estradas rurais",
    description: "Pavimentar e manter estradas do interior.",
    axis: "Infraestrutura",
    votes: { favor: 567, contra: 28 },
    userVote: null,
  },
];

const axes = [
  "Educação",
  "Saúde",
  "Segurança",
  "Infraestrutura",
  "Emprego e Renda",
  "Desenvolvimento",
  "Juventude e Cultura",
  "Família",
  "Governo que Serve",
  "Água e Saneamento",
  "Interior e Agro",
];

export default function Ideas() {
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter ideas by axis
  const filteredIdeas = useMemo(() => {
    if (!selectedAxis) return ideas;
    return ideas.filter((idea) => idea.axis === selectedAxis);
  }, [ideas, selectedAxis]);

  // Paginate ideas
  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage);
  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIdeas.slice(start, start + itemsPerPage);
  }, [filteredIdeas, currentPage]);

  const handleVote = (ideaId: number, voteType: "favor" | "contra") => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === ideaId) {
          const newIdea = { ...idea };
          if (idea.userVote === voteType) {
            // Remove vote
            newIdea.votes[voteType] = Math.max(0, newIdea.votes[voteType] - 1);
            newIdea.userVote = null;
          } else {
            // Add or change vote
            if (idea.userVote) {
              newIdea.votes[idea.userVote] = Math.max(
                0,
                newIdea.votes[idea.userVote] - 1
              );
            }
            newIdea.votes[voteType] += 1;
            newIdea.userVote = voteType;
          }
          return newIdea;
        }
        return idea;
      })
    );
  };

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

        {/* Filters Section */}
        <section className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="font-bold text-lg mb-4 text-primary">
              Filtrar por Eixo Temático
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedAxis === null ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedAxis(null);
                  setCurrentPage(1);
                }}
              >
                Todos
              </Button>
              {axes.map((axis) => (
                <Button
                  key={axis}
                  variant={selectedAxis === axis ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedAxis(axis);
                    setCurrentPage(1);
                  }}
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
            {paginatedIdeas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhuma ideia encontrada neste eixo.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                            {idea.axis}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {idea.title}
                        </h3>
                        <p className="text-gray-600">{idea.description}</p>
                      </div>

                      {/* Voting Section */}
                      <div className="flex gap-4 md:flex-col items-center md:items-end">
                        <div className="flex gap-2">
                          <Button
                            variant={
                              idea.userVote === "favor" ? "favor" : "outline"
                            }
                            size="sm"
                            onClick={() => handleVote(idea.id, "favor")}
                            className="flex items-center gap-2"
                          >
                            <ThumbsUp size={16} />
                            <span className="font-bold">
                              {idea.votes.favor}
                            </span>
                          </Button>
                          <Button
                            variant={
                              idea.userVote === "contra" ? "contra" : "outline"
                            }
                            size="sm"
                            onClick={() => handleVote(idea.id, "contra")}
                            className="flex items-center gap-2"
                          >
                            <ThumbsDown size={16} />
                            <span className="font-bold">
                              {idea.votes.contra}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima
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
