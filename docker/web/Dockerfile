FROM cemarin/node-base:20-alpine
ENV CI=true

#instala pnpm de forma consistente
#versión de pnpm compatible con Node 20
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate 

WORKDIR /app

# First copy and build shared
COPY shared/ /shared/
RUN cd /shared && pnpm install && pnpm run build 

# Now build web
COPY web/package*.json ./

#Resolucion de hoisting de paquetes
RUN echo "shamefully-hoist=true" > .npmrc && echo "node-linker=hoisted" >> .npmrc

# package.json references file:../shared
RUN pnpm install --strict-peer-dependencies=false

COPY web/ .

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]