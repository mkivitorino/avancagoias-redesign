import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getIdeasPaginated, getTopIdeas, getStats } from "../services/realIdeasService";

// Armazenamento em memória dos votos: Map<ideaId, Map<sessionId, "up" | "down">>
const voteStore = new Map<string, Map<string, "up" | "down">>();
// Contadores de votos: Map<ideaId, { up: number; down: number }>
const voteCounters = new Map<string, { up: number; down: number }>();

export const ideasRouter = router({
  /**
   * Busca ideias do site original com paginação
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(10),
        axis: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await getIdeasPaginated(
          input.page,
          input.limit,
          input.axis,
          input.search
        );

        return {
          ideas: result.ideas,
          total: result.total,
          hasMore: result.hasMore,
        };
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar ideias:", error);
        throw new Error("Falha ao buscar ideias");
      }
    }),

  /**
   * Retorna as 4 ideias mais votadas
   */
  topIdeas: publicProcedure
    .input(z.object({ limit: z.number().int().positive().max(10).default(4) }).optional())
    .query(async ({ input }) => {
      try {
        const ideas = await getTopIdeas(input?.limit ?? 4);
        return ideas;
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar top ideias:", error);
        throw new Error("Falha ao buscar top ideias");
      }
    }),

  /**
   * Registra um voto em uma ideia (up ou down)
   * Usa o IP + user-agent como identificador de sessão anônima
   */
  vote: publicProcedure
    .input(z.object({
      ideaId: z.string(),
      voteType: z.enum(["up", "down"]),
      sessionId: z.string(), // identificador único do browser
    }))
    .mutation(({ input }) => {
      const { ideaId, voteType, sessionId } = input;

      // Inicializa os mapas se necessário
      if (!voteStore.has(ideaId)) {
        voteStore.set(ideaId, new Map());
      }
      if (!voteCounters.has(ideaId)) {
        voteCounters.set(ideaId, { up: 0, down: 0 });
      }

      const ideaVotes = voteStore.get(ideaId)!;
      const counters = voteCounters.get(ideaId)!;
      const previousVote = ideaVotes.get(sessionId);

      // Se votou igual, remove o voto (toggle off)
      if (previousVote === voteType) {
        ideaVotes.delete(sessionId);
        counters[voteType] = Math.max(0, counters[voteType] - 1);
        return { ideaId, votes_up: counters.up, votes_down: counters.down, userVote: null };
      }

      // Se mudou o voto, remove o anterior
      if (previousVote) {
        counters[previousVote] = Math.max(0, counters[previousVote] - 1);
      }

      // Registra o novo voto
      ideaVotes.set(sessionId, voteType);
      counters[voteType] += 1;

      return { ideaId, votes_up: counters.up, votes_down: counters.down, userVote: voteType };
    }),

  /**
   * Retorna os contadores de votos para uma lista de ideias
   */
  getVoteCounts: publicProcedure
    .input(z.object({ ideaIds: z.array(z.string()), sessionId: z.string() }))
    .query(({ input }) => {
      return input.ideaIds.map((id) => {
        const counters = voteCounters.get(id) || { up: 0, down: 0 };
        const ideaVotes = voteStore.get(id);
        const userVote = ideaVotes?.get(input.sessionId) || null;
        return { ideaId: id, votes_up: counters.up, votes_down: counters.down, userVote };
      });
    }),

  /**
   * Retorna estatísticas completas das ideias
   */
  stats: publicProcedure.query(() => {
    return getStats();
  }),

  /**
   * Busca uma ideia específica por ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // Implementar busca por ID quando necessário
        return null;
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar ideia:", error);
        throw new Error("Falha ao buscar ideia");
      }
    }),

  /**
   * Retorna os eixos temáticos disponíveis
   */
  getAxes: publicProcedure.query(() => {
    return [
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
  }),
});
