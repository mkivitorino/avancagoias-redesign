import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getIdeasPaginated } from "../services/realIdeasService";

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
  }),
});
