import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Send, FileText, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="text-white shadow-md fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "#001F4D" }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031401995/NGK4EhxCxiMqVsLqFwBT8y/Ativo21CORES_7f50b237.png"
              alt="Goiás Pode Mais"
              className="h-12 md:h-14 w-auto"
            />
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/"><a className="hover:text-secondary transition-colors">Início</a></Link>
          <Link href="/sobre"><a className="hover:text-secondary transition-colors">Sobre</a></Link>
          <Link href="/ideias"><a className="hover:text-secondary transition-colors">Ideias</a></Link>
          <Link href="/estatisticas"><a className="hover:text-secondary transition-colors">Estatísticas</a></Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{user?.name?.split(" ")[0]}</span>
                <ChevronDown size={14} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden"
                  style={{ background: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/enviar-ideia">
                      <a
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Send size={16} className="text-gray-400" />
                        Nova Ideia
                      </a>
                    </Link>
                    <Link href="/minhas-ideias">
                      <a
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FileText size={16} className="text-gray-400" />
                        Minhas Ideias
                      </a>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <a>
                <Button variant="secondary" size="sm">Entrar</Button>
              </a>
            </Link>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20" style={{ backgroundColor: "#001F4D" }}>
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/"><a className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Início</a></Link>
            <Link href="/sobre"><a className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Sobre</a></Link>
            <Link href="/ideias"><a className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Ideias</a></Link>
            <Link href="/estatisticas"><a className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Estatísticas</a></Link>
            <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/enviar-ideia">
                    <a className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">Nova Ideia</Button>
                    </a>
                  </Link>
                  <Link href="/minhas-ideias">
                    <a className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Minhas Ideias</Button>
                    </a>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full text-red-400 border-red-400/40" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Sair
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <a className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">Entrar</Button>
                  </a>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
