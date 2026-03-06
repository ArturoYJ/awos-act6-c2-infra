# 🏗️ Infraestructura — SOA

Microservicio de historial y orquestación Docker para toda la plataforma SOA.

Este repositorio contiene:

1. **Microservicio de Historial** — Express.js + PostgreSQL para guardar prompts de imágenes
2. **Docker Compose** — Orquesta los 4 servicios de la plataforma

## Arquitectura

```
docker-compose.yml
├── db-historial     PostgreSQL 15        puerto 5435
├── infra            Express (historial)  puerto 3000
├── api              Express + TS (API)   puerto 3001
└── web              Next.js (frontend)   puerto 3002
```

```
Navegador (3002) ──► web ──axios──► api (3001) ──► NASA / Alpha Vantage / Hugging Face
                                       │
                                       └──► infra (3000) ──► PostgreSQL (5435)
```

## Requisitos

- **Docker Desktop** instalado y corriendo
- Los 3 repositorios clonados en la **misma carpeta padre**:

```bash
mkdir proyecto-soa && cd proyecto-soa
git clone https://github.com/ArturoYJ/awos-act6-c2-api.git
git clone https://github.com/ArturoYJ/awos-act6-c2-web.git
git clone https://github.com/ArturoYJ/awos-act6-c2-infra.git
```

> ⚠️ La estructura debe ser exactamente `api/`, `web/`, `infra/` al mismo nivel. El `docker-compose.yml` usa rutas relativas (`../api`, `../web`).

## Ejecución con Docker (recomendado)

### 1. Crear archivo `infra/.env`

El `docker-compose.yml` **no contiene credenciales** — las lee del archivo `.env` que tú creas localmente (está en `.gitignore`, nunca se sube a GitHub). Puedes copiar el ejemplo incluido:

```bash
cp .env.example .env
```

Y completar los valores:

```env
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=5435
DB_NAME=tu_base_de_datos
HUGGINGFACE_API_KEY=tu_clave_de_API_de_huggingface
NASA_API_KEY=tu_clave_de_API_de_nasa
ALPHA_VANTAGE_API_KEY=tu_clave_de_API_de_alpha_vantage
```

### 2. Levantar todos los servicios

```bash
cd infra
docker compose up --build
```

Esto levanta los 4 servicios automáticamente. Accede a:

- **Frontend**: http://localhost:3002
- **API Gateway**: http://localhost:3001/api/health
- **Historial**: http://localhost:3000

## Ejecución local (desarrollo)

### 1. Base de datos

```bash
cd infra
docker compose up db-historial
```

### 2. Variables de entorno

Crear `infra/.env` (mismo archivo indicado arriba, pero con `DB_HOST=127.0.0.1` para desarrollo local):

```env
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=127.0.0.1
DB_PORT=5435
DB_NAME=tu_base_de_datos
HUGGINGFACE_API_KEY=tu_clave_de_API_de_huggingface
NASA_API_KEY=tu_clave_de_API_de_nasa
ALPHA_VANTAGE_API_KEY=tu_clave_de_API_de_alpha_vantage
```

Crear `api/.ENV`:

```env
PORT=3001
HUGGINGFACE_API_KEY=tu_clave_de_API_de_huggingface
HISTORY_SERVICE_URL=http://localhost:3000/api/history
NASA_API_KEY=tu_clave_de_API_de_nasa
ALPHA_VANTAGE_API_KEY=tu_clave_de_API_de_alpha_vantage
```

Crear `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Iniciar servicios (una terminal por cada uno)

```bash
# Terminal 1
cd infra && npm install && npm run dev

# Terminal 2
cd api && npm install && npm run dev

# Terminal 3
cd web && npm install && npm run dev
```

## Claves de API necesarias

| Servicio      | Obtener clave                                |
| ------------- | -------------------------------------------- |
| Hugging Face  | https://huggingface.co/settings/tokens       |
| NASA          | https://api.nasa.gov/                        |
| Alpha Vantage | https://www.alphavantage.co/support/#api-key |

## Tecnologías

Docker · PostgreSQL 15 · Express 5 · Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Node 20
