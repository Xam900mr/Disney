# 🎬 Disney — Laboratorio de Sistemas de Integración Ubicuos 

Aplicación web de streaming inspirada en plataformas como Netflix, desarrollada como proyecto colaborativo utilizando **React, JavaScript, Node.js, MongoDB y una API propia**.

La aplicación está enfocada en contenido de **Disney**, permitiendo a los usuarios explorar películas y series desde una interfaz web y utilizando diferentes servicios para gestionar la información, autenticación y comunicación entre el frontend y el backend.

El proyecto fue desarrollado con un enfoque **full-stack**, por lo que integra tanto la interfaz de usuario como la lógica del servidor, la base de datos y servicios externos.

---

## 🚀 Características

### 🎥 Catálogo de contenido

La aplicación permite visualizar un catálogo de películas y series, organizado para facilitar la exploración del contenido disponible.

### 🔐 Inicio de sesión con Google

Se implementó autenticación mediante **Google**, permitiendo a los usuarios iniciar sesión utilizando su cuenta de Google en lugar de crear manualmente un usuario y contraseña.

### 🔌 API

El proyecto cuenta con una API encargada de proporcionar y gestionar la información utilizada por la aplicación.

Esta arquitectura permite separar la interfaz del usuario de la lógica y los datos del sistema.

### 🗄️ Base de datos

Se utilizó **MongoDB** para almacenar la información necesaria para el funcionamiento de la aplicación.

### ⚛️ Frontend

La interfaz fue desarrollada utilizando **React y JavaScript**, creando una aplicación web dinámica e interactiva.

### 🖥️ Backend

El servidor fue desarrollado utilizando **Node.js**, encargado de procesar las solicitudes del frontend y comunicarse con la base de datos y los diferentes servicios utilizados por la aplicación.

---

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura donde diferentes componentes trabajan conjuntamente:

```text
                 ┌──────────────────┐
                 │      Usuario     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     React        │
                 │    Frontend      │
                 └────────┬─────────┘
                          │
                       HTTP/API
                          │
                          ▼
                 ┌──────────────────┐
                 │     Node.js      │
                 │     Backend      │
                 └────────┬─────────┘
                          │
                 ┌────────┴─────────┐
                 ▼                  ▼
        ┌─────────────────┐  ┌───────────────┐
        │    MongoDB      │  │ Servicios/API │
        │    Base de      │  │    externos   │
        │     datos       │  │               │
        └─────────────────┘  └───────────────┘
```

Esta estructura permite mantener separadas las responsabilidades del frontend, backend y almacenamiento de información.

---

## 🛠️ Tecnologías utilizadas

### Frontend

* React
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* API REST

### Base de datos

* MongoDB

### Autenticación

* Google Sign-In

### Herramientas

* Git
* GitHub
* npm

---

## 📂 Estructura del proyecto

```text
Disney/
│
├── frontend/
│   └── Aplicación React
│
├── backend/
│   └── Servidor Node.js
│
├── api/
│   └── Endpoints y lógica de la API
│
├── ...
│
└── README.md
```

> La estructura anterior es representativa. Consulta las carpetas del proyecto para conocer la organización específica de cada componente.

---

## ▶️ Instalación y ejecución

### Requisitos

Antes de ejecutar el proyecto es necesario contar con:

* Node.js
* npm
* MongoDB
* Una aplicación/configuración de Google para la autenticación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd Disney
```

### 2. Instalar dependencias

Instala las dependencias del frontend y backend desde sus respectivas carpetas:

```bash
npm install
```

### 3. Configurar variables de entorno

El proyecto requiere configurar las credenciales y parámetros necesarios para la conexión con MongoDB y la autenticación mediante Google.

Estos valores deben almacenarse en un archivo `.env` y **no deben subirse al repositorio**.

Ejemplo:

```env
MONGO_URI=tu_conexion_mongodb
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
```

Los nombres exactos de las variables deben coincidir con los utilizados por la aplicación.

### 4. Ejecutar el proyecto

Inicia el servidor y posteriormente la aplicación frontend utilizando los comandos definidos en los respectivos `package.json`.

Una vez iniciados los servicios, abre la dirección local indicada por la aplicación en el navegador.

---

## 💡 ¿Qué demuestra este proyecto?

Este proyecto representa una experiencia práctica en el desarrollo de una aplicación **full-stack**, integrando diferentes tecnologías para construir un sistema funcional de principio a fin.

Durante su desarrollo se trabajó con:

* Diseño de interfaces web.
* Desarrollo de componentes con React.
* Comunicación entre frontend y backend.
* Creación y consumo de APIs.
* Persistencia de información con MongoDB.
* Desarrollo de servidores con Node.js.
* Integración de servicios externos.
* Implementación de autenticación mediante Google.
* Trabajo colaborativo utilizando Git y GitHub.

El proyecto permitió integrar conocimientos de desarrollo frontend, backend y bases de datos dentro de una misma aplicación.

---

## 👥 Autores

**Amparo Natividad Mendoza Vasquez**

**Maximiliano Moreno**
