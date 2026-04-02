import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, ThumbsUp, MapPin, TrendingUp, Truck, Briefcase, GraduationCap, HeartPulse, Shield, Palette, Users, Landmark, Tractor, Droplets } from "lucide-react";
import { trpc } from "@/lib/trpc";


const axes = [
  {
    id: 1,
    name: "Desenvolvimento de Goiás",
    description: "Visão estratégica para crescimento econômico e desenvolvimento.",
    icon: TrendingUp,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    hoverBg: "hover:bg-orange-600",
    hoverText: "hover:text-white",
  },
  {
    id: 2,
    name: "Infraestrutura",
    description: "Estradas, pontes, obras estruturantes e mobilidade.",
    icon: Truck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-800",
    hoverBg: "hover:bg-blue-800",
    hoverText: "hover:text-white",
  },
  {
    id: 3,
    name: "Emprego e Renda",
    description: "Geração de empregos e qualificação profissional.",
    icon: Briefcase,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    hoverBg: "hover:bg-yellow-400",
    hoverText: "hover:text-[#001F4D]",
  },
  {
    id: 4,
    name: "Educação",
    description: "Escolas, valorização do professor e qualidade do ensino.",
    icon: GraduationCap,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    hoverBg: "hover:bg-indigo-600",
    hoverText: "hover:text-white",
  },
  {
    id: 5,
    name: "Saúde",
    description: "Hospitais, atendimento médico e saúde mental.",
    icon: HeartPulse,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverBg: "hover:bg-blue-600",
    hoverText: "hover:text-white",
  },
  {
    id: 6,
    name: "Segurança",
    description: "Política de segurança pública e proteção da população.",
    icon: Shield,
    iconBg: "bg-slate-200",
    iconColor: "text-slate-700",
    hoverBg: "hover:bg-slate-700",
    hoverText: "hover:text-white",
  },
  {
    id: 7,
    name: "Juventude e Cultura",
    description: "Educação, esportes, artes e desenvolvimento da juventude.",
    icon: Palette,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    hoverBg: "hover:bg-pink-600",
    hoverText: "hover:text-white",
  },
  {
    id: 8,
    name: "Família",
    description: "Políticas públicas de proteção e apoio às famílias goianas.",
    icon: Users,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    hoverBg: "hover:bg-rose-600",
    hoverText: "hover:text-white",
  },
  {
    id: 9,
    name: "Governo que Serve",
    description: "Gestão pública eficiente, transparência e serviços ao cidadão.",
    icon: Landmark,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    hoverBg: "hover:bg-violet-600",
    hoverText: "hover:text-white",
  },
  {
    id: 10,
    name: "Interior e Agro",
    description: "Desenvolvimento regional, agronegócio e tecnologia agrícola.",
    icon: Tractor,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    hoverBg: "hover:bg-green-600",
    hoverText: "hover:text-white",
  },
  {
    id: 11,
    name: "Água e Saneamento",
    description: "Acesso à água, saneamento básico de qualidade e sustentabilidade hídrica para todas as regiões do estado.",
    icon: Droplets,
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
    hoverBg: "",
    hoverText: "",
    wide: true,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: topIdeas, isLoading: loadingTopIdeas } = trpc.ideas.topIdeas.useQuery();
  const { data: stats } = trpc.ideas.stats.useQuery();
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8", color: "#1e293b" }}>
      <Header />
      {/* Offset para compensar o header fixo */}
      <div className="h-[72px] md:h-[80px]" />
      <main className="flex-grow">

        {/* ── Hero Section ── */}
        <section
          className="relative pt-32 pb-32 text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/hero-marconi-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 80%',
            backgroundRepeat: 'no-repeat',
            minHeight: '90vh',
          }}
        >
          {/* Blobs animados */}
          <div
            className="absolute rounded-full opacity-60 pointer-events-none"
            style={{
              width: 384, height: 384,
              top: -80, right: -80,
              background: '#FFD700',
              filter: 'blur(80px)',
              animation: 'float 10s infinite ease-in-out alternate',
            }}
          />
          <div
            className="absolute rounded-full opacity-60 pointer-events-none"
            style={{
              width: 320, height: 320,
              bottom: 0, left: 40,
              background: '#60a5fa',
              filter: 'blur(80px)',
              animation: 'float 10s infinite ease-in-out alternate',
              animationDelay: '-5s',
            }}
          />
          {/* Overlay escuro */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,31,77,0.72)' }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
                  <span style={{ color: '#FFD700' }}>Goiás</span> Pode Mais
                </h1>
                <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light" style={{ color: '#bfdbfe' }}>
                  O Goiás do futuro começa nas ideias da juventude. Não adie para depois e deixe sua marca no plano que vai definir os próximos anos no nosso estado.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/enviar-ideia">
                    <button
                      className="flex items-center gap-2 px-8 py-3.5 rounded-md font-bold text-base transition-all"
                      style={{
                        background: '#FFD700',
                        color: '#001F4D',
                        boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
                      }}
                    >
                      Enviar Ideia <ArrowRight size={18} />
                    </button>
                  </Link>
                  {!isAuthenticated && (
                    <button
                      className="px-8 py-3.5 rounded-md font-bold text-base border border-white/40 text-white hover:bg-white/10 transition-all"
                      onClick={() => (window.location.href = getLoginUrl())}
                    >
                      Participar Agora
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes float {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(30px, -50px) scale(1.1); }
            }
          `}</style>
        </section>

        {/* ── Statistics Cards (sobrepostos ao hero) ── */}
        <section className="relative z-20 -mt-12 mb-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: String(stats?.ideasByAxis?.length ?? 11), label: 'Eixos Temáticos', yellow: false },
                { value: String(stats?.totalIdeas ?? '...'), label: 'Ideias', yellow: true },
                { value: String(stats?.totalCities ?? 246), label: 'Municípios', yellow: false },
                { value: '7M+', label: 'Goianos', yellow: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 text-center rounded-2xl"
                  style={{
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    className="text-4xl font-black mb-1"
                    style={{ color: stat.yellow ? '#FFD700' : '#001F4D' }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Ideas Section ── */}
        <section className="py-16" style={{ backgroundColor: "#e8f0fb" }}>
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-12">
              <div
                className="relative px-12 py-3 font-bold text-xl uppercase tracking-widest shadow-lg"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#001F4D",
                  clipPath: "polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)",
                }}
              >
                Ideias Mais Votadas
              </div>
            </div>

            {loadingTopIdeas ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded mb-2 w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topIdeas?.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white rounded-2xl p-6 flex flex-col transition-all"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.03)',
                    }}
                  >
                    <span
                      className="text-xs font-semibold uppercase tracking-wide mb-3 inline-block px-2 py-1 rounded"
                      style={{ backgroundColor: "#001F4D", color: "#FFD700" }}
                    >
                      {idea.axis}
                    </span>
                    <h3 className="font-bold text-gray-800 mb-2 text-sm leading-snug flex-grow">
                      {idea.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-3 leading-relaxed">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} />
                        <span>{idea.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "#001F4D" }}>
                        <ThumbsUp size={14} />
                        <span>{idea.votes_up}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-10">
              <Link href="/ideias">
                <button
                  className="font-bold uppercase tracking-wide px-10 py-3.5 rounded-md transition-all"
                  style={{ backgroundColor: "#FFD700", color: "#001F4D", boxShadow: '0 4px 15px rgba(255,215,0,0.3)' }}
                >
                  VER TODAS AS IDEIAS
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#001F4D' }}>
                Construindo Juntos o Futuro de Goiás
              </h2>
              <p className="text-gray-500">
                O movimento <strong>Goiás Pode Mais</strong> é uma iniciativa de participação cidadã que busca ouvir a população goiana para construir um plano de governo representativo.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '✏️', title: 'Envie sua Ideia', text: 'Compartilhe suas sugestões para melhorar Goiás em qualquer um dos 11 eixos temáticos.' },
                { icon: '✓', title: 'Ideias Avaliadas', text: 'Todas as ideias são analisadas pela equipe e as aprovadas ficam visíveis para todos.' },
                { icon: '🎯', title: 'Plano Colaborativo', text: 'As melhores ideias serão incorporadas ao plano de governo de Goiás.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 text-center rounded-2xl bg-gray-50 group transition-all hover:bg-white"
                  style={{ transition: 'all 0.3s cubic-bezier(0.25,0.8,0.25,1)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,31,77,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="text-4xl mb-4" style={{ color: '#FFD700' }}>{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#001F4D' }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Axes Section ── */}
        <section id="eixos" className="py-20" style={{ backgroundColor: '#F3F6F8' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#001F4D' }}>
                11 Eixos Temáticos
              </h2>
              <p className="text-gray-500">Escolha a área que mais importa para você e envie suas sugestões.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {axes.map((axis) => {
                const Icon = axis.icon;
                if (axis.wide) {
                  return (
                    <Link
                      key={axis.id}
                      href={`/ideias?eixo=${encodeURIComponent(axis.name)}`}
                      className="md:col-span-2 lg:col-span-2 flex items-center gap-4 p-6 rounded-2xl transition-all"
                      style={{
                        background: 'linear-gradient(to right, #ecfeff, #eff6ff)',
                        border: '1px solid #a5f3fc',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 leading-tight" style={{ color: '#001F4D' }}>{axis.name}</h3>
                        <p className="text-sm text-gray-600 leading-snug">{axis.description}</p>
                      </div>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={axis.id}
                    href={`/ideias?eixo=${encodeURIComponent(axis.name)}`}
                    className="flex items-center gap-4 p-6 rounded-2xl group transition-all"
                    style={{
                      background: '#fff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,31,77,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)')}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-colors ${axis.iconBg} ${axis.iconColor} group-${axis.hoverBg} group-${axis.hoverText}`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 leading-tight" style={{ color: '#001F4D' }}>{axis.name}</h3>
                      <p className="text-xs text-gray-500 leading-snug">{axis.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-20 text-white text-center" style={{ backgroundColor: '#001F4D' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua Voz Constrói o Futuro</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Não fique de fora. Participe agora e ajude a construir um Goiás melhor para todos.
            </p>
            {isAuthenticated ? (
              <Link href="/enviar-ideia">
                <button
                  className="px-8 py-3.5 rounded-md font-bold text-base transition-all"
                  style={{ background: '#FFD700', color: '#001F4D', boxShadow: '0 4px 15px rgba(255,215,0,0.3)' }}
                >
                  Enviar Sua Ideia
                </button>
              </Link>
            ) : (
              <button
                className="px-8 py-3.5 rounded-md font-bold text-base transition-all"
                style={{ background: '#FFD700', color: '#001F4D', boxShadow: '0 4px 15px rgba(255,215,0,0.3)' }}
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Enviar Sua Ideia
              </button>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
