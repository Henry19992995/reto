# Gestor de Productos

Aplicación web full-stack para la gestión de productos bancarios, desarrollada con Angular 17 en el frontend y Node.js con Express y TypeScript en el backend.

## Descripción

Sistema de gestión de productos que permite crear, listar, editar y eliminar productos bancarios. La aplicación incluye validaciones tanto en frontend como backend, interfaz de usuario moderna y arquitectura basada en microservicios con Docker.

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido en Docker Desktop)
- Git (opcional, para clonar el repositorio)

## Estructura del Proyecto

```
repo-interview-main/
├── backend/              # API REST en Node.js/Express/TypeScript
│   ├── src/
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── dto/          # Data Transfer Objects con validaciones
│   │   ├── interfaces/   # Interfaces TypeScript
│   │   ├── const/        # Constantes
│   │   └── main.ts       # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── frontend/             # Aplicación Angular 17
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Componentes Angular
│   │   │   ├── services/   # Servicios HTTP
│   │   │   ├── models/     # Interfaces y modelos
│   │   │   └── app.routes.ts
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml    # Orquestación de servicios
```

## Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

1. Clonar o descargar el repositorio:
```bash
git clone <url-del-repositorio>
cd repo-interview-main
```

2. Construir e iniciar los contenedores:
```bash
docker compose up -d --build
```

3. Acceder a la aplicación:
   - Frontend: http://localhost:4210
   - Backend API: http://localhost:3003

4. Detener los contenedores:
```bash
docker compose down
```

### Opción 2: Desarrollo Local

#### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Compilar TypeScript:
```bash
npm run build
```

4. Iniciar el servidor en modo desarrollo:
```bash
npm run start:dev
```

El backend estará disponible en http://localhost:3002

#### Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
```

El frontend estará disponible en http://localhost:4200

## API Endpoints

### Con Docker Compose
Base URL: `http://localhost:3003/bp/products`

### En Desarrollo Local
Base URL: `http://localhost:3002/bp/products`

### Obtener todos los productos
```
GET /bp/products
```

### Obtener producto por ID
```
GET /bp/products/:id
```

### Verificar si un ID existe
```
GET /bp/products/verification/:id
```

### Crear producto
```
POST /bp/products
Content-Type: application/json

{
  "id": "string",
  "name": "string (6-100 caracteres)",
  "description": "string (10-200 caracteres)",
  "logo": "string (URL válida con http:// o https://)",
  "date_release": "YYYY-MM-DD",
  "date_revision": "YYYY-MM-DD"
}
```

### Actualizar producto
```
PUT /bp/products/:id
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "logo": "string",
  "date_release": "YYYY-MM-DD",
  "date_revision": "YYYY-MM-DD"
}
```

### Eliminar producto
```
DELETE /bp/products/:id
```

## Validaciones

### Backend
- ID: Requerido, único
- Nombre: Requerido, entre 6 y 100 caracteres
- Descripción: Requerido, entre 10 y 200 caracteres
- Logo: Requerido, URL válida con protocolo (http:// o https://)
- Fecha de liberación: Requerido, formato de fecha válido
- Fecha de revisión: Requerido, formato de fecha válido (calculada automáticamente como fecha de liberación + 1 año)

### Frontend
- Validaciones en tiempo real con mensajes de error
- Verificación de ID duplicado antes de crear
- Cálculo automático de fecha de revisión
- Vista previa del logo al ingresar URL válida

## Tecnologías Utilizadas

### Backend
- Node.js 18
- Express.js
- TypeScript
- Routing Controllers
- Class Validator
- CORS

### Frontend
- Angular 17
- TypeScript
- RxJS
- Reactive Forms
- Standalone Components

### DevOps
- Docker
- Docker Compose
- Nginx (servidor web para frontend)

## Características

- Interfaz de usuario moderna y responsive
- Validaciones sincronizadas entre frontend y backend
- Búsqueda y filtrado de productos
- Paginación de resultados
- Modal de confirmación para eliminación
- Notificaciones toast para feedback al usuario
- Manejo de errores robusto
- Arquitectura de microservicios con Docker

## Comandos Útiles

### Docker Compose

Reconstruir solo el frontend:
```bash
docker compose up -d --build frontend
```

Reconstruir solo el backend:
```bash
docker compose up -d --build backend
```

Ver logs del backend:
```bash
docker compose logs -f backend
```

Ver logs del frontend:
```bash
docker compose logs -f frontend
```

Ver estado de los contenedores:
```bash
docker compose ps
```

## Desarrollo

### Estructura de Componentes

- `ProductListComponent`: Lista de productos con tabla, búsqueda y paginación
- `ProductFormComponent`: Formulario para crear/editar productos
- `ConfirmModalComponent`: Modal de confirmación para acciones destructivas
- `ToastComponent`: Notificaciones toast para feedback

### Servicios

- `ProductService`: Servicio HTTP para comunicación con la API
- `ToastService`: Servicio para gestión de notificaciones toast

## Licencia

ISC

## Autor

Desarrollado como parte de un ejercicio técnico.
