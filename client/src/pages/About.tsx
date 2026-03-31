import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Megaphone,
  Send,
  List,
  Globe,
} from "lucide-react";

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3F6F8", color: "#1e293b" }}>
      <Header />
      <div className="h-[72px] md:h-[80px]" />

      <main className="pt-12 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* ── Voltar ── */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold transition-colors mb-8 px-4 py-2 rounded-full border border-gray-200 shadow-sm w-fit"
            style={{ color: '#001F4D', background: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={16} /> Voltar para o Início
          </Link>

          {/* ── Título ── */}
          <div className="mb-12">
            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
              style={{ color: '#001F4D' }}
            >
              Goiás tem voz.<br />
              <span
                className="inline-block mt-2 px-4 py-1 rounded-xl shadow-md"
                style={{
                  color: '#FFD700',
                  background: '#001F4D',
                  transform: 'rotate(-1deg)',
                  display: 'inline-block',
                }}
              >
                E ela começa aqui.
              </span>
            </h1>
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 — destaque azul, largura total */}
            <div
              className="md:col-span-2 p-8 md:p-10 rounded-2xl text-white relative overflow-hidden"
              style={{
                background: '#001F4D',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <span
                className="absolute top-[-20px] right-[10px] text-white pointer-events-none select-none"
                style={{ fontSize: '8rem', opacity: 0.05, fontFamily: 'serif' }}
              >"</span>
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-3"
                style={{ color: '#FFD700' }}
              >
                <Globe size={22} className="opacity-80" /> Tem coisa que só quem vive sabe.
              </h2>
              <p className="text-lg leading-relaxed font-light" style={{ color: '#bfdbfe' }}>
                Só quem acorda cedo e enfrenta a BR sabe o que falta naquela estrada. Só quem espera três meses por uma consulta sabe onde a saúde falha. Só quem planta sabe o que a seca leva embora. Só quem abre um negócio no interior sabe o peso da burocracia que ninguém em Goiânia enxerga.
              </p>
            </div>

            {/* Card 2 — mapa */}
            <div
              className="p-8 rounded-2xl flex flex-col justify-center"
              style={{
                background: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: '#eff6ff', color: '#001F4D' }}
              >
                <MapPin size={22} />
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Goiás é um estado gigante. Mas muitas vezes quem decide o futuro dele nunca pisou no chão de quem vive as consequências.
              </p>
              <p className="font-bold text-xl mt-auto" style={{ color: '#001F4D' }}>
                Isso precisa mudar. E muda agora.
              </p>
            </div>

            {/* Card 3 — plataforma, borda amarela */}
            <div
              className="p-8 rounded-2xl flex flex-col justify-center"
              style={{
                background: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.03)',
                borderBottom: '4px solid #FFD700',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: '#fff7ed', color: '#f97316' }}
              >
                <MessageCircle size={22} />
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                O <strong>Goiás Pode Mais</strong> é uma plataforma para inverter a lógica. Aqui, o plano de governo não nasce num gabinete — nasce da sua experiência, da sua rua, do seu município.
              </p>
              <p className="text-gray-600 leading-relaxed mt-auto">
                Você traz a ideia. Outros goianos votam. E o que a maioria aponta como prioridade vira compromisso de verdade. Saúde, educação, segurança, emprego...{" "}
                <strong style={{ color: '#001F4D' }}>o tema é você quem escolhe. A pauta é sua.</strong>
              </p>
            </div>

            {/* Card 4 — Por que agora, largura total */}
            <div
              className="md:col-span-2 p-8 md:p-10 rounded-2xl"
              style={{
                background: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #f3f4f6',
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
                  style={{ background: '#FFD700', color: '#001F4D' }}
                >
                  ?
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#001F4D' }}>Por que agora?</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Porque Goiás não pode esperar mais uma eleição em que as propostas chegam prontas e o povo só assiste. Marconi Perillo governou este estado quatro vezes. Criou programas que o Brasil inteiro copiou. Mas aprendeu a lição mais importante de todas:{" "}
                <strong>quem sabe o que Goiás precisa é quem vive Goiás.</strong>
              </p>
              <div
                className="p-6 rounded-xl"
                style={{ background: '#f9fafb', borderLeft: '4px solid #001F4D' }}
              >
                <p className="font-medium text-lg italic" style={{ color: '#001F4D' }}>
                  "Por isso ele está na estrada, ouvindo. E por isso esta plataforma existe — para que a sua voz chegue antes das promessas."
                </p>
              </div>
            </div>

          </div>

          {/* ── CTA interno ── */}
          <div
            className="mt-12 p-10 md:p-14 rounded-3xl text-center"
            style={{
              background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
              border: '1px solid #bfdbfe',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm mx-auto mb-4"
              style={{ background: '#fff', color: '#001F4D' }}
            >
              <Megaphone size={28} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#001F4D' }}>
              Esta plataforma foi criada para ouvir você
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Para coletar suas ideias, seus sonhos, suas soluções para os desafios de Goiás. Participe. Envie sua ideia. Vote nas ideias que você acredita. Porque o futuro de Goiás é construído por quem vive aqui.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/enviar-ideia">
                <button
                  className="px-8 py-4 rounded-md font-bold text-base flex items-center justify-center gap-2 transition-all"
                  style={{ background: '#FFD700', color: '#001F4D', boxShadow: '0 4px 15px rgba(255,215,0,0.3)' }}
                >
                  <Send size={18} /> Enviar uma Ideia
                </button>
              </Link>
              <Link href="/ideias">
                <button
                  className="px-8 py-4 rounded-md font-bold text-base flex items-center justify-center gap-2 transition-all"
                  style={{ background: '#001F4D', color: '#fff', boxShadow: '0 4px 15px rgba(0,31,77,0.2)' }}
                >
                  <List size={18} /> Ver Ideias
                </button>
              </Link>
            </div>
          </div>

        </div>
      </main>

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

      {/* ── Newsletter ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="max-w-3xl mx-auto p-10 rounded-2xl text-left"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#001F4D' }}>Fique Atualizado</h3>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              Cadastre-se para receber nossa newsletter e acompanhar as novidades do Goiás Pode Mais.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="flex-grow px-5 py-3 rounded-md border border-gray-300 focus:outline-none text-gray-700"
              />
              <button
                className="px-8 py-3 rounded-md font-bold transition-all"
                style={{ background: '#FFD700', color: '#001F4D', boxShadow: '0 4px 15px rgba(255,215,0,0.3)' }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
