# 🧠 MoCA Platform (Evaluación Cognitiva Montreal Digital)

Una plataforma web moderna y segura para la administración digital del test MoCA (Montreal Cognitive Assessment). Esta herramienta permite a profesionales de la salud evaluar funciones cognitivas de pacientes mediante una interfaz interactiva y guiada.

## 📋 Descripción del Proyecto
El sistema digitaliza los 8 módulos estándar del test MoCA, ofreciendo:
*   **Guía Automatizada**: Instrucciones mediante voz (Text-to-Speech) y texto en pantalla.
*   **Captura de Datos**: Dibujos en canvas (Visoespacial), reconocimiento de voz (Memoria/Atención/Lenguaje) y formularios clásicos.
*   **Evaluación Inteligente**:
    *   **IA (Visión)**: Calificación automática de dibujos (Cubo, Reloj, TMT-B) usando OpenAI Vision.
    *   **Lógica Determinista**: Validación automática de fechas, nombres y recuerdos.
    *   **Scoring Híbrido**: Interfaz para que el evaluador valide manualmente secciones subjetivas.
*   **Reporte Final**: Cálculo automático del puntaje total (con corrección por escolaridad) y generación de veredicto clínico.

## 🛠️ Tecnologías Utilizadas

### Frontend (`/frontend`)
*   **React + TypeScript**: Framework principal.
*   **Vite**: Build tool rápido.
*   **Tailwind CSS**: Diseño y estilos (UI médica limpia).
*   **Web Speech API**: Reconocimiento de voz (STT) y síntesis de voz (TTS) nativos del navegador.
*   **React Router**: Navegación entre módulos.
*   **Axios**: Comunicación HTTP con el backend.

### Backend (`/backend`)
*   **NestJS**: Framework de servidor robusto y escalable.
*   **TypeScript**: Tipado estático.
*   **OpenAI API**: Integración con modelos GPT-4o para análisis de imágenes y texto complejo.

### Shared (`/shared`)
*   **TypeScript Library**: Tipos compartidos (DTOs, Interfaces) para asegurar coherencia entre front y back.

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos
*   **Node.js** (v16 o superior)
*   **npm**
*   Una **API Key de OpenAI** (para las funciones de IA).

### Paso 1: Configurar la Librería Compartida (`shared`)
Esta librería contiene los tipos de datos que usan tanto el frontend como el backend.

```bash
cd shared
npm install
npm run build
```

### Paso 2: Configurar el Backend (`backend`)

1.  Navega al directorio:
    ```bash
    cd ../backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de `backend` y añade tu clave de OpenAI:
    ```env
    OPENAI_API_KEY=sk-TU_CLAVE_AQUI
    PORT=3000
    ```
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run start:dev
    ```
    *El backend correrá en `http://localhost:3000`*

### Paso 3: Configurar el Frontend (`frontend`)

1.  Abre una nueva terminal y navega al directorio:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia la aplicación:
    ```bash
    npm run dev
    ```
    *El frontend correrá típicamente en `http://localhost:5173`*

---

## 🧪 Cómo Usar la Plataforma

1.  Abre tu navegador (Chrome/Edge recomendados para mejor soporte de voz) en `http://localhost:5173`.
2.  En la página de inicio, haz clic en **"Iniciar Evaluación"**.
3.  Sigue el flujo de los 8 módulos:
    1.  **Visoespacial**: Dibuja en pantalla (Tablet/Mouse).
    2.  **Identificación**: Nombra los animales.
    3.  **Memoria**: Escucha y recuerda palabras.
    4.  **Atención**: Repite series numéricas y detecta letras.
    5.  **Lenguaje**: Repite frases y fluidez verbal.
    6.  **Abstracción**: Relaciona conceptos.
    7.  **Recuerdo Diferido**: Recupera palabras memorizadas.
    8.  **Orientación**: Indica fecha y lugar.
4.  Al finalizar, verás el **Reporte Clínico** con tu puntaje total y veredicto.

## 📂 Estructura del Proyecto

```
moca-platform/
├── backend/            # API NestJS
│   ├── src/
│   │   ├── visuospatial/   # Módulo con IA Vision
│   │   ├── orientation/    # Lógica de fechas
│   │   └── ...
├── frontend/           # App React
│   ├── src/
│   │   ├── components/ui/  # Botones, Canvas, Cards
│   │   ├── pages/          # Vistas de cada test
│   │   └── hooks/          # useTTS (Texto a Voz)
├── shared/             # Librería de Tipos (DTOs)
└── README.md           # Documentación
```

---
*Desarrollado para fines demostrativos y académicos.*
