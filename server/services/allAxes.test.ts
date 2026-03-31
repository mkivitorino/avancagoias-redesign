import { describe, it, expect } from "vitest";
import { getIdeasPaginated } from "./realIdeasService";

describe("Validação de Todos os Eixos Temáticos", () => {
  const EXPECTED_AXES = {
    "Desenvolvimento Econômico": 13,
    "Infraestrutura": 13,
    "Emprego e Renda": 12,
    "Educação": 10,
    "Saúde": 9,
    "Segurança": 8,
    "Juventude": 12,
    "Cultura e Lazer": 6,
    "Agricultura": 8,
    "Interior e Agro": 12,
    "Meio Ambiente": 8,
  };

  it("deve ter exatamente 111 ideias no total", async () => {
    const result = await getIdeasPaginated(1, 111);
    expect(result.total).toBe(111);
    expect(result.ideas.length).toBe(111);
  });

  it("deve retornar contagem correta para cada eixo", async () => {
    for (const [axis, expectedCount] of Object.entries(EXPECTED_AXES)) {
      const result = await getIdeasPaginated(1, 200, axis);
      expect(result.total).toBe(expectedCount, `Eixo "${axis}" deve ter ${expectedCount} ideias`);
    }
  });

  it("deve ter todos os 11 eixos representados", async () => {
    const result = await getIdeasPaginated(1, 111);
    const uniqueAxes = new Set(result.ideas.map((idea) => idea.axis));
    expect(uniqueAxes.size).toBe(11);
    
    for (const axis of Object.keys(EXPECTED_AXES)) {
      expect(uniqueAxes.has(axis)).toBe(true, `Eixo "${axis}" deve estar presente`);
    }
  });

  it("deve somar 111 ideias quando contar todos os eixos", () => {
    const total = Object.values(EXPECTED_AXES).reduce((sum, count) => sum + count, 0);
    expect(total).toBe(111, `Total de ideias: ${total}`);
  });
});
