import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { fetchExternalIdeas } from "../services/externalIdeasService";

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
        const { ideas, total, page } = await fetchExternalIdeas(
          input.page,
          input.limit,
          input.axis,
          input.search
        );

        return {
          ideas,
          total,
          page,
          hasMore: (page * input.limit) < total,
        };
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar ideias:", error);
        throw new Error("Falha ao buscar ideias");
      }
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
      "Juventude e Cultura",
      "Segurança",
      "Educação",
      "Família",
      "Governo que Serve",
      "Saúde",
      "Água e Saneamento",
      "Interior e Agro",
    ];
  }),
});
