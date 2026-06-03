FROM cemarin/node-base:20-alpine
ENV CI=true

RUN apk add --no-cache openssl libc6-compat wget

#instala pnpm de forma consistente
#versión de pnpm compatible con Node 20
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# First copy and build shared
COPY shared/ /shared/
RUN cd /shared && pnpm install && pnpm run build

# Now build api
COPY api/package*.json ./
COPY api/prisma ./prisma

#Resolucion de hoisting de paquetes
RUN echo "shamefully-hoist=true" > .npmrc && echo "node-linker=hoisted" >> .npmrc

# package.json references file:../shared (which expects it at /shared because api is at /app)
RUN pnpm install --strict-peer-dependencies=false

COPY api/ .


EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]