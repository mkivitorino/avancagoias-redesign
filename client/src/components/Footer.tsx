import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Logo and Description */}
          <div>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031401995/NGK4EhxCxiMqVsLqFwBT8y/Ativo21CORES_7f50b237.png"
              alt="Goiás Pode Mais"
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm text-gray-200">
              Plataforma de participação cidadã para construção colaborativa do
              plano de governo de Goiás.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-secondary transition-colors">
                    Início
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/ideias">
                  <a className="hover:text-secondary transition-colors">
                    Ideias Aprovadas
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/enviar-ideia">
                  <a className="hover:text-secondary transition-colors">
                    Enviar Ideia
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <p className="text-sm text-gray-200 mb-4">
              Dúvidas ou sugestões? Entre em contato conosco.
            </p>
            <a
              href="mailto:contato@avancagoias.com.br"
              className="text-secondary hover:text-white transition-colors text-sm"
            >
              contato@avancagoias.com.br
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary/20 pt-8">
          <p className="text-center text-sm text-gray-300">
            &copy; {currentYear} Goiás Pode Mais. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
