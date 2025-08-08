# Gestión de Sesiones Psicológicas

Una aplicación web para gestionar sesiones psicológicas online, permitiendo a los pacientes ver psicólogos disponibles, filtrar por especialidad y agendar sesiones.

## 🚀 Características

- **Listado de psicólogos** con información detallada
- **Filtrado por especialidad** (fobias, relaciones personales, depresión, etc.)
- **Visualización de disponibilidad** semanal
- **Agendado de sesiones** con confirmación
- **Interfaz responsive** y mobile-friendly
- **BFF (Backend for Frontend)** con Next.js API routes

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 con TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Contenedorización**: Docker
- **Desarrollo**: Hot reload con Docker Compose

## 📋 Requisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

## 🚀 Instalación y Ejecución

### Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd pmtc
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Desarrollo Local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/                    # API Routes (BFF)
│   │   ├── psychologists/      # Endpoint psicólogos
│   │   ├── specialties/        # Endpoint especialidades
│   │   └── sessions/          # Endpoint sesiones
│   └── page.tsx               # Página principal
├── components/                 # Componentes React
│   ├── PsychologistCard.tsx   # Tarjeta de psicólogo
│   └── BookingModal.tsx       # Modal de agendado
├── data/                      # Datos mock
│   └── mockData.ts           # Datos de prueba
└── types/                     # Tipos TypeScript
    └── index.ts              # Definiciones de tipos
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

- [x] Listado de psicólogos con información completa
- [x] Filtrado por especialidad
- [x] Visualización de disponibilidad semanal
- [x] Agendado de sesiones con validaciones
- [x] Interfaz responsive y moderna
- [x] BFF con API routes
- [x] Manejo de errores y estados de carga
- [x] Docker para desarrollo

### 🔄 En Desarrollo

- [ ] Persistencia en localStorage
- [ ] Tests unitarios
- [ ] Calendario visual mejorado
- [ ] Notificaciones push

## 📊 API Endpoints

### GET /api/psychologists
Obtiene la lista de psicólogos disponibles.

**Query Parameters:**
- `specialty` (opcional): ID de especialidad para filtrar

**Response:**
```json
[
  {
    "id": "1",
    "name": "Dra. María González",
    "specialties": [...],
    "availability": [...],
    "timezone": "America/Argentina/Buenos_Aires"
  }
]
```

### GET /api/specialties
Obtiene todas las especialidades disponibles.

### POST /api/sessions
Agenda una nueva sesión.

**Body:**
```json
{
  "psychologistId": "1",
  "patientName": "Juan Pérez",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "specialty": "1"
}
```

## 🎨 Decisiones Técnicas

### Arquitectura
- **BFF Pattern**: Next.js API routes como backend para frontend
- **TypeScript**: Tipado estático para mejor desarrollo
- **Componentes modulares**: Reutilizables y mantenibles

### UX/UI
- **Diseño responsive**: Mobile-first approach
- **Estados de carga**: Feedback visual para el usuario
- **Validaciones**: En tiempo real y en el servidor
- **Accesibilidad**: Contraste y navegación por teclado

### Datos
- **Mock data**: Para desarrollo y demostración
- **Estructura escalable**: Fácil migración a base de datos real
- **Validaciones**: En frontend y backend

## 🔧 Configuración de Desarrollo

### Variables de Entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Docker Production
```bash
docker build -t pmtc-app .
docker run -p 3000:3000 pmtc-app
```

## 📝 Notas de Desarrollo

### Asunciones
- Sesiones online únicamente
- Horarios en zona horaria local
- Psicólogos con disponibilidad fija semanal
- Validaciones básicas de disponibilidad

### Trade-offs
- **Simplicidad vs Complejidad**: Implementación básica pero funcional
- **Mock data vs DB**: Datos estáticos para MVP
- **UI vs UX**: Interfaz simple pero efectiva

### Mejoras Futuras
- Base de datos real (PostgreSQL/MongoDB)
- Autenticación de usuarios
- Sistema de notificaciones
- Calendario visual avanzado
- Tests automatizados
- CI/CD pipeline

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.
