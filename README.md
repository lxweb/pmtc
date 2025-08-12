# Gestión de Sesiones Psicológicas

Una aplicación web moderna para gestionar sesiones psicológicas, permitiendo a los pacientes ver psicólogos disponibles, filtrar por especialidad y modalidad (online/presencial), y agendar sesiones.

## 🚀 Características

- **Listado de psicólogos** con información detallada
- **Filtrado dual**: Por especialidad Y modalidad de sesión
- **Modalidades de sesión**: Online 🌐 y Presencial 🏢
- **Horarios diferenciados** por modalidad
- **Visualización de disponibilidad** semanal con filtros
- **Agendado de sesiones** con selección de modalidad
- **Interfaz responsive** y mobile-friendly
- **BFF (Backend for Frontend)** con Next.js API routes

## 🆕 Nuevas Funcionalidades

### Modalidades de Sesión
- **Sesiones Online**: Videollamadas y consultas remotas
- **Sesiones Presenciales**: Consultas en consultorio físico
- **Filtrado por Modalidad**: Buscar psicólogos por tipo de sesión
- **Horarios Diferenciados**: Disponibilidad específica por modalidad

### Filtros Avanzados
- **Especialidad**: Fobias, relaciones, depresión, estrés laboral, autoestima
- **Modalidad**: Solo Online, Solo Presencial, Ambas Modalidades
- **Combinación**: Filtrar por especialidad Y modalidad simultáneamente

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 con TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Contenedorización**: Docker + Docker Compose
- **Desarrollo**: Hot reload con Turbopack

## 📋 Requisitos

### Opción 1: Docker (Recomendado)
- Docker Engine 20.10+
- Docker Compose 2.0+

### Opción 2: Node.js Directo
- Node.js 18+ (recomendado 20.x LTS)
- npm 9+ o yarn 1.22+

## 🚀 Instalación y Ejecución

### 🐳 Con Docker (Recomendado)

#### Inicio Rápido
```bash
# Clonar repositorio
git clone <repository-url>
cd pmtc

# Ejecutar en modo desarrollo
./docker-scripts.sh dev
```

#### Comandos Disponibles
```bash
# Desarrollo (puerto 3000)
./docker-scripts.sh dev

# Producción (puerto 3001)
./docker-scripts.sh prod

# Construir imagen
./docker-scripts.sh build

# Ver estado
./docker-scripts.sh status

# Ver logs
./docker-scripts.sh logs

# Limpiar todo
./docker-scripts.sh clean
```

#### Acceso a la Aplicación
- **Desarrollo**: http://localhost:3000
- **Producción**: http://localhost:3001

### 📦 Con Node.js Directo

#### Instalación Automática
```bash
# Clonar repositorio
git clone <repository-url>
cd pmtc

# Ejecutar script de configuración
./setup-pmtc.sh
```

#### Instalación Manual
```bash
# Clonar repositorio
git clone <repository-url>
cd pmtc

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

#### Acceso a la Aplicación
- **Desarrollo**: http://localhost:3000

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (BFF)
│   │   ├── psychologists/ # Endpoint psicólogos
│   │   ├── specialties/   # Endpoint especialidades
│   │   └── sessions/      # Endpoint sesiones
│   └── page.tsx           # Página principal
├── components/             # Componentes React
│   ├── PsychologistCard.tsx   # Tarjeta de psicólogo
│   ├── BookingModal.tsx       # Modal de agendado
│   ├── MySessions.tsx         # Mis sesiones
│   ├── SessionManager.tsx     # Gestión avanzada
│   └── SessionStats.tsx       # Estadísticas
├── data/                   # Datos mock
│   └── mockData.ts         # Psicólogos, especialidades, sesiones
├── hooks/                  # Hooks personalizados
│   └── useSessions.ts      # Gestión de sesiones
├── types/                  # Tipos TypeScript
│   └── index.ts            # Interfaces y tipos
└── utils/                  # Utilidades
    └── __tests__/          # Tests
```

## 🔧 Configuración

### Variables de Entorno
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Configurar variables
NODE_ENV=development
PORT=3000
```

### Configuración de Docker
- **Dockerfile**: Imagen de producción optimizada
- **Dockerfile.dev**: Imagen de desarrollo con hot reload
- **docker-compose.yml**: Orquestación de servicios
- **.dockerignore**: Archivos excluidos de la imagen

## 📱 Uso de la Aplicación

### 1. Explorar Psicólogos
- Ver listado de psicólogos disponibles
- Filtrar por especialidad
- Filtrar por modalidad (online/presencial)
- Ver modalidades disponibles en cada tarjeta

### 2. Ver Disponibilidad
- Hacer clic en "Ver disponibilidad"
- Filtrar horarios por modalidad
- Ver horarios específicos para online o presencial

### 3. Agendar Sesión
- Seleccionar psicólogo
- Elegir modalidad (online/presencial)
- Seleccionar fecha y horario
- Elegir especialidad
- Confirmar reserva

### 4. Gestionar Sesiones
- Ver sesiones agendadas
- Cancelar o completar sesiones
- Estadísticas de sesiones
- Exportar/importar datos

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests
```
src/utils/__tests__/
├── dateUtils.test.ts       # Tests de utilidades de fecha
└── ...                     # Otros tests
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
# Construir
npm run build

# Ejecutar
npm start
```

### Docker
```bash
# Construir imagen
./docker-scripts.sh build

# Ejecutar en producción
./docker-scripts.sh prod
```

## 📊 Estado del Proyecto

### ✅ Implementado
- [x] Estructura de datos con modalidades
- [x] Filtrado por especialidad y modalidad
- [x] Interfaz de usuario para modalidades
- [x] Flujo de reserva con selección de modalidad
- [x] Horarios diferenciados por modalidad
- [x] API actualizada para modalidades
- [x] Configuración Docker completa

### 🔄 En Progreso
- [ ] Tests unitarios para nuevas funcionalidades
- [ ] Optimizaciones de performance
- [ ] Mejoras de accesibilidad

### 🚀 Próximas Funcionalidades
- [ ] Integración con sistemas de videollamadas
- [ ] Gestión de ubicaciones para sesiones presenciales
- [ ] Notificaciones diferenciadas por modalidad
- [ ] Sistema de pagos integrado

## 🔍 Troubleshooting

### Problemas Comunes

#### Docker
- **Puerto ya en uso**: `./docker-scripts.sh stop`
- **Problemas de permisos**: `chmod +x docker-scripts.sh`
- **Imagen corrupta**: `./docker-scripts.sh clean`

#### Node.js
- **Dependencias**: `rm -rf node_modules && npm install`
- **Puerto ocupado**: `npm run dev -- -p 3001`
- **Build fallido**: `npm run build`

## 📚 Documentación

- **[DECISIONES.md](DECISIONES.md)**: Decisiones técnicas del proyecto
- **[DOCKER.md](DOCKER.md)**: Guía completa de Docker
- **[DOCKER-WSL2-SETUP.md](DOCKER-WSL2-SETUP.md)**: Configuración Docker + WSL2
- **[SETUP-ALTERNATIVE.md](SETUP-ALTERNATIVE.md)**: Configuración sin Docker
- **[TESTING.md](TESTING.md)**: Guía de testing

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: Crear un issue en GitHub
- **Documentación**: Revisar archivos de documentación
- **Docker**: Ver `DOCKER.md` y `DOCKER-WSL2-SETUP.md`
- **Alternativas**: Ver `SETUP-ALTERNATIVE.md`

---

*Desarrollado con ❤️ para mejorar la gestión de sesiones psicológicas*
