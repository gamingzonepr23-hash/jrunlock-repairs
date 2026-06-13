(function () {
  const config = window.JR_FIREBASE_CONFIG || {};
  const enabled = Boolean(config.enabled && config.apiKey && config.apiKey !== "TU_API_KEY" && window.firebase);
  let app = null;
  let auth = null;
  let db = null;
  let storage = null;

  if (enabled) {
    app = firebase.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });
    auth = firebase.auth(app);
    db = firebase.firestore(app);
    storage = firebase.storage(app);
  }

  function isEnabled() {
    return enabled;
  }

  async function signUp(email, password) {
    if (!enabled) return null;
    const credential = await auth.createUserWithEmailAndPassword(email, password);
    return credential.user;
  }

  async function signIn(email, password) {
    if (!enabled) return null;
    const credential = await auth.signInWithEmailAndPassword(email, password);
    return credential.user;
  }

  async function signOut() {
    if (!enabled) return;
    await auth.signOut();
  }

  async function saveDocument(collectionName, id, data) {
    if (!enabled) return;
    await db.collection(collectionName).doc(id).set(data, { merge: true });
  }

  async function deleteDocument(collectionName, id) {
    if (!enabled) return;
    await db.collection(collectionName).doc(id).delete();
  }

  async function saveCollection(collectionName, items, idField) {
    if (!enabled) return;
    const batch = db.batch();
    items.forEach((item, index) => {
      const id = String(item[idField] || item.id || index);
      batch.set(db.collection(collectionName).doc(id), item, { merge: true });
    });
    await batch.commit();
  }

  async function loadCollection(collectionName) {
    if (!enabled) return [];
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), firebaseId: doc.id }));
  }

  async function uploadFile(path, file) {
    if (!enabled || !file) return null;
    const ref = storage.ref().child(path);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  }

  window.JRFirebase = {
    isEnabled,
    signUp,
    signIn,
    signOut,
    saveDocument,
    deleteDocument,
    saveCollection,
    loadCollection,
    uploadFile
  };
})();
