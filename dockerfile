FROM node:22-alpine as BUILD
WORKDIR /app
COPY  package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=BUILD /app/dist/agendador-de-tarefas/browser /usr/share/nginx/html
EXPOSE 80
