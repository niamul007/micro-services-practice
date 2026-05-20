FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# copy package files first — Docker caches this layer
# if package.json hasn't changed, npm install is skipped on next build
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# copy rest of code after installing — code changes won't trigger npm install
COPY . .

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]