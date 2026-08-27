# 🔐 Password Generator

**DEV.F - Módulo I: Introducción al DOM**

Generador de contraseñas seguras basado en el reto de [Frontend Mentor - Password Generator App](https://www.frontendmentor.io/challenges/password-generator-app-Mr8CLycqjh). Proyecto para practicar **manipulación del DOM**, **eventos** y **HTML/CSS**.

## 🌐 Demo en vivo

👉 [Ver en GitHub Pages](https://don-riko.github.io/DEV.F-EXT_FRONTEND-ModuloI_Generador-de-Passwords/)

## 🎯 Esencia del proyecto (requisitos)

- ✅ Maquetación del formulario a partir del diseño de referencia.
- ✅ Genera una contraseña **de más de 8 caracteres** usando **símbolos, letras y números**.
- ✅ Contraseña **diferente** en cada generación (aleatoriedad criptográfica).
- ✅ Varias **opciones configurables**.

## ✨ Opciones y plus implementados

- 🎚️ **Slider de longitud** (4–32 caracteres) con relleno dinámico y número en vivo
- ☑️ **4 tipos de caracteres**: mayúsculas, minúsculas, números y símbolos
- 🔒 **Indicador de fuerza tipo candado** (a la derecha del campo), con:
  - 💔 **Weak** → candado roto (rojo)
  - 🔓 **Medium** → candado abierto (naranja/amarillo)
  - 🔒 **Strong** → candado cerrado (verde)
  - **Degradado de color rojo → verde** y **transición animada**
- 📊 Barras de fuerza (estilo Frontend Mentor) sincronizadas con el candado
- 📋 **Copiar al portapapeles** con feedback "Copied!"
- ⚙️ Regeneración automática al cambiar opciones y validación (mínimo un tipo)
- 🔐 Aleatoriedad con `crypto.getRandomValues` + garantía de al menos un carácter de cada tipo activo
- 🎨 Diseño responsive fiel al mockup (tema oscuro, verde neón)

## 📂 Estructura de archivos

```
generador-de-passwords/
├── index.html        # Estructura (campo + candado + slider + opciones + fuerza)
├── css/
│   └── styles.css    # Estilos, slider, candado animado y responsividad
└── js/
    └── app.js        # Lógica del DOM: generación, fuerza, copiar, validación
```

## 🧠 Conceptos del DOM practicados

- Selección de elementos (`getElementById`)
- Manejo de eventos (`click`, `input`, `change`)
- Modificación dinámica de contenido y **clases** (estados del candado y barras)
- API del portapapeles (`navigator.clipboard`) con fallback

## ▶️ Cómo ejecutar

Abre `index.html` en tu navegador o visita la [demo en GitHub Pages](https://don-riko.github.io/DEV.F-EXT_FRONTEND-ModuloI_Generador-de-Passwords/).

## 🙏 Créditos

Diseño basado en el reto [Password Generator App](https://www.frontendmentor.io/challenges/password-generator-app-Mr8CLycqjh) de Frontend Mentor.
