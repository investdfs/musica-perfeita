
# Documentação Completa do Sistema de Músicas Personalizadas

## Visão Geral

Este documento contém informações detalhadas sobre o sistema de músicas personalizadas, incluindo sua arquitetura, funcionalidades, banco de dados, fluxos de trabalho e implementações técnicas. Este documento serve como referência completa para desenvolvedores e IAs que precisem trabalhar neste sistema.

## Estrutura do Sistema

### Arquitetura Geral

O sistema é uma aplicação web React com backend Supabase, utilizando a seguinte stack tecnológica:
- Frontend: React com TypeScript
- Gerenciamento de Estado: React Context e Hooks personalizados
- Roteamento: React Router
- UI/Estilo: Tailwind CSS e shadcn/ui
- Backend: Supabase (PostgreSQL, Authentication, Storage)
- Integração de Pagamentos: Em desenvolvimento (planejado)

### Estrutura de Diretórios

```
src/
├── components/      # Componentes reutilizáveis
│   ├── admin/       # Componentes específicos do admin
│   ├── dashboard/   # Componentes do dashboard do cliente
│   ├── music/       # Componentes relacionados à música
│   └── ui/          # Componentes de UI genéricos
├── hooks/           # React hooks personalizados
├── integrations/    # Integrações com serviços externos
│   └── supabase/    # Cliente e tipos do Supabase
├── lib/             # Funções utilitárias
├── pages/           # Componentes de página
├── types/           # Definições de tipos TypeScript
└── docs/            # Documentação do sistema
```

## Banco de Dados

### Tabelas Principais

#### user_profiles
Armazena informações dos usuários registrados.

```sql
- id: uuid (PK)
- created_at: timestamp
- name: string
- email: string
- whatsapp: string
- password: string
- is_admin: boolean (default: false)
- is_main_admin: boolean (default: false)
```

#### music_requests
Armazena os pedidos de música personalizados.

```sql
- id: uuid (PK)
- created_at: timestamp
- user_id: uuid (FK para user_profiles)
- honoree_name: string
- relationship_type: enum
- custom_relationship: string (opcional)
- music_genre: enum
- music_tone: enum (opcional)
- voice_type: enum (opcional)
- include_names: boolean
- names_to_include: string (opcional)
- story: text
- status: enum ('pending', 'in_production', 'completed')
- preview_url: string (opcional)
- full_song_url: string (opcional)
- payment_status: enum ('pending', 'completed', null)
- cover_image_url: string (opcional)
- soundcloud_id: string (opcional)
- music_focus: string (opcional)
- happy_memory: string (opcional)
- sad_memory: string (opcional)
- technical_details: text (opcional)
- has_technical_details: boolean (default: false)
```

#### music_catalog
Catálogo de músicas para exibição na página "Nossas Músicas".

```sql
- id: uuid (PK)
- created_at: timestamp
- title: string
- artist: string
- genre: string (opcional)
- audiourl: string
- coverurl: string
- duration: integer
- plays: integer (default: 0)
```

#### site_stats
Estatísticas do site.

```sql
- id: uuid (PK)
- visitor_count: integer (default: 0)
- updated_at: timestamp
- created_at: timestamp
```

## Fluxos Principais

### Registro e Login de Usuários

1. O usuário acessa a página de cadastro (/cadastro)
2. Fornece nome, email, whatsapp e senha
3. Os dados são validados e armazenados na tabela user_profiles
4. O usuário é redirecionado para o dashboard

O login segue um fluxo similar, verificando as credenciais contra a tabela user_profiles.

### Solicitação de Música Personalizada

1. Usuário logado acessa o dashboard (/dashboard)
2. Preenche o formulário de solicitação com detalhes do homenageado, gênero musical, tom, história, etc.
3. Envia o formulário, que cria um registro na tabela music_requests com status 'pending'
4. O administrador recebe a solicitação no painel admin

### Fluxo de Produção da Música (Admin)

1. Admin acessa o painel (/admin)
2. Visualiza os pedidos pendentes
3. Muda o status para 'in_production' quando inicia o trabalho
4. Quando a música está pronta, faz upload da prévia ou link do SoundCloud
5. Adiciona detalhes técnicos da música (informações de composição)
6. Muda o status para 'completed'
7. O cliente é notificado e pode ouvir a prévia (limitada a 40 segundos)

### Fluxo de Pagamento (Cliente)

1. Cliente visualiza a prévia da música no dashboard
2. Clica no botão para acessar a versão completa
3. É redirecionado para a página de pagamento (/pagamento)
4. Após pagamento bem-sucedido, o payment_status muda para 'completed'
5. Cliente ganha acesso à música completa para download

## Componentes Principais

### MusicPreviewPlayer

Componente responsável por reproduzir prévias de músicas. Características:
- Suporta links diretos de arquivos de áudio e SoundCloud
- Limita a reprodução a 40 segundos para prévias
- Controle de volume e progresso
- Diferentes modos de exibição para diferentes contextos

### RequestRow

Componente que exibe uma linha na tabela de pedidos administrativos. Funcionalidades:
- Upload de arquivos de música
- Botão para adicionar detalhes técnicos
- Controle de status do pedido
- Envio de links para músicas

### ScrollToTopButton

Botão que aparece quando o usuário rola a página para baixo, permitindo retornar rapidamente ao topo.

### TechnicalDetailsViewer/TechnicalDetailsPopup

Componentes para exibir e editar detalhes técnicos das músicas.

## Funcionalidades de Administração

### Gestão de Pedidos

- Listagem de todos os pedidos com filtragem e ordenação
- Visualização detalhada de cada pedido
- Atualização de status (pendente, em produção, concluído)
- Marcação de pagamento (pendente, concluído)
- Upload de músicas ou adição de links externos
- Envio de emails para entrega de músicas
- Adição de detalhes técnicos de composição

## Segurança e Boas Práticas

### Autenticação

O sistema implementa autenticação personalizada com:
- Senhas criptografadas
- Verificação de sessão em rotas protegidas
- Diferentes níveis de acesso (usuário comum, admin, admin principal)

### Validação de Dados

- Validação no cliente usando bibliotecas de validação
- Validação no servidor através de regras no Supabase
- Tratamento adequado de erros para evitar vulnerabilidades

### Otimização de Performance

- Lazy loading de componentes para carregamento mais rápido
- Uso de React.memo e hooks de memoização para prevenir renderizações desnecessárias
- Carregamento assíncrono de recursos externos

## Lista de Funcionalidades Para Desenvolvimento Futuro

- Integração completa de pagamentos (Stripe, PayPal, etc.)
- Sistema de notificações por email e WhatsApp
- Painel de análises para administradores
- Sistema de avaliação de músicas pelos clientes
- Suporte a vários idiomas

## Notas Técnicas

### Limitador de Tempo no Player

O player de música implementa uma limitação de tempo de 40 segundos para prévias. Isso é feito através de:
1. Monitoramento do evento timeupdate do elemento de áudio
2. Verificação se o tempo atual ultrapassou o limite
3. Pausa automática quando o limite é atingido
4. Marcador visual na barra de progresso indicando o limite

### Detalhes Técnicos de Música

O sistema permite que administradores adicionem detalhes técnicos sobre cada música, como:
- Informações de composição
- BPM
- Escalas musicais
- Instrumentos utilizados
- Características vocais
- Informações sobre produção

Estes detalhes são armazenados no campo technical_details e têm visibilidade controlada pelo campo has_technical_details.

### Atualizações em Tempo Real

O sistema utiliza as capacidades de subscription do Supabase para atualizar automaticamente os dados quando há mudanças, especialmente útil no painel administrativo e no dashboard do cliente.

## Problemas Conhecidos e Soluções

### Reprodução de Áudio

Alguns navegadores têm restrições para reprodução automática de áudio. A solução implementada é:
- Sempre iniciar a reprodução por interação do usuário
- Utilizar tratamento de erros adequado com mensagens informativas
- Fornecer controles de áudio claros e acessíveis

### Sincronização de Dados

Em alguns casos, atualizações no banco de dados podem não refletir imediatamente na interface. Para mitigar:
- Implementamos polling periódico como fallback
- Adicionamos mecanismos de verificação de consistência
- Incluímos funções de atualização forçada

## Apêndice

### Tipos e Enumerações

```typescript
// Alguns tipos principais do sistema
export type UserProfile = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  is_admin?: boolean;
  is_main_admin?: boolean;
};

export type MusicRequest = {
  id: string;
  created_at: string;
  user_id: string;
  honoree_name: string;
  relationship_type: 'esposa' | 'noiva' | 'namorada' | 'amigo_especial' | 'partner' | 'friend' | 'family' | 'colleague' | 'mentor' | 'child' | 'sibling' | 'parent' | 'other';
  custom_relationship: string | null;
  music_genre: 'romantic' | 'mpb' | 'classical' | 'jazz' | 'hiphop' | 'rock' | 'country' | 'reggae' | 'electronic' | 'samba' | 'folk' | 'pop';
  music_tone?: 'happy' | 'romantic' | 'nostalgic' | 'fun' | 'melancholic' | 'energetic' | 'peaceful' | 'inspirational' | 'dramatic' | 'uplifting' | 'reflective' | 'mysterious';
  voice_type?: 'male' | 'female' | 'male_romantic' | 'female_romantic' | 'male_folk' | 'female_folk' | 'male_deep' | 'female_powerful' | 'male_soft' | 'female_sweet' | 'male_jazzy' | 'female_jazzy' | 'male_rock' | 'female_rock' | 'male_country' | 'female_country';
  include_names: boolean;
  names_to_include: string | null;
  story: string;
  status: 'pending' | 'in_production' | 'completed';
  preview_url: string | null;
  full_song_url: string | null;
  payment_status: 'pending' | 'completed' | null;
  cover_image_url?: string | null;
  soundcloud_id?: string | null; 
  music_focus?: string | null;
  happy_memory?: string | null;
  sad_memory?: string | null;
  technical_details?: string | null;
  has_technical_details?: boolean;
};
```

### Guia de Troubleshooting

#### Problemas de Autenticação
- Verificar se as credenciais estão corretas
- Verificar a conexão com o banco de dados
- Limpar o armazenamento local do navegador

#### Problemas com Áudio
- Verificar a URL do arquivo de áudio
- Garantir que o formato é suportado pelo navegador
- Verificar se o componente SoundCloudPlayer está configurado corretamente

#### Problemas de Tempo Limite
- Verificar se o valor de playTimeLimit está definido corretamente
- Verificar se o cálculo do progresso está funcionando corretamente
- Verificar o listener de evento timeupdate do elemento de áudio

---

Esta documentação é um documento vivo e deve ser atualizada à medida que o sistema evolui.

Última atualização: Março, 2025
