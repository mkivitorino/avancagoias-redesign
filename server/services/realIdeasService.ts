/**
 * Serviço para buscar ideias do site original
 * Atualmente retorna dados de exemplo baseados na estrutura real
 */

export interface Idea {
  id: string;
  title: string;
  description: string;
  axis: string;
  author_name: string;
  city: string;
  date: string;
  votes_up: number;
  votes_down: number;
}

export interface IdeasResult {
  ideas: Idea[];
  total: number;
  hasMore: boolean;
}

// Dados de exemplo baseados na estrutura real do site original
const SAMPLE_IDEAS: Idea[] = [
  {
    id: "1",
    title: "Melhorar infraestrutura de escolas",
    description: "Precisa mais cultura e tbm oportunidade de emprego para pessoas jovens [Itumbiara Goiás precisa de ajuda hospital bom pq que tem é um caos calamidade diz respeito com um ser humano e as pessoas humilde",
    axis: "Educação",
    author_name: "Camila Correia",
    city: "Abaíba",
    date: "06/02/2026",
    votes_up: 30,
    votes_down: 0,
  },
  {
    id: "2",
    title: "Ampliar acesso a saúde mental",
    description: "Programa de atendimento psicológico para toda a população, especialmente para jovens e adolescentes em situação de vulnerabilidade social.",
    axis: "Saúde",
    author_name: "Zélia Soares",
    city: "Goiânia",
    date: "19/03/2026",
    votes_up: 20,
    votes_down: 0,
  },
  {
    id: "3",
    title: "Aumentar segurança nas ruas",
    description: "Implementar mais policiamento comunitário e iluminação pública em áreas periféricas para reduzir criminalidade.",
    axis: "Segurança",
    author_name: "João Silva",
    city: "Aragoiânia",
    date: "15/03/2026",
    votes_up: 45,
    votes_down: 2,
  },
  {
    id: "4",
    title: "Programa de empreendedorismo",
    description: "Criar programa de capacitação e microcrédito para jovens que querem abrir seu próprio negócio.",
    axis: "Emprego e Renda",
    author_name: "Maria Santos",
    city: "Anápolis",
    date: "10/03/2026",
    votes_up: 28,
    votes_down: 1,
  },
  {
    id: "5",
    title: "Recuperação de estradas rurais",
    description: "Investimento em manutenção e recuperação das estradas que ligam as comunidades rurais aos centros urbanos.",
    axis: "Infraestrutura",
    author_name: "Pedro Oliveira",
    city: "Jataí",
    date: "05/03/2026",
    votes_up: 52,
    votes_down: 0,
  },
  {
    id: "6",
    title: "Curso de agronomia na UEG",
    description: "Expandir oferecimento de cursos de agronomia e tecnologia agrícola nas universidades estaduais.",
    axis: "Educação",
    author_name: "Helio Vaz",
    city: "Edealina",
    date: "20/03/2026",
    votes_up: 15,
    votes_down: 0,
  },
  {
    id: "7",
    title: "Vai melhorar para todos que tem deficiência",
    description: "Políticas públicas de inclusão e acessibilidade para pessoas com deficiência em espaços públicos e privados.",
    axis: "Educação",
    author_name: "Celso João Antunes Cordeiro",
    city: "Rianápolis",
    date: "15/03/2026",
    votes_up: 38,
    votes_down: 0,
  },
  {
    id: "8",
    title: "Investimento em energia renovável",
    description: "Incentivar projetos de energia solar e eólica para reduzir custos e impacto ambiental.",
    axis: "Infraestrutura",
    author_name: "Ana Costa",
    city: "Goiânia",
    date: "12/03/2026",
    votes_up: 42,
    votes_down: 1,
  },
  {
    id: "9",
    title: "Programa de cultura e lazer",
    description: "Criar espaços públicos para eventos culturais, shows e atividades de lazer para toda a comunidade.",
    axis: "Juventude e Cultura",
    author_name: "Lucas Ferreira",
    city: "Aparecida de Goiânia",
    date: "08/03/2026",
    votes_up: 35,
    votes_down: 0,
  },
  {
    id: "10",
    title: "Saneamento básico em comunidades rurais",
    description: "Expandir sistema de abastecimento de água e esgoto para comunidades rurais e periféricas.",
    axis: "Água e Saneamento",
    author_name: "Francisco Gomes",
    city: "Itumbiara",
    date: "01/03/2026",
    votes_up: 48,
    votes_down: 0,
  },
];

export async function getIdeasPaginated(
  page: number = 1,
  limit: number = 10,
  axis?: string,
  search?: string
): Promise<IdeasResult> {
  try {
    console.log("[RealIdeasService] Buscando ideias com paginação:", { page, limit, axis, search });

    // Filtrar por eixo se especificado
    let filtered = SAMPLE_IDEAS;
    if (axis && axis !== "Todos") {
      filtered = filtered.filter((idea) =>
        idea.axis.toLowerCase() === axis.toLowerCase()
      );
    }

    // Filtrar por busca se especificada
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchLower) ||
          idea.description.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar paginação
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIdeas = filtered.slice(startIndex, endIndex);

    console.log(
      `[RealIdeasService] Retornando ${paginatedIdeas.length} ideias (página ${page} de ${Math.ceil(total / limit)})`
    );

    return {
      ideas: paginatedIdeas,
      total,
      hasMore: endIndex < total,
    };
  } catch (error) {
    console.error("[RealIdeasService] Erro ao buscar ideias:", error);
    throw new Error("Falha ao buscar ideias");
  }
}
