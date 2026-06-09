# FeedbackBoard

Plataforma de feedback y votación para productos, similar a Canny.io pero open source y self-hosteable.

Los usuarios registrados envían sugerencias de mejora, votan las que más les interesan, y reciben notificaciones por email cuando el admin cambia el estado de su sugerencia. El admin gestiona el board, modera sugerencias y actualiza estados desde un dashboard privado.

**Dos roles:** Admin y Member. Ambos se autentican con JWT.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Estado global | useContext + useReducer |
| Estado local | Zustand |
| Server state | React Query |
| Formularios | React Hook Form + Zod |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Tiempo real | Socket.io client |
| Lenguaje | JS y TypeScript estricto |
| Backend | NestJS |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Queue | BullMQ + Redis |
| Email | Mailpit (desarrollo) |
| WebSockets | Socket.io |
| Contenedores | Docker + Docker Compose |
| Imagen base | cemarin/node-base:20 |

---

## Estructura del proyecto

```feedbackboard/
├── api/                                      # Backend NestJS
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20260505215821_init/
│   │   │   │   └── migration.sql
│   │   │   ├── 20260507222108_change_field/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   └── role.decorator.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── pipes/
│   │   │   │   └── zod-validation.pipe.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   └── schemas/
│   │   │   │       └── auth.schema.ts
│   │   │   └── users/
│   │   │       ├── schemas/
│   │   │       │   └── user.schema.ts
│   │   │       ├── users.controller.ts
│   │   │       ├── users.module.ts
│   │   │       └── users.service.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── generated/
│   │   └── prisma/                           # Prisma generado
│   ├── package.json
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── web/                                      # Frontend React + Vite
│   ├── public/
│   │   ├── feedback-loop.png
│   │   ├── layout-dashboard.svg
│   │   └── rating.png
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/
│   │   │   │   └── AppProviders.tsx
│   │   │   └── router/
│   │   │       └── AppRouter.tsx
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── shared/
│   │   │   │   ├── AppButton.tsx
│   │   │   │   ├── AppInput.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── ui/
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── alert.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── label.tsx
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   └── pages/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── RegisterForm.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   └── RegisterPage.tsx
│   │   │   │   └── schemas/
│   │   │   │       └── auth.schema.ts
│   │   │   ├── board/
│   │   │   │   └── pages/
│   │   │   │       └── BoardPage.tsx
│   │   │   └── votes/
│   │   │       └── pages/
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── useSocket.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── store/
│   │   │   └── boardStore.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── components.json
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── shared/                                   # Paquete compartido
│   ├── src/
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   ├── suggestions.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   └── vote.schema.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                                   # Dockerfiles
│   ├── api/
│   │   └── Dockerfile
│   └── web/
│       └── Dockerfile
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yaml
└── README.md

```

---

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores

---


## Levantar el proyecto

```bash
docker compose up --build -d
```

### URLs disponibles

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3001 |
| API | http://localhost:3000 |
| Mailpit UI | http://localhost:3002 |

### Comandos útiles

```bash
# Levantar sin rebuild
docker compose up

# Detener sin eliminar volúmenes
docker compose stop

# Ver logs de un servicio
docker compose logs -f api

# Acceder al contenedor de la api
docker exec -it fb_api sh

# Correr migraciones manualmente
docker exec -it fb_api npx prisma migrate dev

# Abrir Prisma Studio
docker exec -it fb_api npx prisma studio
```

---

## Endpoints de la API

```
Auth
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/profile

Users (Admin only)
  GET    /api/users
  GET    /api/users/:id
  PATCH  /api/users/:id
  DELETE /api/users/:id

Suggestions
  GET    /api/suggestions            # filtros: category, status, order
  GET    /api/suggestions/:id
  POST   /api/suggestions            # Member + Admin
  PATCH  /api/suggestions/:id/status # Admin only
  DELETE /api/suggestions/:id        # Admin o author

Votes
  POST   /api/votes/:suggestionId    # toggle — vota o quita el voto
  GET    /api/votes/my               # mis votos

Health
  GET    /api/health
```
---
## El flujo completo de registro + autologin

```
Usuario llena el form
  → POST /auth/register   (sin JWT — ruta pública)
  → AuthService llama UsersService.create()
  → Usuario creado en DB
  → Frontend hace POST /auth/login con las mismas credenciales
  → Recibe el JWT
  → dispatch LOGIN al AuthContext
  → navigate('/board')

```

---

## Flujo principal — cambio de estado con notificación

```
Admin cambia estado de una sugerencia
  → PATCH /api/suggestions/:id/status
  → SuggestionsService actualiza en DB
  → Agrega job a la cola de BullMQ (mail.queue)
  → NotificationsGateway emite evento via WebSocket al board
  → MailProcessor procesa el job de forma asíncrona
  → MailService envía email al autor via Mailpit
  → El autor ve la notificación en tiempo real en el board
```

---

## Schema de base de datos (Prisma)

```prisma
model User {
  id           String       @id @default(uuid())
  email        String       @unique
  passwordHash String
  name         String
  role         Role         @default(MEMBER)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  suggestions  Suggestion[]
  votes        Vote[]

  @@index([email])
}

enum Role {
  ADMIN
  MEMBER
}

model Suggestion {
  id          String           @id @default(uuid())
  title       String
  description String
  category    Category
  status      SuggestionStatus @default(PENDING)
  authorId    String
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  author      User             @relation(fields: [authorId], references: [id])
  votes       Vote[]

  @@index([authorId])
  @@index([status])
  @@index([category])
}

enum Category {
  FEATURE
  BUG
  IMPROVEMENT
  OTHER
}

enum SuggestionStatus {
  PENDING
  UNDER_REVIEW
  IN_PROGRESS
  COMPLETED
  REJECTED
}

model Vote {
  id           String     @id @default(uuid())
  userId       String
  suggestionId String
  createdAt    DateTime   @default(now())
  user         User       @relation(fields: [userId], references: [id])
  suggestion   Suggestion @relation(fields: [suggestionId], references: [id])

  @@unique([userId, suggestionId])
  @@index([suggestionId])
}
```

---

## Notas de setup — problemas conocidos y soluciones

### Tailwind CSS v4

Con Vite + React, Tailwind v4 **no usa** `npx tailwindcss init`. El setup correcto es:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

`vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css`:
```css
@import "tailwindcss";
```

No existe `tailwind.config.ts` en v4. Todo el tema se define en `index.css` con `@theme`.

### shadcn/ui con Tailwind v4

Requiere configurar el path alias **antes** de correr `npx shadcn@latest init`.

`tsconfig.app.json` — agregar dentro de `compilerOptions`:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

`vite.config.ts` — agregar alias:
```ts
import path from 'path'

resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

Instalar tipos de node:
```bash
npm install -D @types/node
```

Luego sí correr:
```bash
npx shadcn@latest init -d
```

> **Nota:** Si shadcn crea las carpetas `components/` y `lib/` en la raíz de `web/` en lugar de dentro de `src/`, moverlas manualmente:
> ```bash
> mv components src/components
> mv lib src/lib
> ```

### Tema visual

El tema de colores se gestiona con [tweakcn.com](https://tweakcn.com/editor/theme). Una vez elegido el tema, instalarlo con:

```bash
npx shadcn@latest add https://tweakcn.com/r/themes/<theme-id>
```

Esto actualiza `src/index.css` con las variables CSS del tema seleccionado.

Los colores custom del proyecto (status badges, etc.) se agregan en `src/index.css` dentro del bloque `@theme`:

```css
@theme {
  --color-status-pending: #9CA3AF;
  --color-status-under-review: #F59E0B;
  --color-status-in-progress: #3B82F6;
  --color-status-completed: #14B8A6;
  --color-status-rejected: #EF4444;
}
```

### Advertencias de VS Code en index.css

Los warnings `Unknown at rule @theme` y `Unknown at rule @custom-variant` son **falsos positivos** del linter de VS Code. No afectan el funcionamiento — Tailwind v4 los interpreta correctamente.

---

## Patrones aplicados

| Patrón | Dónde | Por qué |
|---|---|---|
| Strategy | JWT / Local auth strategies | Intercambiable sin romper el módulo de auth |
| Observer | WebSocket gateway, BullMQ | Reacción a eventos sin acoplamiento directo |
| Guard | JwtAuthGuard, RolesGuard | Separación clara de autenticación y autorización |
| Interceptor | Response wrapper global | Formato consistente en todas las respuestas |
| Decorator | @Roles(), @CurrentUser() | Metadatos declarativos, código limpio |
| Repository (via Prisma) | Todos los services | Abstrae acceso a datos |
| Container/Presentational | Páginas vs componentes UI | Separación lógica/presentación en React |
| Custom Hook | useAuth, useSuggestions, useSocket | Reutilización de lógica de estado |

---

## Convenciones del proyecto

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`)
- **Branches:** `main` → `develop` → `feature/nombre` → PR
- **Módulos NestJS:** siempre generados con CLI (`nest g module`, `nest g service`, `nest g controller`)
- **DTOs:** siempre validados con `class-validator`
- **Errores:** manejados con filtro global `HttpExceptionFilter`
- **Componentes React:** máximo 150 líneas — si crece se divide
- **Props de componentes:** usar `type` en lugar de `interface`
- **Un voto por usuario por sugerencia:** enforceado en DB con `@@unique`
- **Roles:** verificados siempre en el servidor, nunca solo en el cliente

## Decisiones técnicas

### Un solo `.env` en la raíz
Todos los proyectos en `proyectos_personales/` siguen el mismo patrón: un `.env` raíz como fuente de verdad. Docker Compose lo inyecta en los containers y NestJS lo lee en runtime. El `api/.env` interno es exclusivo para el CLI de Prisma en desarrollo local.

### `prisma generate` en el `command` del compose
Mover `prisma generate` del Dockerfile al `command` del compose evita el error de variables de entorno no disponibles en build time. En el momento que corre el `command`, Docker ya inyectó todas las variables.

### Frontend desacoplado del backend
El `web` service no depende del `api` en el compose. Angular arranca independientemente — si la API no está lista, las llamadas HTTP fallan hasta que NestJS levante. Esto es el comportamiento correcto en arquitecturas desacopladas.

### Driver adapters Prisma v7
Prisma v7 usa `@prisma/adapter-pg` con un `Pool` de conexiones en lugar de la URL directa. Permite mayor control sobre el pool y es el patrón recomendado por Prisma para producción.

### `dotenv-cli` para scripts de Prisma
En lugar de duplicar el `.env` o hardcodear la URL, los scripts de Prisma usan `dotenv -e ../.env --` para cargar el `.env` raíz antes de ejecutar cualquier comando de Prisma. Mismo patrón que SupportFlow.

### Arquitectura de Autenticación de Doble Token (Access + Refresh)
Se ha implementado un sistema robusto de autenticación basado en el estándar de la industria:
- **Access Token (Corta duración - 15m):** Viaja en el body (JSON) al iniciar sesión y se mantiene exclusivamente en memoria RAM en el frontend (`tokenStore`). Axios lo inyecta en cada petición como Bearer token.
- **Refresh Token (Larga duración - 7d):** El backend lo emite dentro de una cookie `HttpOnly` y con `path: '/'`. Esto significa que el código JavaScript (frontend) **nunca** puede leer este token, lo cual protege la sesión contra ataques XSS (Cross-Site Scripting).

### Extensión de Schemas de Zod para Uso Interno
En el monorepo, `feedbackboard-shared` define el contrato estricto de lo que el frontend espera recibir (ej: `LoginResponseSchema` sin `refreshToken`).
Sin embargo, internamente el servicio de autenticación de NestJS necesita manejar el `refreshToken` para inyectarlo en la cookie. En lugar de ensuciar el contrato compartido o usar tipos `any`, el backend *extiende* el schema de Zod (`AuthResultSchema = LoginResponseSchema.extend(...)`). Así, se mantiene un tipado estricto end-to-end respetando las fronteras entre cliente y servidor.

### Reactividad vs Polling en el Refresh Token
La renovación del access token no funciona mediante polling (temporizador cada X minutos). En su lugar, es **completamente reactiva**:
1. El interceptor de Axios captura globalmente cualquier error `401 Unauthorized`.
2. Pone en pausa las peticiones en vuelo mediante una cola de promesas (`pendingQueue`).
3. Ejecuta silenciosamente `/auth/refresh` enviando la cookie.
4. Con el nuevo Access Token en mano, reintenta todas las peticiones pausadas.
5. Si el refresh también falla, desloguea al usuario de forma limpia.

Esto garantiza un balance óptimo: no se satura al servidor con peticiones innecesarias cuando el usuario está inactivo, y la experiencia de uso es transparente y fluida. Para proyectos a gran escala y de extrema criticidad (banca, trading) se optaría por proactividad, pero para aplicaciones estándar como portafolios y SaaS B2B, este enfoque reactivo es el estándar de la industria.

## 📋 Estado del proyecto

Este proyecto está en desarrollo activo como parte de un portafolio de ingeniería de software. La arquitectura, decisiones de diseño y progreso de implementación están documentados en el historial de commits.