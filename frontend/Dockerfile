# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
