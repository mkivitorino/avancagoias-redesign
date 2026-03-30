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
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity">
            <span className="text-secondary">Goiás</span>
            <span>Pode Mais</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <a className="hover:text-secondary transition-colors">Início</a>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="secondary" size="sm">
                Enviar Ideia
              </Button>
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
        <div className="md:hidden bg-primary border-t border-secondary/20">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/">
              <a
                className="hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </a>
            </Link>
            <div className="border-t border-secondary/20 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="secondary" size="sm" className="w-full">
                    Enviar Ideia
                  </Button>
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
