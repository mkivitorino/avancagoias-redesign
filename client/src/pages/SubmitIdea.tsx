import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface FormData {
  title: string;
  description: string;
  axis: string;
  name: string;
  email: string;
}

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

export default function SubmitIdea() {
  const { user, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    axis: "Educação",
    name: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-preencher dados do usuário logado
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user, isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio (em produção, seria uma chamada tRPC)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Ideia enviada:", formData);

      // Sucesso
      toast.success("Sua ideia foi enviada com sucesso! Obrigado pela participação.");

      // Resetar formulário
      setFormData({
        title: "",
        description: "",
        axis: "Educação",
        name: "",
        email: "",
      });
    } catch (error) {
      toast.error("Erro ao enviar ideia. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirecionar para login se não autenticado
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-primary mb-4">Acesso Restrito</h1>
            <p className="text-gray-600 mb-6">
              Para enviar uma ideia, você precisa estar logado. Faça login ou cadastre-se para continuar.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Fazer Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Envie Sua Ideia</h1>
            <p className="text-lg text-gray-100">
              Compartilhe suas sugestões para melhorar Goiás. Sua ideia pode fazer
              a diferença!
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                  Título da Ideia *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Descreva sua ideia em poucas palavras"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-yellow-400"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 caracteres
                </p>
              </div>

              {/* Eixo Temático */}
              <div>
                <label htmlFor="axis" className="block text-sm font-bold text-primary mb-2">
                  Eixo Temático *
                </label>
                <select
                  id="axis"
                  name="axis"
                  value={formData.axis}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-yellow-400"
                >
                  {axes.map((axis) => (
                    <option key={axis} value={axis}>
                      {axis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-primary mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explique sua ideia com mais detalhes. Como ela melhoraria Goiás?"
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-yellow-400 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 caracteres
                </p>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-primary mb-4">Seus Dados</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Seus dados de cadastro foram pré-preenchidos automaticamente. Você pode editá-los se necessário.
                </p>
              </div>

              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-primary mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-2">
                  Seu Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="font-bold flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Ideia"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="font-bold flex-1"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      axis: "Educação",
                      name: "",
                      email: "",
                    });
                  }}
                >
                  Limpar
                </Button>
              </div>

              <p className="text-xs text-gray-600 text-center">
                * Campos obrigatórios. Seus dados serão utilizados apenas para
                contato sobre sua ideia.
              </p>
            </form>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Como Funciona?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-primary">Envie sua ideia</h3>
                  <p className="text-gray-600">
                    Preencha o formulário com sua sugestão e dados de contato.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-primary">Análise</h3>
                  <p className="text-gray-600">
                    Nossa equipe analisa todas as ideias recebidas.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-primary">Publicação</h3>
                  <p className="text-gray-600">
                    Ideias aprovadas são publicadas para votação da comunidade.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-primary">Incorporação</h3>
                  <p className="text-gray-600">
                    As melhores ideias são incorporadas ao plano de governo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
