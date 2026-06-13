# JRUnlock&Repairs

Pagina web editable para cursos de reparacion de PC y celulares.

## Que incluye

- Login simple con perfiles de alumno, instructor y administrador.
- Panel para subir cursos desde el navegador.
- Tienda de cursos con compra por WhatsApp: `939-206-3234`.
- Certificados imprimibles o guardables como PDF.
- Guia dentro de la pagina para publicar gratis en GitHub Pages.

## Como editar

- Cambia textos principales en `index.html`.
- Cambia colores, tamanos y diseno en `styles.css`.
- Cambia cursos iniciales y funcionamiento en `app.js`.
- Cambia el visual principal en `assets/repair-hero.svg`.

## Como abrir en tu computadora

Abre `index.html` con doble clic en tu navegador.

## Publicar gratis en GitHub Pages

1. Entra a <https://github.com> y crea una cuenta gratis.
2. Crea un repositorio nuevo, por ejemplo `jrunlock-repairs`.
3. Sube `index.html`, `styles.css`, `app.js`, `README.md` y la carpeta `assets`.
4. En el repositorio entra a `Settings`.
5. Abre `Pages`.
6. En `Build and deployment`, selecciona `Deploy from a branch`.
7. Elige la rama `main` y la carpeta `/root`.
8. Guarda y espera unos minutos.
9. GitHub mostrara el enlace publico de tu pagina.

## Importante

Esta version funciona sin servidor, ideal para GitHub Pages gratis. El login, cursos agregados y datos se guardan en el navegador usando `localStorage`; no es un sistema privado real con base de datos. Para vender con pago automatico, usuarios reales y certificados verificables, el siguiente paso seria conectarlo con un backend como Firebase, Supabase o WordPress.
