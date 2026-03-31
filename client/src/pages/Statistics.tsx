import { Loader2, BarChart2, Users, Lightbulb, MapPin, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

const AXIS_COLORS = [
  "#001F4D",
  "#003380",
  "#0055B3",
  "#FFD700",
  "#FFC200",
  "#22c55e",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

export default function Statistics() {
  const { data: stats, isLoading } = trpc.ideas.stats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8" }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin" size={36} style={{ color: "#001F4D" }} />
          <span className="ml-3 text-gray-600 font-medium">Carregando estatísticas...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8" }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Nenhum dado disponível.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const axisData = (stats.ideasByAxis ?? []).map((item) => ({
    name: item.axis,
    value: item.count,
  }));

  const topIdeasData = (stats.topIdeas ?? []).map((idea, idx) => ({
    name: `${idx + 1}. ${idea.title.length > 35 ? idea.title.substring(0, 35) + "…" : idea.title}`,
    votos: idea.votes_up + idea.votes_down,
  }));

  const citiesData = (stats.citiesByIdeas ?? [])
    .map((item) => ({ name: item.city, ideias: item.count }))
    .sort((a, b) => b.ideias - a.ideias);

  const metricCards = [
    {
      label: "Total de Ideias",
      value: stats.totalIdeas,
      icon: <Lightbulb size={22} style={{ color: "#FFD700" }} />,
      bg: "#001F4D",
      textColor: "#FFD700",
    },
    {
      label: "Participantes",
      value: stats.totalParticipants,
      icon: <Users size={22} style={{ color: "#FFD700" }} />,
      bg: "#003380",
      textColor: "#FFD700",
    },
    {
      label: "Total de Votos",
      value: stats.totalVotes,
      icon: <TrendingUp size={22} style={{ color: "#FFD700" }} />,
      bg: "#0055B3",
      textColor: "#FFD700",
    },
    {
      label: "Cidades Participantes",
      value: stats.totalCities,
      icon: <MapPin size={22} style={{ color: "#FFD700" }} />,
      bg: "#001F4D",
      textColor: "#FFD700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8" }}>
      <Header />
      <div className="h-[72px] md:h-[80px]" />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-24 pb-20 text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001F4D 0%, #003380 100%)",
        }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            background: "#FFD700",
            width: 320,
            height: 320,
            top: -40,
            right: -40,
            filter: "blur(80px)",
            opacity: 0.35,
          }}
        />
        <div className="container mx-auto px-4 relative text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span style={{ color: "#FFD700" }}>Estatísticas</span> da Plataforma
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#bfdbfe" }}>
            Acompanhe em tempo real o engajamento e a distribuição das ideias enviadas pela população de Goiás.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 pb-20 relative">

        {/* ── Cards de métricas (sobrepostos ao hero) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-10 mb-12">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col items-center justify-center p-6 text-center"
              style={{
                background: card.bg,
                borderRadius: 20,
                boxShadow: "0 8px 32px rgba(0,31,77,0.18)",
                color: "#fff",
              }}
            >
              <div className="mb-2">{card.icon}</div>
              <div
                className="text-3xl md:text-4xl font-extrabold mb-1"
                style={{ color: card.textColor }}
              >
                {card.value.toLocaleString("pt-BR")}
              </div>
              <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Gráficos principais ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Pizza: Ideias por Eixo */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.03)",
              padding: "2rem",
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#001F4D" }}>
              Ideias por Eixo Temático
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={axisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {axisData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={AXIS_COLORS[index % AXIS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend
                  formatter={(value) =>
                    value.length > 20 ? value.substring(0, 20) + "…" : value
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Barras horizontais: Top 5 Ideias */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.03)",
              padding: "2rem",
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#001F4D" }}>
              Top 5 Ideias Mais Votadas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topIdeasData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={180}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="votos" fill="#001F4D" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Barras verticais: Top 10 Cidades */}
        <div
          className="mb-8"
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.03)",
            padding: "2rem",
          }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "#001F4D" }}>
            Top 10 Cidades com Mais Ideias
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={citiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="ideias" fill="#FFD700" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela: Detalhamento por Eixo */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.03)",
            padding: "2rem",
            overflowX: "auto",
          }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "#001F4D" }}>
            Detalhamento por Eixo Temático
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "#001F4D" }}>
                  Eixo
                </th>
                <th className="text-right py-3 px-4 font-bold" style={{ color: "#001F4D" }}>
                  Ideias
                </th>
                <th className="text-right py-3 px-4 font-bold" style={{ color: "#001F4D" }}>
                  % do Total
                </th>
                <th className="py-3 px-4 font-bold" style={{ color: "#001F4D" }}>
                  Participação
                </th>
              </tr>
            </thead>
            <tbody>
              {(stats.ideasByAxis ?? []).map((item, idx) => {
                const pct = ((item.count / stats.totalIdeas) * 100).toFixed(1);
                return (
                  <tr
                    key={item.axis}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">{item.axis}</td>
                    <td className="text-right py-3 px-4 font-bold" style={{ color: "#001F4D" }}>
                      {item.count}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">{pct}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(4, parseFloat(pct))}%`,
                            background: AXIS_COLORS[idx % AXIS_COLORS.length],
                            minWidth: 4,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
