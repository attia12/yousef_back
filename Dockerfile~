FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
FROM nginx:alpine


COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/task-management /usr/share/nginx/html
EXPOSE 80


