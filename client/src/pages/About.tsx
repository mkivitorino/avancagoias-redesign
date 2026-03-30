import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </a>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Goiás tem voz.
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            E ela começa aqui.
          </h1>

          {/* Content Sections */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Tem coisa que só quem vive sabe.
              </h2>
              <p>
                Só quem acorda cedo e enfrenta a BR sabe o que falta naquela estrada. Só quem espera três meses por uma consulta sabe onde a saúde falha. Só quem planta sabe o que a seca leva embora. Só quem abre um negócio no interior sabe o peso da burocracia que ninguém em Goiânia enxerga.
              </p>
            </div>

            <p>
              Goiás é um estado gigante. Mas muitas vezes quem decide o futuro dele nunca pisou no chão de quem vive as consequências.
            </p>

            <p className="font-bold">
              Isso precisa mudar. E muda agora.
            </p>

            <p>
              O Goiás Pode Mais é uma plataforma para inverter a lógica. Aqui, o plano de governo não nasce num gabinete — nasce da sua experiência, da sua rua, do seu município. Você traz a ideia. Outros goianos votam. E o que a maioria aponta como prioridade vira compromisso de verdade.
            </p>

            <p>
              Saúde, educação, segurança, emprego, estradas, água, tecnologia — o tema é você quem escolhe. A pauta é sua.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Por que agora?
              </h2>
              <p>
                Porque Goiás não pode esperar mais uma eleição em que as propostas chegam prontas e o povo só assiste. Marconi Perillo governou este estado quatro vezes. Criou programas que o Brasil inteiro copiou. Mas aprendeu a lição mais importante de todas: quem sabe o que Goiás precisa é quem vive Goiás.
              </p>
            </div>

            <p>
              Por isso ele está na estrada, ouvindo. E por isso esta plataforma existe — para que a sua voz chegue antes das promessas.
            </p>

            <p className="font-bold">
              Participe. Envie sua ideia. Vote nas que você acredita. Porque o futuro de Goiás não pode ser escrito por poucos.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-bold text-primary mb-3">
                Esta plataforma foi criada para ouvir você
              </h3>
              <p>
                Para coletar suas ideias, seus sonhos, suas soluções para os desafios de Goiás. Participe. Envie sua ideia. Vote nas ideias que você acredita. Porque o futuro de Goiás é construído por quem vive aqui.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Link href="/enviar-ideia">
              <a className="inline-block px-6 py-3 bg-secondary text-primary font-bold rounded hover:bg-secondary/90 transition-colors text-center">
                Enviar uma Ideia
              </a>
            </Link>
            <Link href="/ideias">
              <a className="inline-block px-6 py-3 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-colors text-center">
                Ver Ideias
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
