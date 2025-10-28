# 🚗 Car Hub - Marketplace de Carros

> **Aplicativo completo de compra e venda de carros com React Native, integração real com Strapi CMS e arquitetura offline-first**

## 🎯 Visão Geral

Car Hub é uma plataforma profissional para o mercado automotivo brasileiro, oferecendo uma experiência completa tanto para compradores quanto vendedores de veículos. O app combina **design moderno**, **performance otimizada**, **arquitetura offline-first** e **integração real com API Strapi**.

### 🏆 **Destaques do Projeto**
- ✅ **100% funcional** com API real Strapi v5
- ✅ **Offline-first** com sincronização inteligente  
- ✅ **Sistema de autenticação** completo
- ✅ **Filtros avançados** customizados
- ✅ **Upload de imagens** real
- ✅ **Design system** profissional
- ✅ **Código TypeScript** strict sem `any`

## 📱 Screenshots

<div align="center">

### 🏠 Tela Principal, Detalhes & Perfil
<img width="250"  alt="image" src="https://github.com/user-attachments/assets/fab017cf-f2c6-47d5-a2a6-548cb4918f01" />
<img  width="250"   alt="image" src="https://github.com/user-attachments/assets/f75de2d0-a6e7-4173-b9eb-1e28d1cb4fc8" />
<img  width="250"  alt="image" src="https://github.com/user-attachments/assets/8cb6fc83-5e15-4e30-a790-bfe36a20748f" />

*Tela inicial com catálogo de carros, perfil do usuário logado e estado de visitante*

### 🚗 Estados de Loading
<img width="250" alt="image" src="https://github.com/user-attachments/assets/56ce8aa5-498a-4b9a-9fa3-241e8eebfb37" />
<img width="250" alt="image" src="https://github.com/user-attachments/assets/05d5a878-9192-40d6-94b2-ef71e1cd2704" />
<img width="250" alt="image" src="https://github.com/user-attachments/assets/32255d3a-b6de-4691-a11f-c8dc6c32506c" />

*Tela de detalhes com especificações completas e skeletons de loading*

### 🎯 Destaques das Screenshots

- **Design Consistente**: Interface dark mode com tokens de cor centralizados
- **Estados de Loading**: Skeletons animados para melhor UX
- **Navegação Intuitiva**: Bottom tabs com ícones Phosphor
- **Dados Realistas**: Mock data com informações brasileiras autênticas
- **Responsividade**: Layout adaptado para diferentes tamanhos de tela
- **Feedback Visual**: Toasts, badges e indicadores de estado

</div>

## 🚀 Funcionalidades Implementadas

### 🏠 **Tela Principal (Home)**
- ✅ **Catálogo Real**: Carros da API Strapi com dados brasileiros autênticos
- ✅ **Filtros por Categoria**: All, Sedan, SUV, Hatch, Coupé com funcionamento real
- ✅ **Sistema de Favoritos**: Persistência com AsyncStorage + Zustand
- ✅ **Pull to Refresh**: Sincronização em tempo real com API
- ✅ **Infinite Scroll**: Paginação automática otimizada
- ✅ **Offline-first**: Funciona sem internet com cache inteligente
- ✅ **Network Status**: Banner indicativo de conectividade
- ✅ **Auth Guard**: Proteção de ações para usuários não logados

### 🔍 **Busca e Filtros Avançados**
- ✅ **Controller Customizado**: Strapi v5 com filtros profissionais
- ✅ **Busca Geral**: Pesquisa em título, marca, modelo, descrição e localização  
- ✅ **Filtros Exatos**: Marca, modelo, categoria, combustível, câmbio
- ✅ **Filtros de Range**: Ano (min/max), preço (min/max), quilometragem
- ✅ **Ordenação**: Preço, ano, km, data de criação, título (asc/desc)
- ✅ **Paginação Real**: Controle eficiente com Strapi
- ✅ **Cache Offline**: Resultados salvos para uso sem internet

### 🚗 **Detalhes do Carro**  
- ✅ **100% API Real**: Dados vindos completamente do Strapi
- ✅ **Galeria de Imagens**: Upload real de múltiplas fotos
- ✅ **Especificações Completas**: Motor, portas, assentos, características
- ✅ **Vendedor Real**: Informações do usuário autenticado que criou o anúncio
- ✅ **Ações Protegidas**: Auth guard para contato, favoritos, test drive
- ✅ **Toasts Informativos**: Feedback para funcionalidades em desenvolvimento
- ✅ **Contador de Views**: Incremento automático de visualizações

### 👤 **Sistema de Autenticação**
- ✅ **JWT Real**: Login/registro integrado com Strapi Users & Permissions
- ✅ **Validação Rigorosa**: Formulários com Zod + React Hook Form  
- ✅ **Persistência Segura**: Token salvo com AsyncStorage
- ✅ **Auth Guards**: Modais informativos para ações protegidas
- ✅ **Estados de Loading**: Skeletons durante autenticação
- ✅ **Logout Seguro**: Limpeza completa de dados do usuário

### 📝 **Criação de Anúncios**
- ✅ **Formulário Completo**: 15+ campos em inglês profissional
- ✅ **Upload Real de Fotos**: Integração com Strapi Upload Plugin
- ✅ **Inputs Livres**: Marca e modelo como text input (não select)
- ✅ **Validação Robusta**: Zod schema com regras brasileiras
- ✅ **Auth Required**: Proteção completa com redirecionamento
- ✅ **Feedback Visual**: Loading states e toast notifications

### 🎨 **Experiência do Usuário**
- ✅ **Design System Profissional**: Gluestack UI v2 + Tailwind CSS
- ✅ **Modo Escuro Completo**: Interface otimizada para baixa luminosidade  
- ✅ **Animações Fluidas**: Transições suaves e micro-interações
- ✅ **Sistema Modal**: Confirmações, informações e auth guards
- ✅ **Toast Notifications**: Feedback visual consistente para todas as ações
- ✅ **Loading States**: Skeletons animados e estados de carregamento
- ✅ **Error Boundaries**: Tratamento robusto de erros
- ✅ **Ícones Phosphor**: Biblioteca consistente sem emojis

## 🛠️ Stack Tecnológica Completa

### **Frontend Mobile**
- **React Native** - Framework mobile multiplataforma
- **Expo Router** - Roteamento file-based com navegação nativa
- **TypeScript Strict** - Tipagem rigorosa em 100% do código (zero `any`)
- **Gluestack UI v2** - Sistema de componentes acessível e moderno
- **Tailwind CSS** - Estilização utilitária com className prop
- **Phosphor React Native** - 1.400+ ícones consistentes

### **Backend & API**
- **Strapi v5** - CMS headless com MySQL database
- **Controller Customizado** - Filtros avançados e busca personalizada
- **JWT Authentication** - Sistema seguro de autenticação
- **Upload Plugin** - Upload real de imagens para servidor
- **REST API** - Endpoints otimizados com paginação e cache

### **Gerenciamento de Estado**
- **Zustand + AsyncStorage** - Auth, favoritos, filtros, network, offline cache
- **React Query (TanStack)** - Cache inteligente, sincronização e offline-first
- **Network Detection** - expo-network para detectar conectividade
- **Offline Cache Store** - Sistema próprio de cache para dados offline

### **Formulários & Validação**
- **React Hook Form** - Performance otimizada para formulários complexos
- **Zod Schemas** - Validação type-safe em runtime
- **@hookform/resolvers** - Integração Zod + RHF seamless
- **Validação Brasileira** - CPF, CEP, telefone com regras nacionais

### **Arquitetura & Padrões**
- **Controller Pattern** - Separação UI/lógica para evitar conflitos Expo Router
- **Path Aliases** - Imports limpos com @ para melhor DX
- **Design Tokens** - Sistema centralizado de cores, spacing e tipografia
- **Component Composition** - Gluestack base + componentes customizados
- **Error Boundaries** - Tratamento robusto de erros em toda a app

### **Desenvolvimento & Deploy**
- **Yarn Workspaces** - Gerenciamento de dependências otimizado
- **Expo Dev Build** - Build customizado para testing
- **Hot Reload** - Desenvolvimento ágil com HMR
- **TypeScript Config** - Configurações strict para máxima confiabilidade

## 🏗️ Arquitetura Avançada

### **Padrão Controller (Separation of Concerns)**
```typescript
// ✅ Screen: Apenas UI e apresentação  
export default function HomeScreen() {
  const { cars, loading, handleCarPress } = useHomeController()
  return <CarList cars={cars} loading={loading} onPress={handleCarPress} />
}

// ✅ Controller: Toda lógica de negócio centralizada
export default function useHomeController() {
  const { data: cars, isLoading } = useInfiniteQuery({
    queryKey: ['cars', filters],
    queryFn: ({ pageParam }) => getCarsList({ ...filters, page: pageParam })
  })
  
  return { cars, loading: isLoading, handleCarPress }
}
```

### **Estrutura de Projeto Completa**
```
🏠 car-hub/ (React Native App)
├── 📱 src/
│   ├── 🧭 app/                     # Expo Router (File-based routing)
│   │   ├── 📑 (tabs)/             # Bottom navigation
│   │   │   ├── home.tsx           # Tela principal com carros
│   │   │   ├── search.tsx         # Busca e filtros
│   │   │   └── profile.tsx        # Perfil e configurações
│   │   ├── 🔐 auth/               # Sistema de autenticação  
│   │   │   ├── login.tsx          # Tela de login
│   │   │   └── register.tsx       # Cadastro de usuário
│   │   ├── 🚗 car/                # Detalhes do veículo
│   │   │   ├── [id].tsx           # Tela dinâmica de detalhes
│   │   │   └── controller.ts      # Lógica dos detalhes
│   │   ├── create-listing.tsx     # Criar novo anúncio
│   │   └── _layout.tsx            # Layout root
│   ├── 🧱 components/             # Componentes reutilizáveis
│   │   ├── 🎨 ui/                 # Design system
│   │   │   ├── CarCard.tsx        # Card de veículo
│   │   │   ├── AuthInput.tsx      # Input para forms
│   │   │   ├── ProfileMenu.tsx    # Menu do perfil
│   │   │   └── CarSkeletons.tsx   # Loading states
│   │   └── 🪟 Modal/              # Sistema modal
│   ├── 🎮 controllers/            # Business logic hooks
│   │   ├── useHomeController.ts   # Lógica da home
│   │   ├── useAuthController.ts   # Lógica de auth
│   │   └── useSearchController.ts # Lógica de busca
│   ├── 🌐 services/               # Integração externa
│   │   └── 📡 api/                # Strapi integration
│   │       ├── client.ts          # Axios config
│   │       ├── cars.ts            # Cars endpoints
│   │       ├── auth.ts            # Auth endpoints
│   │       └── upload.ts          # Image upload
│   ├── 🗄️ store/                  # Zustand stores
│   │   ├── authStore.ts           # Estado de autenticação
│   │   ├── favoritesStore.ts      # Sistema de favoritos
│   │   ├── networkStore.ts        # Status da rede
│   │   ├── offlineCacheStore.ts   # Cache offline
│   │   └── modalStore.ts          # Sistema modal
│   ├── 🎨 theme/                  # Design tokens
│   │   ├── colors.ts              # Paleta de cores
│   │   ├── spacing.ts             # Espaçamentos
│   │   └── typography.ts          # Tipografia
│   ├── 📝 types/                  # TypeScript definitions
│   │   ├── car.ts                 # Tipos do domínio
│   │   ├── user.ts                # Tipos de usuário
│   │   └── api.ts                 # Tipos de API
│   └── 🛠️ utils/                  # Utilitários
│       ├── validation.ts          # Zod schemas
│       └── formatters.ts          # Formatação de dados

🖥️ car-hub-api/ (Strapi Backend)  
├── 📊 src/api/car/
│   ├── controllers/car.ts         # Controller customizado
│   ├── routes/car.json           # Rotas API
│   └── content-types/car/        # Schema do modelo
├── 🗄️ config/
│   ├── database.ts               # Config MySQL  
│   └── plugins.ts                # Upload plugin
└── 📤 public/uploads/            # Arquivos enviados
```

## 🎨 Design System

### Tokens de Design
- **Cores**: Paleta consistente com variações e transparências
- **Tipografia**: Hierarquia clara e legível
- **Espaçamento**: Sistema base-8 para consistência
- **Bordas**: Raios padronizados para elementos

### Componentes
- **Gluestack UI**: Base sólida e acessível
- **Componentes Customizados**: Específicos do domínio automotivo
- **Sistema de Ícones**: Phosphor React Native

## 🚀 Setup Completo do Projeto

### **Pré-requisitos**
- **Node.js 18+** (recomendado LTS)
- **Yarn** (obrigatório - projeto não suporta npm)
- **Expo CLI** (`yarn global add @expo/cli`)
- **MySQL** (para o backend Strapi)
- **Android Studio** ou **Xcode** (para emuladores)

### **1️⃣ Backend Setup (Strapi)**
```bash
# 📁 Clone e configure o backend  
cd car-hub-api
yarn install

# 🗄️ Configure MySQL database
# Crie um banco 'car_hub' no MySQL
mysql -u root -p
CREATE DATABASE car_hub;

# ⚙️ Configure .env
cp .env.example .env
# Edite com suas credenciais MySQL

# 🚀 Inicie o Strapi
yarn develop
# ✅ Admin panel: http://localhost:1337/admin
```

### **2️⃣ Frontend Setup (React Native)**  
```bash
# 📱 Configure o app mobile
cd car-hub
yarn install

# 🌐 Configure a URL da API
# Edite src/services/api/client.ts
const API_URL = 'http://SEU-IP:1337/api' // ⚠️ Use seu IP real

# 🚀 Inicie o app
yarn start

# 📲 Para plataformas específicas  
yarn android        # Android emulator
yarn ios           # iOS simulator  
yarn web           # Expo web
```

### **3️⃣ Comandos Disponíveis**

#### **Backend (Strapi)**
```bash
yarn develop        # Dev server com watch
yarn start         # Production server
yarn build         # Build para produção  
yarn strapi        # CLI commands
```

#### **Frontend (React Native)**
```bash
yarn start          # Expo dev server
yarn android        # Run Android
yarn ios           # Run iOS  
yarn web           # Run web version
yarn type-check    # TypeScript check
yarn reset-cache   # Clear Metro cache
```

### **4️⃣ Configuração de Dados Iniciais**
```bash
# 📊 Acesse o Strapi Admin
http://localhost:1337/admin

# 👤 Crie um usuário admin
# 🚗 Adicione alguns carros via Content Manager
# 🔑 Configure roles & permissions para API pública
```

## 🌐 Sistema de API Real

### **Backend Strapi v5**
- **MySQL Database**: Banco de dados real com relacionamentos
- **5+ Carros Brasileiros**: Toyota Corolla, Honda Civic, VW Jetta, Hyundai HB20S, Ford EcoSport
- **Upload Real**: Imagens enviadas para `/public/uploads/`
- **Controller Customizado**: Filtros avançados e busca otimizada
- **JWT Auth**: Sistema completo de autenticação

### **Endpoints Disponíveis**
```bash
# 🏠 Listagem principal (com filtros básicos)
GET /api/cars?filters[category][$eq]=sedan&pagination[page]=1

# 🔍 Busca avançada (controller customizado)  
GET /api/cars/search?q=civic&brand=honda&yearFrom=2020&sortBy=price_asc

# 🚗 Detalhes específicos
GET /api/cars/123?populate[images]=true&populate[seller]=true

# 📝 Criar anúncio (autenticado)
POST /api/cars + JWT Bearer token

# 🖼️ Upload de imagens
POST /api/upload + FormData
```

### **Estrutura de Dados Real**
```typescript
interface Car {
  id: string
  title: string               // "Toyota Corolla 2022 XEi"
  brand: string              // "Toyota" (input livre)
  model: string              // "Corolla" (input livre)  
  year: number               // 2022
  price: number              // 95000 (R$ 95.000)
  km: number                 // 15000
  fuelType: string           // "flex", "gasolina", "diesel"
  transmission: string       // "manual", "automatic"
  category: string           // "sedan", "suv", "hatch"
  color: string              // "Prata", "Preto", "Branco"
  description: string        // Descrição detalhada
  location: string           // "São Paulo, SP"
  images: StrapiImage[]      // Upload real para Strapi
  specs: {
    engine: string           // "2.0"
    doors: number            // 4
    seats: number            // 5
    features: string[]       // ["Ar-condicionado", "Direção hidráulica"]
  }
  seller: {
    id: string               // ID do usuário autenticado
    username: string         // Nome do vendedor
    email: string            // Email do vendedor
    phone?: string           // Telefone (opcional)
  }
  status: "available"        // Apenas carros disponíveis
  views: number              // Contador real de visualizações
  createdAt: string          // Data de criação
  updatedAt: string          // Última atualização
}
```

### **Sistema Offline-First**
```typescript
// 🔄 Cache inteligente com React Query
const { data: cars, isLoading } = useInfiniteQuery({
  queryKey: ['cars', filters],
  queryFn: ({ pageParam = 1 }) => getCarsList({ ...filters, page: pageParam }),
  staleTime: 5 * 60 * 1000,        // 5 min fresh
  cacheTime: 30 * 60 * 1000,       // 30 min cache
  refetchOnWindowFocus: false,      // Não refetch automático
  retry: (failureCount, error) => failureCount < 2 && isNetworkError(error)
})

// 💾 Zustand + AsyncStorage para persistência
const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (carId) => set(state => ({
        favorites: [...state.favorites, carId]
      }))
    }),
    { name: 'favorites-storage' }
  )
)
```

## 🔐 Sistema de Autenticação Real

### **JWT com Strapi Users & Permissions**
```typescript
// 📱 Login real com token JWT
const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/local', { identifier: email, password })
  const { jwt, user } = response.data
  
  // 💾 Persistir token e usuário
  await AsyncStorage.setItem('token', jwt)
  await AsyncStorage.setItem('user', JSON.stringify(user))
  
  return { token: jwt, user }
}

// 🛡️ Auth Guard com modais informativos
const useAuthGuard = () => {
  const { isAuthenticated } = useAuthStore()
  const { setModal } = useModalStore()
  
  const checkAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setModal({
        type: 'confirm',
        title: 'You need to be logged in to perform this action. Login now?',
        confirmText: 'Login',
        cancelText: 'Cancel', 
        action: () => router.push('/auth/login')
      })
      return false
    }
    action()
    return true
  }
}
```

### **Validação Rigorosa**  
```typescript
// 🔍 Schema Zod para registro
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// 🎮 Controller com React Hook Form
const form = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
  mode: 'onChange'
})
```

## 📱 Compatibilidade

### Plataformas Suportadas
- ✅ Android 5.0+ (API 21+)
- ✅ iOS 11.0+
- ✅ Web (Expo Web)

### Dispositivos Testados
- Smartphones (4" - 7")
- Tablets (8" - 13")
- Navegadores modernos

## 🧪 Qualidade e Desenvolvimento

### Padrões de Código
- **TypeScript Strict**: Tipagem rigorosa em todo o projeto
- **Padrão Controller**: Separação clara entre UI e lógica de negócio
- **Component Architecture**: Gluestack UI + componentes customizados
- **Design Tokens**: Sistema centralizado de cores e espaçamentos

### Debugging e Desenvolvimento
- **Console Logs**: Removidos para produção
- **Expo Dev Tools**: Hot reload e debugging avançado
- **Error Boundaries**: Tratamento robusto de erros
- **Toast System**: Feedback visual consistente

## 🚀 Desenvolvimento e Preview

### Ambiente de Desenvolvimento
```bash
# Desenvolvimento local
yarn start

# Preview em dispositivos
yarn android
yarn ios
```

### **Funcionalidades Implementadas vs Em Desenvolvimento**

#### ✅ **100% Funcionais**
- Sistema completo de **login/registro** com JWT
- **CRUD de carros** (criar, listar, ver detalhes, filtrar)
- **Upload real de imagens** para Strapi
- **Sistema de favoritos** com persistência
- **Filtros avançados** com controller customizado  
- **Offline-first** com cache inteligente
- **Auth guards** com modais informativos
- **Toast notifications** para feedback

#### 🚧 **Com Toast Informativo (Preparado para Implementação)**
- **Chat/Mensagens**: Botões com toast "Chat em desenvolvimento"
- **Test Drive**: Modal de agendamento com toast
- **Notificações**: Sistema preparado com toast  
- **Configurações**: Menu criado com toasts por item
- **Ajuda/Suporte**: Links preparados com feedback
- **Carros Similares**: Estrutura pronta para implementação

## 🎓 Learnings & Achievements

### **🏆 Principais Conquistas Técnicas**
- ✅ **Arquitetura Offline-First** real com React Query + cache customizado
- ✅ **Controller Pattern** para evitar conflitos do Expo Router
- ✅ **TypeScript Strict** sem uma única ocorrência de `any`  
- ✅ **Strapi v5 Controller** customizado com filtros avançados
- ✅ **Auth System** completo com JWT + guards inteligentes
- ✅ **Upload Real** de imagens para servidor  
- ✅ **Sistema Modal** centralizado com Zustand
- ✅ **Design System** profissional com Gluestack UI

### **📚 Conceitos Implementados**
- **Separation of Concerns**: UI/Logic completamente separados  
- **Dependency Injection**: Services injetados via hooks
- **Error Boundaries**: Tratamento robusto em toda a aplicação
- **Progressive Enhancement**: Funciona offline e online
- **Optimistic Updates**: UI responsiva com sincronização posterior
- **Schema Validation**: Validação consistente client/server

### **🤝 Como Contribuir**
```bash
# 1️⃣ Fork e clone
git clone https://github.com/SEU-USERNAME/car-hub.git
cd car-hub

# 2️⃣ Crie uma branch para sua feature  
git checkout -b feature/nova-funcionalidade

# 3️⃣ Siga os padrões do projeto
# - TypeScript strict (zero any)
# - Controller pattern para business logic
# - Componentes Gluestack UI + customizados
# - Yarn exclusivamente (não use npm)

# 4️⃣ Commit seguindo conventional commits
git commit -m 'feat: adiciona busca por localização'
git commit -m 'fix: corrige cache offline de favoritos'  
git commit -m 'docs: atualiza README com nova feature'

# 5️⃣ Push e abra PR
git push origin feature/nova-funcionalidade
```

### **📋 Padrões de Commit**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug  
- `docs:` Documentação
- `style:` Formatação (não afeta funcionalidade)
- `refactor:` Refatoração sem mudança de comportamento
- `test:` Adição/modificação de testes
- `chore:` Tarefas de manutenção (deps, config, etc)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Time

- **GCLDEV** - Desenvolvimento Full Stack
- Design inspirado nas melhores práticas do mercado

## 🔗 Links Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [Gluestack UI](https://ui.gluestack.io/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)

## 📊 Estatísticas do Projeto

| **Métrica** | **Valor** | **Descrição** |
|-------------|-----------|---------------|
| **TypeScript Coverage** | 100% | Zero ocorrências de `any` |
| **API Integration** | Real | Strapi v5 + MySQL |  
| **Offline Support** | ✅ | Cache inteligente + sincronização |
| **Authentication** | JWT | Sistema completo + guards |
| **Image Upload** | Real | Upload para servidor Strapi |
| **Filtering** | Advanced | Controller customizado |
| **Components** | 15+ | Design system profissional |
| **Stores** | 6 | Zustand + AsyncStorage |
| **Screens** | 8 | Navigation completa |
| **Business Logic** | 6 Controllers | Separation of concerns |

## 🎯 Próximas Implementações

### **🚀 Roadmap Técnico**
- [ ] **Push Notifications** com Expo Notifications
- [ ] **Deep Linking** para compartilhar carros  
- [ ] **Geolocalização** para filtros por distância
- [ ] **Chat Real-time** com Socket.io
- [ ] **Payment Integration** (PIX/cartão)
- [ ] **Car Comparison** (comparar até 3 carros)
- [ ] **Advanced Search** com filtros salvos
- [ ] **Analytics** com tracking de eventos

### **🛡️ Melhorias de Segurança**
- [ ] **Biometric Auth** (Face ID/Touch ID)
- [ ] **Token Refresh** automático
- [ ] **Rate Limiting** no frontend
- [ ] **Input Sanitization** avançada

---

<div align="center">

### **🚗 Car Hub - Professional Car Marketplace**

**Stack:** React Native • Expo • Strapi v5 • MySQL • TypeScript  
**Architecture:** Offline-First • Controller Pattern • Design System  
**Features:** Real Auth • Advanced Filters • Image Upload • Cache System

**Made with 🔥 by [GCLDEV](https://github.com/GCLDEV)**

⭐ **Se este projeto foi útil, deixe uma estrela no repositório!**

</div>

---

### **📚 Recursos Úteis**
- 📖 [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/intro)
- 📖 [Expo Router Guide](https://docs.expo.dev/router/introduction/)  
- 📖 [Gluestack UI Components](https://ui.gluestack.io/)
- 📖 [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- 📖 [Zustand Patterns](https://github.com/pmndrs/zustand)

---

**⚡ Performance-first • 🎨 Design-driven • 🔧 Developer-friendly**
