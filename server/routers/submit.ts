import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { submittedIdeas, users } from "../../drizzle/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { sendIdeaApprovedEmail } from "../services/emailService";

export const submitRouter = router({
  /**
   * Envia uma nova ideia (requer autenticação)
   * A ideia fica com status "pending" até ser aprovada por um admin
   */
  create: protectedProcedure
    .input(
      z.object({
        axis: z.string().min(1, "Eixo temático é obrigatório"),
        title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(255),
        description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
        authorName: z.string().optional(),
        authorCity: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Banco de dados indisponível");
      }

      await db.insert(submittedIdeas).values({
        userId: ctx.user.id,
        axis: input.axis,
        title: input.title,
        description: input.description,
        authorName: input.authorName ?? ctx.user.name ?? "Anônimo",
        authorCity: input.authorCity ?? null,
        status: "pending",
      });

      return { success: true, message: "Ideia enviada com sucesso! Ela será analisada pela equipe." };
    }),

  /**
   * Retorna as ideias enviadas pelo usuário logado
   */
  myIdeas: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const ideas = await db
      .select()
      .from(submittedIdeas)
      .where(eq(submittedIdeas.userId, ctx.user.id))
      .orderBy(desc(submittedIdeas.createdAt));

    return ideas;
  }),
});

/**
 * Router de administração — apenas usuários com role "admin" têm acesso
 */
export const adminRouter = router({
  /**
   * Lista todas as ideias submetidas (com filtro opcional por status)
   */
  ideas: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected", "all"]).default("pending"),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const statusFilter = input?.status ?? "pending";

      if (statusFilter === "all") {
        return db.select().from(submittedIdeas).orderBy(desc(submittedIdeas.createdAt));
      }

      return db
        .select()
        .from(submittedIdeas)
        .where(eq(submittedIdeas.status, statusFilter as "pending" | "approved" | "rejected"))
        .orderBy(desc(submittedIdeas.createdAt));
    }),

  /**
   * Atualiza o status de uma ideia (aprovar ou rejeitar)
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        ideaId: z.number().int().positive(),
        status: z.enum(["approved", "rejected"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Banco de dados indisponível");

      await db
        .update(submittedIdeas)
        .set({
          status: input.status,
          adminNotes: input.adminNotes ?? null,
          updatedAt: new Date(),
        })
        .where(eq(submittedIdeas.id, input.ideaId));

      // Send email on approval
      if (input.status === "approved") {
        try {
          const [idea] = await db.select().from(submittedIdeas).where(eq(submittedIdeas.id, input.ideaId)).limit(1);
          if (idea) {
            const [author] = await db.select().from(users).where(eq(users.id, idea.userId)).limit(1);
            if (author?.email) {
              sendIdeaApprovedEmail(author.email, author.name || "Cidadão", idea.title, idea.id);
            }
          }
        } catch (e) {
          console.error("[Admin] Failed to send approval email:", e);
        }
      }

      return { success: true };
    }),

  /**
   * Estatísticas de moderação para o painel admin
   */
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, pending: 0, approved: 0, rejected: 0 };

    const all = await db.select().from(submittedIdeas);

    return {
      total: all.length,
      pending: all.filter((i) => i.status === "pending").length,
      approved: all.filter((i) => i.status === "approved").length,
      rejected: all.filter((i) => i.status === "rejected").length,
    };
  }),

  listUsers: adminProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const q = input?.search?.trim();
      if (q) {
        const pattern = `%${q}%`;
        return db.select({
          id: users.id, name: users.name, email: users.email, role: users.role,
          city: users.city, createdAt: users.createdAt,
        }).from(users).where(or(like(users.name, pattern), like(users.email, pattern))).orderBy(desc(users.createdAt));
      }
      return db.select({
        id: users.id, name: users.name, email: users.email, role: users.role,
        city: users.city, createdAt: users.createdAt,
      }).from(users).orderBy(desc(users.createdAt));
    }),

  setUserRole: adminProcedure
    .input(z.object({
      userId: z.number().int().positive(),
      role: z.enum(["user", "admin"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id) throw new Error("Você não pode alterar seu próprio cargo");
      const db = await getDb();
      if (!db) throw new Error("Banco indisponível");
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),
});
