/**
 * Serviço para consumir ideias do site original (avancagoias.com.br)
 * Versão simplificada com dados de exemplo
 */

export interface ExternalIdea {
  id: string;
  title: string;
  description: string;
  axis: string;
  author_name: string;
  city: string;
  date: string;
  votes_up: number;
  votes_down: number;
  approval_status: boolean;
}

// Dados de exemplo baseados no site original
const SAMPLE_IDEAS: ExternalIdea[] = [
  {
    id: "idea-1",
    title: "Ferrovia Centro-Oeste",
    description: "Articular junto ao governo federal a conclusão da Ferrovia Centro-Oeste para escoamento da produção goiana, reduzindo custos de transporte e emissões de carbono.",
    axis: "Infraestrutura",
    author_name: "Camila Correia",
    city: "Abaíba",
    date: "2026-02-06",
    votes_up: 30,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-2",
    title: "Plano AGROGOIÁS...versão NOVO PLANO DA AGROCIDADANIA",
    description: "Criar e Reformular ideias, iniciativas e projetos q possam dar sustentabilidade ao meio rural, dentro e fora da porteira. Alavancando estratégias e parcerias para consolidar políticas públicas para o Agronegócio.",
    axis: "Interior e Agro",
    author_name: "Zélia Soares",
    city: "Goiânia",
    date: "2026-03-19",
    votes_up: 20,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-3",
    title: "Estruturação da Secretaria da Saúde com base no conceito de Saúde Única 'One Health'",
    description: "Adotar na Sec. Saúde Modelo Tridimensional de Saúde Única( One Health), com a criação da Superintendência de Bem-Estar Animal, fortalecendo a prevenção de zoonones e uma melhor eficiência em saúde pública, integrando saúde humana, ambiental e animal.",
    axis: "Saúde",
    author_name: "Zélia Soares",
    city: "Goiânia",
    date: "2026-03-19",
    votes_up: 10,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-4",
    title: "Cursos para jovens",
    description: "Criação de novos programas de formação para jovens que buscam o primeiro emprego.",
    axis: "Emprego e Renda",
    author_name: "Gabriela Batista",
    city: "Aragoiânia",
    date: "2026-03-12",
    votes_up: 10,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-5",
    title: "Nomeação do CR e Excedentes do CBM",
    description: "O atual governo diz que a Segurança Pública é a melhor do BRASIL. No entanto, é perceptível o descaso e indignação de muitos. Até hoje não foram nomeados os Cadastro de Reserva do último concurso do CBM (Edital 004/2022).",
    axis: "Segurança",
    author_name: "Pedro Borges",
    city: "São Luís de Montes Belos",
    date: "2026-03-11",
    votes_up: 10,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-6",
    title: "Cultura investimento",
    description: "Precisa mais cultara e tbm oportunidade de emprego para pessoas jovens Itumbiara Goiás precisa de ajuda hospital bom pq que tem é um caos calamidade diz respeito com um ser humano e as pessoas humilde",
    axis: "Desenvolvimento de Goiás",
    author_name: "Italo Perreira",
    city: "Itumbiara",
    date: "2026-03-05",
    votes_up: 10,
    votes_down: 0,
    approval_status: true,
  },
  {
    id: "idea-7",
    title: "Facilita agro",
    description: "Ajudar o pequeno medio e grande produtor para que tenha facilidade de conseguir autorgas de irrigação para aumentar a produção em Goiás",
    axis: "Interior e Agro",
    author_name: "Helio Vaz",
    city: "Edealina",
    date: "2026-03-20",
    votes_up: 0,
    votes_down: 0,
    approval_status: false,
  },
  {
    id: "idea-8",
    title: "Curso de agronomia na UEG de Edeia",
    description: "Utilizar a estrutura rural do município de Edeia para formar jovens",
    axis: "Educação",
    author_name: "Helio Vaz",
    city: "Edealina",
    date: "2026-03-20",
    votes_up: 0,
    votes_down: 0,
    approval_status: false,
  },
  {
    id: "idea-9",
    title: "Precisa melhorar para pessoa que tem deficiência",
    description: "Precisa melhorar para quem tem deficiência física visual ou cognitiva que nem consegue ir fazer uma consulta",
    axis: "Saúde",
    author_name: "Celso João Antunes Cordeiro",
    city: "Rianápolis",
    date: "2026-03-15",
    votes_up: 0,
    votes_down: 0,
    approval_status: false,
  },
  {
    id: "idea-10",
    title: "Vai melhorar para todos que tem deficiência",
    description: "Eu quero uma educação melhor para aqueles que tem deficiências física ou visual e também cognitivas",
    axis: "Educação",
    author_name: "Celso João Antunes Cordeiro",
    city: "Rianápolis",
    date: "2026-03-15",
    votes_up: 0,
    votes_down: 0,
    approval_status: false,
  },
];

/**
 * Busca ideias com filtros
 * @param page Número da página (1-indexed)
 * @param limit Quantidade de ideias por página
 * @param axis Eixo temático para filtrar (opcional)
 * @param search Termo de busca (opcional)
 */
export async function fetchExternalIdeas(
  page: number = 1,
  limit: number = 10,
  axis?: string,
  search?: string
): Promise<{ ideas: ExternalIdea[]; total: number; page: number }> {
  try {
    console.log(`[ExternalIdeasService] Buscando ideias - página: ${page}, limite: ${limit}, eixo: ${axis}, busca: ${search}`);

    // Filtrar por eixo
    let filtered = SAMPLE_IDEAS;
    if (axis && axis !== "Todos") {
      filtered = filtered.filter((idea) =>
        idea.axis.toLowerCase().includes(axis.toLowerCase())
      );
    }

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchLower) ||
          idea.description.toLowerCase().includes(searchLower)
      );
    }

    // Calcular paginação
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedIdeas = filtered.slice(start, end);

    console.log(`[ExternalIdeasService] Retornando ${paginatedIdeas.length} ideias de ${total} total`);

    return {
      ideas: paginatedIdeas,
      total,
      page,
    };
  } catch (error) {
    console.error("[ExternalIdeasService] Erro ao buscar ideias:", error);
    throw new Error(
      `Falha ao buscar ideias: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Busca uma ideia específica por ID
 */
export async function fetchExternalIdeaById(id: string): Promise<ExternalIdea | null> {
  try {
    const idea = SAMPLE_IDEAS.find((i) => i.id === id);
    return idea || null;
  } catch (error) {
    console.error("[ExternalIdeasService] Erro ao buscar ideia por ID:", error);
    return null;
  }
}
