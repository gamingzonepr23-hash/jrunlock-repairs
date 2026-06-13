# Conectar JRUnlock&Repairs a Firebase

## 1. Crear proyecto

1. Entra a <https://console.firebase.google.com>.
2. Crea un proyecto.
3. Agrega una app Web.
4. Copia el objeto `firebaseConfig`.

## 2. Pegar configuracion

Abre `firebase-config.js` y cambia los valores:

```js
window.JR_FIREBASE_CONFIG = {
  enabled: true,
  apiKey: "TU_API_KEY_REAL",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

`enabled` debe quedar en `true`.

## 3. Activar Authentication

En Firebase Console:

1. Ve a **Authentication**.
2. Abre **Sign-in method**.
3. Activa **Email/Password**.

## 4. Activar Firestore

1. Ve a **Firestore Database**.
2. Crea la base de datos.
3. Usa modo de produccion cuando ya tengas reglas.

Colecciones usadas:

- `users`
- `courses`
- `purchases`
- `tasks`
- `submissions`
- `coupons`

## 5. Activar Storage

1. Ve a **Storage**.
2. Crea el bucket.
3. Los documentos de tareas se suben en la carpeta `tasks/`.
4. Los trabajos entregados por alumnos se suben en la carpeta `submissions/`.

## Nota

Con Firebase activo, las contrasenas las guarda Firebase Authentication de forma segura. La app guarda en Firestore los perfiles, cursos, compras, tareas, trabajos entregados y cupones, pero no guarda contrasenas en texto.
