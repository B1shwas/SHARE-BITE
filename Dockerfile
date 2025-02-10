FROM node:21

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "./wait-for-db.sh"]
