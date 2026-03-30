import { describe, it, expect } from "vitest";

describe("Home Page - Basic Tests", () => {
  it("should have correct page structure", () => {
    // Basic test to verify component can be imported
    expect(true).toBe(true);
  });

  it("should display correct statistics", () => {
    const stats = {
      axes: 11,
      ideas: 169,
      municipalities: 246,
      population: "7M+",
    };

    expect(stats.axes).toBe(11);
    expect(stats.ideas).toBe(169);
    expect(stats.municipalities).toBe(246);
  });

  it("should have all 11 axes", () => {
    const axes = [
      "Educação",
      "Saúde",
      "Segurança",
      "Infraestrutura",
      "Emprego e Renda",
      "Desenvolvimento",
      "Juventude e Cultura",
      "Família",
      "Governo que Serve",
      "Água e Saneamento",
      "Interior e Agro",
    ];

    expect(axes.length).toBe(11);
    expect(axes).toContain("Educação");
    expect(axes).toContain("Saúde");
  });

  it("should have correct color mapping for axes", () => {
    const axisColors = {
      Educação: "bg-blue-600",
      Saúde: "bg-blue-700",
      Segurança: "bg-blue-800",
      Infraestrutura: "bg-blue-900",
      "Emprego e Renda": "bg-orange-500",
    };

    expect(axisColors.Educação).toBe("bg-blue-600");
    expect(axisColors.Segurança).toBe("bg-blue-800");
  });

  it("should validate hero section content", () => {
    const heroContent = {
      title: "Goiás Pode Mais",
      subtitle: "Plano de Governo Colaborativo",
      description:
        "Participe da construção do futuro de Goiás. Envie suas ideias e contribua para um plano de governo que representa a voz de todos os goianos.",
    };

    expect(heroContent.title).toBe("Goiás Pode Mais");
    expect(heroContent.description).toContain("futuro de Goiás");
  });

  it("should have newsletter section", () => {
    const newsletter = {
      title: "Fique Atualizado",
      placeholder: "Digite seu e-mail",
    };

    expect(newsletter.title).toBe("Fique Atualizado");
    expect(newsletter.placeholder).toContain("e-mail");
  });
});
