import { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, Share2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dados de exemplo - em produção viriam da API
const MOCK_IDEAS = [
  {
    id: "1",
    title: "Ferrovia Centro-Oeste",
    description: "Articular junto ao governo federal a conclusão da Ferrovia Centro-Oeste para escoamento da produção goiana, reduzindo custos de transporte e emissões de carbono.",
    axis: "Infraestrutura",
    author_name: "Camila Correia",
    city: "Abaíba",
    date: "2026-02-06",
    votes_up: 30,
    votes_down: 0,
  },
  {
    id: "2",
    title: "Plano AGROGOIÁS...versão NOVO PLANO DA AGROCIDADANIA",
    description: "Criar e Reformular ideias, iniciativas e projetos q possam dar sustentabilidade ao meio rural, dentro e fora da porteira.",
    axis: "Interior e Agro",
    author_name: "Zélia Soares",
    city: "Goiânia",
    date: "2026-03-19",
    votes_up: 20,
    votes_down: 0,
  },
  {
    id: "3",
    title: "Estruturação da Secretaria da Saúde com base no conceito de Saúde Única",
    description: "Adotar na Sec. Saúde Modelo Tridimensional de Saúde Única (One Health), com a criação da Superintendência de Bem-Estar Animal.",
    axis: "Saúde",
    author_name: "Zélia Soares",
    city: "Goiânia",
    date: "2026-03-19",
    votes_up: 10,
    votes_down: 0,
  },
  {
    id: "4",
    title: "Cursos para jovens",
    description: "Criação de novos programas de formação para jovens que buscam o primeiro emprego.",
    axis: "Emprego e Renda",
    author_name: "Gabriela Batista",
    city: "Aragoiânia",
    date: "2026-03-12",
    votes_up: 10,
    votes_down: 0,
  },
  {
    id: "5",
    title: "Nomeação do CR e Excedentes do CBM",
    description: "O atual governo diz que a Segurança Pública é a melhor do BRASIL. No entanto, é perceptível o descaso e indignação de muitos.",
    axis: "Segurança",
    author_name: "Pedro Borges",
    city: "São Luís de Montes Belos",
    date: "2026-03-11",
    votes_up: 10,
    votes_down: 0,
  },
  {
    id: "6",
    title: "Cultura investimento",
    description: "Precisa mais cultara e tbm oportunidade de emprego para pessoas jovens Itumbiara Goiás precisa de ajuda.",
    axis: "Desenvolvimento de Goiás",
    author_name: "Italo Perreira",
    city: "Itumbiara",
    date: "2026-03-05",
    votes_up: 10,
    votes_down: 0,
  },
  {
    id: "7",
    title: "Facilita agro",
    description: "Ajudar o pequeno medio e grande produtor para que tenha facilidade de conseguir autorgas de irrigação.",
    axis: "Interior e Agro",
    author_name: "Helio Vaz",
    city: "Edealina",
    date: "2026-03-20",
    votes_up: 0,
    votes_down: 0,
  },
  {
    id: "8",
    title: "Curso de agronomia na UEG de Edeia",
    description: "Utilizar a estrutura rural do município de Edeia para formar jovens.",
    axis: "Educação",
    author_name: "Helio Vaz",
    city: "Edealina",
    date: "2026-03-20",
    votes_up: 0,
    votes_down: 0,
  },
  {
    id: "9",
    title: "Precisa melhorar para pessoa que tem deficiência",
    description: "Precisa melhorar para quem tem deficiência física visual ou cognitiva que nem consegue ir fazer uma consulta.",
    axis: "Saúde",
    author_name: "Celso João Antunes Cordeiro",
    city: "Rianápolis",
    date: "2026-03-15",
    votes_up: 0,
    votes_down: 0,
  },
  {
    id: "10",
    title: "Vai melhorar para todos que tem deficiência",
    description: "Eu quero uma educação melhor para aqueles que tem deficiências física ou visual e também cognitivas.",
    axis: "Educação",
    author_name: "Celso João Antunes Cordeiro",
    city: "Rianápolis",
    date: "2026-03-15",
    votes_up: 0,
    votes_down: 0,
  },
];

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
  "Infraestrutura": "bg-green-500",
  "Interior e Agro": "bg-green-600",
  "Saúde": "bg-blue-600",
  "Emprego e Renda": "bg-purple-600",
  "Segurança": "bg-red-600",
  "Desenvolvimento de Goiás": "bg-orange-600",
  "Educação": "bg-blue-500",
  "Juventude e Cultura": "bg-pink-600",
  "Família": "bg-red-500",
  "Governo que Serve": "bg-gray-600",
  "Água e Saneamento": "bg-cyan-600",
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

  // Filtrar ideias
  const filteredIdeas = useMemo(() => {
    return MOCK_IDEAS.filter((idea) => {
      const matchesAxis = selectedAxis === "Todos" || idea.axis === selectedAxis;
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAxis && matchesSearch;
    });
  }, [selectedAxis, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedIdeas = filteredIdeas.slice(startIdx, startIdx + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
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
              Total de ideias: <span className="font-bold">{MOCK_IDEAS.length}</span>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
                  onClick={() => {
                    setSelectedAxis(axis);
                    setCurrentPage(1);
                  }}
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
              Mostrando {startIdx + 1} a {Math.min(startIdx + itemsPerPage, filteredIdeas.length)} de{" "}
              {filteredIdeas.length} ideias
            </p>
          </div>

          {/* Ideas Grid */}
          {paginatedIdeas.length > 0 ? (
            <div className="grid gap-6 mb-12">
              {paginatedIdeas.map((idea) => {
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
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ml-auto">
                        <Share2 size={18} />
                        <span>Compartilhar</span>
                      </button>
                    </div>

                    {/* Footer with Author Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{idea.author_name}</span>
                        <span>•</span>
                        <span>{idea.city}</span>
                      </div>
                      <span>{new Date(idea.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhuma ideia encontrada. Tente ajustar seus filtros.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
                disabled={currentPage === totalPages}
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
