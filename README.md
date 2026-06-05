# 🪐 Flourish - Santuario Digital de Hábitos & Transformación Personal

**Flourish** es una plataforma web interactiva y gamificada diseñada para la autotransformación, la construcción de hábitos atómicos y la eliminación de comportamientos no deseados. A diferencia de las aplicaciones de seguimiento tradicionales de tipo "lista de verificación", Habitum integra mecánicas de videojuegos y diseño de entornos visuales para transformar el desarrollo personal en una experiencia inmersiva y tangible.

---

## ✨ El Valor Diferencial (¿Por qué destaca este proyecto?)

* **Metodología de Hábitos Atómicos**: El diseño del flujo de creación está estrictamente alineado con las leyes de comportamiento propuestas por James Clear. Al crear un hábito positivo se implementan las 4 leyes (Señal/Hacerlo Obvio, Anhelo/Hacerlo Atractivo, Acción/Hacerlo Sencillo y Recompensa/Hacerlo Satisfactorio) y las inversas para los hábitos negativos a eliminar.
* **Santuario Digital Isométrico**: Cada hábito positivo forjado desbloquea un elemento físico en tu habitación digital. Cumplir con tus metas diarias otorga experiencia (XP) al objeto, haciéndolo evolucionar visiblemente a través de 4 fases de crecimiento (e.g. un libro simple se convierte en un escritorio intelectual avanzado; una pesa individual evoluciona en un gimnasio personal completo).
* **Diseño e Interacción Isométrica**: Cuenta con un editor interactivo en tiempo real que superpone una rejilla isométrica 5x5 sobre la habitación para reubicar libremente los objetos en el espacio, brindando una experiencia táctil y altamente personalizable.
* **Seguimiento Basado en Identidad**: La aplicación fomenta el enfoque "Identity-First" para que los hábitos estén siempre vinculados a identidades específicas (¿en quién te quieres convertir?), calculando dinámicamente el *momentum* y nivel de cada identidad en base a tus disciplinas diarias.

---

## 🛠️ Detalles Tecnológicos & Arquitectura

El proyecto está diseñado bajo una arquitectura limpia y moderna tipo monorepositorio utilizando tecnologías de última generación:

### Frontend (Cliente)
* **Vite & React 19 (TypeScript)**: Renderizado ultrarrápido y tipado estricto para garantizar la estabilidad del software.
* **TanStack Router**: Enrutamiento moderno basado en archivos con tipado seguro al 100% y carga perezosa de rutas.
* **Framer Motion**: Micro-animaciones fluidas para transiciones, modales y el renderizado flotante de los sprites en la habitación.
* **TailwindCSS**: Diseño visual responsivo, limpio y de estética premium utilizando una paleta de colores cohesiva y adaptada para modo oscuro.
* **Pipeline de Assets Dinámicos**: Implementación personalizada de `import.meta.glob` de Vite en combinación con estrechamiento de tipos en TypeScript a nivel de runtime para auto-detectar carpetas de nuevos sprites e integrarlas en la interfaz sin tocar código fuente.

### Backend (Servidor)
* **Express & Node.js (TypeScript)**: API REST estructurada con modularidad en controladores y enrutadores.
* **Prisma ORM**: Modelado relacional robusto que automatiza las migraciones y optimiza las consultas SQL.
* **PostgreSQL**: Motor de base de datos relacional para gestionar la persistencia y asegurar integridad referencial en cascada para identidades, hábitos, registros diarios y elementos.
* **JSON Web Tokens (JWT) & Bcrypt**: Autenticación segura y hash de contraseñas para resguardar la privacidad del usuario.

---

## 📂 Estructura del Proyecto

```text
├── client/                  # Frontend de la aplicación (Vite + React)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables (Habitación, widgets, etc.)
│   │   ├── routes/          # Estructura de rutas (TanStack Router)
│   │   ├── utils/           # Registro dinámico de assets y utilidades
│   │   └── services/        # Clientes de servicios API
│   └── public/              # Assets estáticos globales
└── server/                  # Backend de la aplicación (Node.js + Express)
    ├── src/
    │   ├── controllers/     # Lógica de controladores de negocio
    │   ├── routes/          # Rutas expuestas de la API
    │   └── lib/             # Instancias compartidas (Prisma client)
    └── prisma/              # Esquema relacional de base de datos
```

---

## 🚀 Guía de Inicio Rápido (Local)

### Requisitos Previos
* Node.js (v18 o superior)
* PostgreSQL
* Administrador de paquetes `pnpm`

### Paso 1: Configurar el Servidor
1. Navega a la carpeta `/server` y crea un archivo `.env` basado en `.env.example`:
   ```bash
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/habitum_db?schema=public"
   PORT=3000
   JWT_SECRET="tu_clave_secreta_super_segura"
   ```
2. Instala dependencias y corre las migraciones de Prisma:
   ```bash
   pnpm install
   npx prisma migrate dev
   ```
3. Ejecuta el servidor en desarrollo:
   ```bash
   pnpm run dev
   ```

### Paso 2: Configurar el Cliente
1. Navega a la carpeta `/client` y crea tu archivo `.env`:
   ```bash
   VITE_API_URL="http://localhost:3000"
   ```
2. Instala dependencias y arranca el entorno de desarrollo:
   ```bash
   pnpm install
   pnpm run dev
   ```
3. Abre tu navegador en [http://localhost:5173](http://localhost:5173).
