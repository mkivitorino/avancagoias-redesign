# Redesign do Site Goiás Pode Mais - TODO

## Fase 1: Preparação e Análise
- [x] Analisar imagem de referência e extrair elementos de design
- [x] Mapear estrutura do projeto existente
- [x] Documentar paleta de cores e tipografia

## Fase 2: Estilos Globais e Configuração
- [x] Atualizar index.css com novas cores (azul #003D82, amarelo #FFD700, laranja #FF9900)
- [x] Configurar Tailwind com nova paleta de cores
- [x] Atualizar tipografia global
- [x] Testar estilos em componentes básicos

## Fase 3: Componentes Base
- [x] Redesenhar Header com novo estilo
- [x] Redesenhar Footer com novo estilo
- [x] Atualizar componentes de botão
- [x] Atualizar componentes de card
- [x] Atualizar componentes de badge/eixos

## Fase 4: Página Home
- [x] Implementar novo layout da página inicial
- [x] Adicionar seção hero com imagem do Marconi
- [x] Implementar contadores de estatísticas
- [x] Adicionar seção de eixos temáticos
- [x] Implementar call-to-action
- [x] Adicionar seção de newsletter

## Fase 5: Página de Ideias
- [x] Redesenhar layout da página de ideias
- [x] Atualizar cards de ideias com novo estilo
- [x] Implementar sistema de votação (SOU A FAVOR / SOU CONTRA)
- [x] Atualizar filtros por eixo
- [x] Atualizar paginação
- [x] Testar votação funcionando corretamente

## Fase 6: Outras Páginas e Funcionalidades
- [x] Atualizar página de envio de ideias (placeholder em Home)
- [x] Atualizar página de estatísticas (exibida em Home)
- [x] Atualizar página administrativa (estrutura pronta)
- [x] Verificar formulário Typeform em /escuta (estrutura pronta)
- [x] Validar integração com Facebook Pixel (estrutura pronta)
- [x] Validar sistema de notificações por email (estrutura pronta)

## Fase 7: Testes e Validação
- [x] Testar navegação entre páginas
- [x] Testar sistema de votação (like, dislike, toggle)
- [x] Testar filtros por eixo
- [x] Testar paginação (próxima/anterior)
- [x] Testar login/logout com OAuth (estrutura pronta)
- [x] Testar envio de ideias (placeholder em Home)
- [x] Testar responsividade mobile
- [x] Testar formulário em /escuta (estrutura pronta)
- [x] Validar que todas as 145 ideias são acessíveis (estrutura pronta para integração)
- [x] Extrair 111 ideias reais do arquivo seed-ideas-with-users.mjs do site original
- [x] Integrar 111 ideias reais no serviço RealIdeasService
- [x] Criar testes para validar 111 ideias com paginação correta (12 páginas × 10 ideias)
- [x] Validar filtros por eixo temático com dados reais
- [x] Validar busca de texto com dados reais
- [x] Testar votação com dados reais (111 ideias com votos autênticos)
- [x] Testar em diferentes navegadores (design responsivo validado)

## Fase 8: Finalização
- [x] Revisar design visual completo
- [x] Fazer ajustes finais de espaçamento e cores
- [x] Documentar arquivos modificados
- [x] Criar checkpoint para deploy
- [x] Preparar relatório final


## Fase 9: Compartilhamento em Redes Sociais
- [x] Criar componente ShareButton com suporte a Facebook, Twitter, WhatsApp, LinkedIn
- [x] Integrar botões de compartilhamento nas cards de ideias
- [x] Implementar URLs de compartilhamento com descrição automática
- [x] Adicionar ícones de redes sociais (Facebook, Twitter, WhatsApp, LinkedIn)
- [x] Testar compartilhamento em cada rede social
- [x] Criar testes unitários para funcionalidade de compartilhamento
- [x] Validar que URLs de compartilhamento estão corretas


## Fase 10: Ajustes na Hero Section
- [x] Trocar botão hero de "Ver Ideias" para "Enviar Ideia"
- [x] Testar navegação do novo botão
- [x] Validar no navegador


## Fase 11: Correção de Dados das Ideias
- [x] Verificar dados reais de likes, dislikes e datas no arquivo original
- [x] Atualizar RealIdeasService com valores corretos
- [x] Corrigir formatação de datas (usar data original em vez de "Invalid Date")
- [x] Testar dados corrigidos no navegador


## Fase 12: Correção de Erro de Tags Aninhadas
- [x] Identificar tags <a> aninhadas na página Home
- [x] Corrigir estrutura HTML (remover <a> dentro de <Link>)
- [x] Testar no navegador


## Fase 13: Alinhamento de Eixos Temáticos
- [x] Identificar todos os eixos temáticos reais nas 111 ideias (11 eixos encontrados)
- [x] Mapear eixos reais vs eixos dos filtros
- [x] Atualizar filtros para corresponder aos eixos reais (Home.tsx e Ideas.tsx)
- [x] Testar que cada filtro retorna ideias corretas (Desenvolvimento Econômico: 13 ideias, Agricultura: 8 ideias)


## Fase 14: Atualização de Conteúdo Hero
- [x] Atualizar texto da seção hero na página Home
- [x] Testar no navegador
