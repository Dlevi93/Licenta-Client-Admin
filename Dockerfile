# stage 1
FROM node:latest AS my-app-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build-prod

# stage 2
FROM nginx:latest
COPY --from=my-app-build /app/dist /usr/share/nginx/html
EXPOSE 80