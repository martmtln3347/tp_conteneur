FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY public ./public

EXPOSE 8081

CMD ["npm", "run", "dev"]
