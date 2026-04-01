import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { ideaVotesDb } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getIdeasPaginated, getTopIdeas, getStats } from "../services/realIdeasService";

export const ideasRouter = router({
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
        const result = await getIdeasPaginated(input.page, input.limit, input.axis, input.search);
        return { ideas: result.ideas, total: result.total, hasMore: result.hasMore };
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar ideias:", error);
        throw new Error("Falha ao buscar ideias");
      }
    }),

  topIdeas: publicProcedure
    .input(z.object({ limit: z.number().int().positive().max(10).default(4) }).optional())
    .query(async ({ input }) => {
      try {
        return await getTopIdeas(input?.limit ?? 4);
      } catch (error) {
        console.error("[ideasRouter] Erro ao buscar top ideias:", error);
        throw new Error("Falha ao buscar top ideias");
      }
    }),

  vote: protectedProcedure
    .input(z.object({
      ideaId: z.string(),
      voteType: z.enum(["up", "down"]),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { ideaId, voteType } = input;
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const ideaIdNum = parseInt(ideaId, 10) || 0;

      // Check existing vote
      const existing = await db.select().from(ideaVotesDb)
        .where(and(eq(ideaVotesDb.ideaId, ideaIdNum), eq(ideaVotesDb.userId, userId)))
        .limit(1);

      if (existing.length > 0) {
        const prev = existing[0];
        if (prev.voteType === (voteType === "up" ? "like" : "dislike")) {
          // Toggle off - remove vote
          await db.delete(ideaVotesDb).where(eq(ideaVotesDb.id, prev.id));
        } else {
          // Switch vote
          await db.update(ideaVotesDb)
            .set({ voteType: voteType === "up" ? "like" : "dislike" })
            .where(eq(ideaVotesDb.id, prev.id));
        }
      } else {
        // New vote
        await db.insert(ideaVotesDb).values({
          ideaId: ideaIdNum,
          userId,
          voteType: voteType === "up" ? "like" : "dislike",
        });
      }

      // Get updated counts
      const counts = await getVoteCountsForIdea(db, ideaIdNum, userId);
      return { ideaId, ...counts };
    }),

  getVoteCounts: publicProcedure
    .input(z.object({ ideaIds: z.array(z.string()), sessionId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return input.ideaIds.map(id => ({ ideaId: id, votes_up: 0, votes_down: 0, userVote: null }));

      const userId = ctx.user?.id ?? null;
      const results = [];

      for (const id of input.ideaIds) {
        const ideaIdNum = parseInt(id, 10) || 0;
        const counts = await getVoteCountsForIdea(db, ideaIdNum, userId);
        results.push({ ideaId: id, ...counts });
      }

      return results;
    }),

  stats: publicProcedure.query(() => getStats()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async () => null),

  getAxes: publicProcedure.query(() => [
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
  ]),
});

async function getVoteCountsForIdea(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ideaId: number, userId: number | null) {
  const [upResult] = await db.select({ count: sql<number>`count(*)` }).from(ideaVotesDb)
    .where(and(eq(ideaVotesDb.ideaId, ideaId), eq(ideaVotesDb.voteType, "like")));
  const [downResult] = await db.select({ count: sql<number>`count(*)` }).from(ideaVotesDb)
    .where(and(eq(ideaVotesDb.ideaId, ideaId), eq(ideaVotesDb.voteType, "dislike")));

  let userVote: "up" | "down" | null = null;
  if (userId) {
    const userVoteRow = await db.select().from(ideaVotesDb)
      .where(and(eq(ideaVotesDb.ideaId, ideaId), eq(ideaVotesDb.userId, userId)))
      .limit(1);
    if (userVoteRow.length > 0) {
      userVote = userVoteRow[0].voteType === "like" ? "up" : "down";
    }
  }

  return {
    votes_up: Number(upResult?.count ?? 0),
    votes_down: Number(downResult?.count ?? 0),
    userVote,
  };
}
