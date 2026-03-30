import { describe, it, expect } from "vitest";
import { getIdeasPaginated } from "./realIdeasService";

describe("RealIdeasService", () => {
  it("deve retornar 111 ideias no total", async () => {
    const result = await getIdeasPaginated(1, 1000);
    expect(result.total).toBe(111);
  });

  it("deve retornar 10 ideias na primeira página com limite de 10", async () => {
    const result = await getIdeasPaginated(1, 10);
    expect(result.ideas.length).toBe(10);
    expect(result.total).toBe(111);
    expect(result.hasMore).toBe(true);
  });

  it("deve ter 12 páginas (111 ideias / 10 por página)", async () => {
    const result = await getIdeasPaginated(1, 10);
    const totalPages = Math.ceil(result.total / 10);
    expect(totalPages).toBe(12);
  });

  it("deve retornar ideias da última página com 1 ideia", async () => {
    const result = await getIdeasPaginated(12, 10);
    expect(result.ideas.length).toBe(1);
    expect(result.hasMore).toBe(false);
  });

  it("deve filtrar ideias por eixo 'Desenvolvimento Econômico'", async () => {
    const result = await getIdeasPaginated(1, 100, "Desenvolvimento Econômico");
    expect(result.ideas.length).toBeGreaterThan(0);
    expect(result.ideas.every((idea) => idea.axis === "Desenvolvimento Econômico")).toBe(true);
  });

  it("deve filtrar ideias por eixo 'Infraestrutura'", async () => {
    const result = await getIdeasPaginated(1, 100, "Infraestrutura");
    expect(result.ideas.length).toBeGreaterThan(0);
    expect(result.ideas.every((idea) => idea.axis === "Infraestrutura")).toBe(true);
  });

  it("deve filtrar ideias por busca de texto", async () => {
    const result = await getIdeasPaginated(1, 100, undefined, "Polo Tecnológico");
    expect(result.ideas.length).toBeGreaterThan(0);
    expect(result.ideas[0].title).toContain("Polo Tecnológico");
  });

  it("deve retornar ideias com dados corretos", async () => {
    const result = await getIdeasPaginated(1, 1);
    const idea = result.ideas[0];
    
    expect(idea).toHaveProperty("id");
    expect(idea).toHaveProperty("title");
    expect(idea).toHaveProperty("description");
    expect(idea).toHaveProperty("axis");
    expect(idea).toHaveProperty("author_name");
    expect(idea).toHaveProperty("city");
    expect(idea).toHaveProperty("date");
    expect(idea).toHaveProperty("votes_up");
    expect(idea).toHaveProperty("votes_down");
  });

  it("deve ter votos válidos (números não negativos)", async () => {
    const result = await getIdeasPaginated(1, 111);
    expect(result.ideas.every((idea) => idea.votes_up >= 0 && idea.votes_down >= 0)).toBe(true);
  });

  it("deve ter autores e cidades preenchidos", async () => {
    const result = await getIdeasPaginated(1, 111);
    expect(result.ideas.every((idea) => idea.author_name && idea.city)).toBe(true);
  });

  it("deve conter diferentes eixos temáticos", async () => {
    const result = await getIdeasPaginated(1, 111);
    const axes = new Set(result.ideas.map((idea) => idea.axis));
    expect(axes.size).toBeGreaterThan(5);
  });

  it("deve respeitar paginação corretamente", async () => {
    const page1 = await getIdeasPaginated(1, 10);
    const page2 = await getIdeasPaginated(2, 10);
    
    expect(page1.ideas[0].id).not.toBe(page2.ideas[0].id);
    expect(page1.hasMore).toBe(true);
  });

  it("deve retornar hasMore=false na última página", async () => {
    const lastPage = await getIdeasPaginated(12, 10);
    expect(lastPage.hasMore).toBe(false);
  });

  it("deve filtrar por busca case-insensitive", async () => {
    const result1 = await getIdeasPaginated(1, 100, undefined, "polo");
    const result2 = await getIdeasPaginated(1, 100, undefined, "POLO");
    
    expect(result1.ideas.length).toBe(result2.ideas.length);
  });
});
