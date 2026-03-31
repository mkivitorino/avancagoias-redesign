import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="text-white shadow-md fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "#001F4D" }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031401995/NGK4EhxCxiMqVsLqFwBT8y/Ativo21CORES_7f50b237.png"
              alt="Goiás Pode Mais"
              className="h-12 md:h-14 w-auto"
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <a className="hover:text-secondary transition-colors">Início</a>
          </Link>
          <Link href="/sobre">
            <a className="hover:text-secondary transition-colors">Sobre</a>
          </Link>
          <Link href="/ideias">
            <a className="hover:text-secondary transition-colors">Ideias</a>
          </Link>
          <Link href="/estatisticas">
            <a className="hover:text-secondary transition-colors">Estatísticas</a>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/enviar-ideia">
                <a>
                  <Button variant="secondary" size="sm">
                    Enviar Ideia
                  </Button>
                </a>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Entrar
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20" style={{ backgroundColor: "#001F4D" }}>
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/">
              <a
                className="hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </a>
            </Link>
            <Link href="/sobre">
              <a
                className="hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </a>
            </Link>
            <Link href="/ideias">
              <a
                className="hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ideias
              </a>
            </Link>
            <Link href="/estatisticas">
              <a
                className="hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Estatísticas
              </a>
            </Link>
            <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/enviar-ideia">
                    <a className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Enviar Ideia
                      </Button>
                    </a>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    window.location.href = getLoginUrl();
                    setMobileMenuOpen(false);
                  }}
                >
                  Entrar
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
