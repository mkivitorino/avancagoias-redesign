import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const axes = [
    {
      id: 1,
      name: "Desenvolvimento Econômico",
      description: "Visão estratégica para crescimento econômico",
      color: "bg-orange-600",
    },
    {
      id: 2,
      name: "Infraestrutura",
      description: "Estradas, pontes, obras estruturantes e mobilidade",
      color: "bg-blue-900",
    },
    {
      id: 3,
      name: "Emprego e Renda",
      description: "Geração de empregos, qualificação profissional",
      color: "bg-orange-500",
    },
    {
      id: 4,
      name: "Educação",
      description: "Escolas, valorização do professor e qualidade do ensino",
      color: "bg-blue-600",
    },
    {
      id: 5,
      name: "Saúde",
      description: "Hospitais, atendimento médico e saúde mental",
      color: "bg-blue-700",
    },
    {
      id: 6,
      name: "Segurança",
      description: "Política de segurança pública e proteção da população",
      color: "bg-blue-800",
    },
    {
      id: 7,
      name: "Juventude",
      description: "Educação superior, esportes e desenvolvimento",
      color: "bg-yellow-500",
    },
    {
      id: 8,
      name: "Cultura e Lazer",
      description: "Economia criativa, artes e entretenimento",
      color: "bg-yellow-600",
    },
    {
      id: 9,
      name: "Agricultura",
      description: "Desenvolvimento rural e apoio ao agronegócio",
      color: "bg-green-600",
    },
    {
      id: 10,
      name: "Interior e Agro",
      description: "Desenvolvimento regional e tecnologia agrícola",
      color: "bg-green-700",
    },
    {
      id: 11,
      name: "Meio Ambiente",
      description: "Sustentabilidade, energia limpa e conservação",
      color: "bg-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary to-primary/80 text-white py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="text-secondary">Goiás</span> Pode Mais
                </h1>
                <p className="text-lg text-gray-100 mb-8 leading-relaxed">
                  Participe da construção do futuro de Goiás. Envie suas ideias
                  e contribua para um plano de governo que representa a voz de
                  todos os goianos.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/enviar-ideia">
                    <Button variant="secondary" size="lg" className="font-bold">
                      Enviar Ideia
                      <ArrowRight size={20} />
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="font-bold"
                      onClick={() => (window.location.href = getLoginUrl())}
                    >
                      Participar Agora
                    </Button>
                  )}
                </div>
              </div>

              {/* Right - Image Placeholder */}
              <div className="relative h-96 bg-white/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/60">Imagem do Marconi</p>
                  <p className="text-white/40 text-sm mt-2">
                    (Será adicionada aqui)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32"></div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">11</div>
                <p className="text-gray-600">Eixos Temáticos</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">111</div>
                <p className="text-gray-600">Ideias</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">246</div>
                <p className="text-gray-600">Municípios</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-secondary mb-2">7M+</div>
                <p className="text-gray-600">Goianos</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">
              Construindo Juntos o Futuro de Goiás
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                O movimento <strong>Goiás Pode Mais</strong> é uma iniciativa de
                participação cidadã que busca ouvir a população goiana para
                construir um plano de governo verdadeiramente representativo. Sua
                voz importa.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4 text-secondary">✏️</div>
                  <h3 className="font-bold text-primary mb-2">Envie sua Ideia</h3>
                  <p className="text-gray-600 text-sm">
                    Compartilhe suas sugestões para melhorar Goiás em qualquer
                    um dos 11 eixos temáticos.
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4 text-secondary">✓</div>
                  <h3 className="font-bold text-primary mb-2">Ideias Avaliadas</h3>
                  <p className="text-gray-600 text-sm">
                    Todas as ideias são analisadas pela equipe e as aprovadas
                    ficam visíveis para todos.
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4 text-secondary">🎯</div>
                  <h3 className="font-bold text-primary mb-2">Plano Colaborativo</h3>
                  <p className="text-gray-600 text-sm">
                    As melhores ideias serão incorporadas ao plano de governo
                    de Goiás.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Axes Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-primary">
              11 Eixos Temáticos
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Escolha a área que mais importa para você e envie suas sugestões
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {axes.map((axis) => (
                <Link key={axis.id} href={`/ideias`} className="block">
                  <div
                    className={`${axis.color} text-white p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer`}
                  >
                    <h3 className="font-bold text-lg mb-2">{axis.name}</h3>
                    <p className="text-sm opacity-90">{axis.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Sua Voz Constrói o Futuro
            </h2>
            <p className="text-lg mb-8 text-gray-100 max-w-2xl mx-auto">
              Não fique de fora. Participe agora e ajude a construir um Goiás
              melhor para todos.
            </p>
            {isAuthenticated ? (
              <Button variant="secondary" size="lg" className="font-bold">
                Enviar Sua Ideia
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="font-bold"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Cadastrar e Participar
              </Button>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Fique Atualizado
              </h3>
              <p className="text-gray-600 mb-6">
                Cadastre-se para receber nossa newsletter e acompanhar as
                novidades do Goiás Pode Mais.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="secondary" className="font-bold">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
