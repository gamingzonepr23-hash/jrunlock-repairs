const whatsappNumber = "19392063234";
const adminAccessCode = "JR939";
const storageKeys = {
  profile: "jr_profile",
  courses: "jr_courses",
  certificate: "jr_certificate",
  tasks: "jr_tasks",
  users: "jr_users",
  purchases: "jr_purchases",
  unlockedCourses: "jr_unlocked_courses",
  submissions: "jr_submissions",
  coupons: "jr_coupons"
};

const starterCourses = [
  {
    title: "Reparacion de celulares desde cero",
    category: "Celulares",
    price: "Desde $250",
    link: "",
    image: "",
    certificateCode: "CEL250",
    description: "Diagnostico, cambio de pantallas, bateria, conectores de carga y pruebas basicas."
  },
  {
    title: "Mantenimiento y reparacion de PC",
    category: "Computadoras PC",
    price: "$500",
    link: "",
    image: "",
    certificateCode: "PC500",
    description: "Limpieza, armado, instalacion de sistema, drivers, discos, RAM y fallas comunes."
  },
  {
    title: "Unlock y software movil",
    category: "Unlock y software",
    price: "Gratis",
    link: "",
    image: "",
    certificateCode: "UNLOCK939",
    description: "Conceptos iniciales de flasheo, respaldo, herramientas y cuidados antes de desbloquear."
  }
];

const $ = (selector) => document.querySelector(selector);
const page = document.body.dataset.page || (location.pathname.toLowerCase().includes("admin") ? "admin" : "home");

function firebaseEnabled() {
  return Boolean(window.JRFirebase && window.JRFirebase.isEnabled());
}

function saveRemoteCollection(collectionName, items, idField) {
  if (!firebaseEnabled()) return;
  window.JRFirebase.saveCollection(collectionName, items, idField).catch((error) => {
    console.warn(`No se pudo sincronizar ${collectionName} con Firebase`, error);
  });
}

function getCourses() {
  const saved = localStorage.getItem(storageKeys.courses);
  if (!saved) {
    localStorage.setItem(storageKeys.courses, JSON.stringify(starterCourses));
    return starterCourses;
  }
  const courses = JSON.parse(saved);
  let changed = false;
  courses.forEach((course) => {
    if (course.title === "Reparacion de celulares desde cero" && course.price !== "Desde $250") {
      course.price = "Desde $250";
      changed = true;
    }
    if (course.title === "Reparacion de celulares desde cero" && !course.certificateCode) {
      course.certificateCode = "CEL250";
      changed = true;
    }
    if (course.image === undefined) {
      course.image = "";
      changed = true;
    }
    if (course.title === "Mantenimiento y reparacion de PC" && course.price !== "$500") {
      course.price = "$500";
      changed = true;
    }
    if (course.title === "Mantenimiento y reparacion de PC" && !course.certificateCode) {
      course.certificateCode = "PC500";
      changed = true;
    }
    if (course.title === "Unlock y software movil" && !course.certificateCode) {
      course.certificateCode = "UNLOCK939";
      changed = true;
    }
  });
  if (changed) saveCourses(courses);
  return courses;
}

function saveCourses(courses) {
  localStorage.setItem(storageKeys.courses, JSON.stringify(courses));
  saveRemoteCollection("courses", courses, "title");
}

function getProfile() {
  const saved = localStorage.getItem(storageKeys.profile);
  return saved ? JSON.parse(saved) : null;
}

function setProfile(profile) {
  localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
}

function getUsers() {
  const saved = localStorage.getItem(storageKeys.users);
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem(storageKeys.users, JSON.stringify(users));
  saveRemoteCollection("users", users, "email");
}

function getCurrentUser() {
  const profile = getProfile();
  if (!profile) return null;
  return getUsers().find((user) => user.email === profile.email) || null;
}

function updateCurrentUser(updates) {
  const profile = getProfile();
  if (!profile) return null;
  const users = getUsers();
  const index = users.findIndex((user) => user.email === profile.email);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  const nextProfile = {
    name: users[index].name,
    email: users[index].email,
    role: users[index].role
  };
  setProfile(nextProfile);
  return users[index];
}

function getPurchases() {
  const saved = localStorage.getItem(storageKeys.purchases);
  return saved ? JSON.parse(saved) : [];
}

function savePurchases(purchases) {
  localStorage.setItem(storageKeys.purchases, JSON.stringify(purchases));
  saveRemoteCollection("purchases", purchases, "id");
}

function getUnlockedCourses() {
  const saved = localStorage.getItem(storageKeys.unlockedCourses);
  return saved ? JSON.parse(saved) : {};
}

function saveUnlockedCourses(unlocked) {
  localStorage.setItem(storageKeys.unlockedCourses, JSON.stringify(unlocked));
}

function courseKey(course) {
  return normalizeCode(course.title);
}

function isCourseUnlocked(course) {
  const profile = getProfile();
  if (!profile || !course) return false;
  const unlocked = getUnlockedCourses();
  return Boolean(unlocked[profile.email]?.includes(courseKey(course)));
}

function unlockCourse(course) {
  const profile = getProfile();
  if (!profile || !course) return;
  const unlocked = getUnlockedCourses();
  const key = courseKey(course);
  const userCourses = unlocked[profile.email] || [];
  if (!userCourses.includes(key)) userCourses.push(key);
  unlocked[profile.email] = userCourses;
  saveUnlockedCourses(unlocked);
}

function getTasks() {
  const saved = localStorage.getItem(storageKeys.tasks);
  const tasks = saved ? JSON.parse(saved) : [];
  let changed = false;
  tasks.forEach((task, index) => {
    if (!task.id) {
      task.id = `TSK-${Date.now()}-${index}`;
      changed = true;
    }
  });
  if (changed) saveTasks(tasks);
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
  saveRemoteCollection("tasks", tasks, "id");
}

function getSubmissions() {
  const saved = localStorage.getItem(storageKeys.submissions);
  return saved ? JSON.parse(saved) : [];
}

function saveSubmissions(submissions) {
  localStorage.setItem(storageKeys.submissions, JSON.stringify(submissions));
  saveRemoteCollection("submissions", submissions, "id");
}

function getCoupons() {
  const saved = localStorage.getItem(storageKeys.coupons);
  return saved ? JSON.parse(saved) : [];
}

function saveCoupons(coupons) {
  localStorage.setItem(storageKeys.coupons, JSON.stringify(coupons));
  saveRemoteCollection("coupons", coupons, "id");
}

function syncCouponsForCourse(oldCourse, newCourse) {
  if (!oldCourse || !newCourse) return;
  const oldKey = courseKey(oldCourse);
  const coupons = getCoupons();
  let changed = false;
  coupons.forEach((coupon) => {
    if (coupon.courseKey === oldKey || coupon.courseTitle === oldCourse.title) {
      coupon.courseTitle = newCourse.title;
      coupon.courseKey = courseKey(newCourse);
      changed = true;
    }
  });
  if (changed) saveCoupons(coupons);
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "JR";
}

function whatsappLink(course) {
  const text = `Hola JRUnlock&Repairs, quiero informacion para comprar o inscribirme en el curso: ${course.title}. Precio: ${course.price}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function encodePassword(password) {
  return btoa(unescape(encodeURIComponent(password)));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function renderProfile() {
  const profile = getProfile();
  const user = getCurrentUser();
  const empty = $("#profileEmpty");
  const card = $("#profileCard");
  const logout = $("#logoutButton");
  const loginPanel = $(".login-panel");
  const detailsForm = $("#profileDetailsForm");
  const coursesPanel = $("#profileCoursesPanel");
  const assignmentsPanel = $("#profileAssignmentsPanel");
  const profileSummary = $("#profileInfoSummary");
  const adminNav = $("#adminNavLink");
  const tasksNav = $("#tasksNavLink");
  const users = profile ? 1 : 0;

  if ($("#studentCount")) $("#studentCount").textContent = users;
  if (adminNav) {
    adminNav.classList.toggle("hidden", !profile || profile.role !== "Administrador");
  }
  if (tasksNav) {
    tasksNav.classList.toggle("hidden", !profile);
  }

  if (!empty || !card || !logout) return;

  if (!profile) {
    if (loginPanel) loginPanel.classList.remove("hidden");
    empty.classList.remove("hidden");
    card.classList.add("hidden");
    logout.classList.add("hidden");
    if (detailsForm) detailsForm.classList.add("hidden");
    if (coursesPanel) coursesPanel.classList.add("hidden");
    if (assignmentsPanel) assignmentsPanel.classList.add("hidden");
    if (profileSummary) profileSummary.classList.add("hidden");
    return;
  }

  if (loginPanel) loginPanel.classList.add("hidden");
  empty.classList.add("hidden");
  card.classList.remove("hidden");
  logout.classList.remove("hidden");
  if (detailsForm) detailsForm.classList.remove("hidden");
  if (coursesPanel) coursesPanel.classList.remove("hidden");
  if (assignmentsPanel) assignmentsPanel.classList.remove("hidden");
  if (profileSummary) profileSummary.classList.remove("hidden");
  if (user && user.photo) {
    $("#profileInitials").innerHTML = `<img src="${user.photo}" alt="Foto de perfil de ${user.name}">`;
  } else {
    $("#profileInitials").textContent = initials(profile.name);
  }
  $("#profileName").textContent = profile.name;
  $("#profileEmail").textContent = profile.email;
  $("#profileRole").textContent = profile.role;
  if ($("#profilePhoneInput")) $("#profilePhoneInput").value = user?.phone || "";
  if ($("#profileAddressInput")) $("#profileAddressInput").value = user?.address || "";
  if ($("#profilePhoneText")) $("#profilePhoneText").textContent = user?.phone || "Sin telefono";
  if ($("#profileAddressText")) $("#profileAddressText").textContent = user?.address || "Sin direccion";
  renderProfileCourses();
  renderProfileAssignments();
}

function renderProfileCourses() {
  const list = $("#profileCoursesList");
  if (!list) return;
  const profile = getProfile();
  if (!profile) {
    list.innerHTML = "";
    return;
  }
  const purchases = getPurchases().filter((purchase) => purchase.studentEmail === profile.email);
  if (!purchases.length) {
    list.innerHTML = `<div class="empty">Todavia no hay cursos registrados en tu perfil.</div>`;
    return;
  }
  list.innerHTML = purchases.map((purchase) => `
    <div class="mini-item">
      <strong>${purchase.courseTitle}</strong>
      <span>${purchase.coursePrice} - ${purchase.status}</span>
    </div>
  `).join("");
}

function getUnlockedTasksForProfile(profile) {
  if (!profile) return [];
  const courses = getCourses();
  const tasks = getTasks();
  const unlockedKeys = getUnlockedCourses()[profile.email] || [];
  return tasks.filter((task) => {
    const course = courses.find((item) => item.title === task.course);
    return course && unlockedKeys.includes(courseKey(course));
  });
}

function renderProfileAssignments() {
  const list = $("#profileTaskList");
  if (!list) return;
  const profile = getProfile();
  list.innerHTML = "";
  if (!profile) return;
  const visibleTasks = getUnlockedTasksForProfile(profile);
  if (!visibleTasks.length) {
    list.innerHTML = `<div class="empty">Cuando desbloquees un curso con cupon, aqui podras descargar tareas y subir tus trabajos para corregir.</div>`;
    return;
  }
  visibleTasks.forEach((task, index) => list.appendChild(taskCard(task, index, { allowSubmission: true })));
}

async function createOrLoginUser({ name, email, password, role }) {
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = encodePassword(password);
  const existing = users.find((user) => user.email === normalizedEmail);

  if (existing) {
    if (firebaseEnabled()) {
      try {
        await window.JRFirebase.signIn(normalizedEmail, password);
      } catch (error) {
        return { ok: false, message: `Firebase no pudo iniciar sesion: ${error.message}` };
      }
    } else if (existing.passwordHash !== passwordHash) {
      return { ok: false, message: "Contrasena incorrecta para este correo." };
    }
    const profile = {
      name: existing.name,
      email: existing.email,
      role: existing.role
    };
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
    return { ok: true, profile, created: false };
  }

  if (firebaseEnabled()) {
    try {
      await window.JRFirebase.signUp(normalizedEmail, password);
    } catch (error) {
      return { ok: false, message: `Firebase no pudo crear la cuenta: ${error.message}` };
    }
  }

  const user = {
    id: `USR-${Date.now()}`,
    name,
    email: normalizedEmail,
    role,
    passwordHash: firebaseEnabled() ? "" : passwordHash,
    phone: "",
    address: "",
    photo: "",
    createdAt: new Date().toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  };
  users.push(user);
  saveUsers(users);

  const profile = {
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
  return { ok: true, profile, created: true };
}

async function loginExistingUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = encodePassword(password);
  let user = getUsers().find((item) => item.email === normalizedEmail);
  if (firebaseEnabled()) {
    try {
      await window.JRFirebase.signIn(normalizedEmail, password);
    } catch (error) {
      return { ok: false, message: `Firebase no pudo iniciar sesion: ${error.message}` };
    }
    if (!user) {
      const users = getUsers();
      user = {
        id: `USR-${Date.now()}`,
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: "Alumno",
        passwordHash: "",
        phone: "",
        address: "",
        photo: "",
        createdAt: new Date().toLocaleDateString("es-BO", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      };
      users.push(user);
      saveUsers(users);
    }
  }
  if (!user) {
    return { ok: false, message: "No existe una cuenta con ese correo." };
  }
  if (!firebaseEnabled() && user.passwordHash !== passwordHash) {
    return { ok: false, message: "Contrasena incorrecta." };
  }
  const profile = {
    name: user.name,
    email: user.email,
    role: user.role
  };
  setProfile(profile);
  return { ok: true, profile };
}

function registerPurchase(course) {
  const profile = getProfile();
  if (!profile) {
    window.location.href = "acceso.html";
    alert("Primero entra con tu perfil para registrar la compra.");
    return;
  }

  const purchases = getPurchases();
  purchases.unshift({
    id: `CMP-${Date.now()}`,
    studentName: profile.name,
    studentEmail: profile.email,
    courseTitle: course.title,
    coursePrice: course.price,
    status: "Pendiente de confirmacion",
    createdAt: new Date().toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  });
  savePurchases(purchases);
  renderProfileCourses();
  alert("Compra registrada en el inventario. Ahora puedes confirmar por WhatsApp.");
  window.open(whatsappLink(course), "_blank", "noopener");
}

function purchaseCard(purchase, index) {
  const article = document.createElement("article");
  article.className = "inventory-card";
  article.innerHTML = `
    <div>
      <span class="pill">${purchase.status}</span>
      <h3>${purchase.courseTitle}</h3>
      <p>${purchase.studentName} - ${purchase.studentEmail}</p>
      <strong class="price">${purchase.coursePrice}</strong>
      <small>${purchase.id} - ${purchase.createdAt}</small>
    </div>
    <div class="card-actions">
      <button class="button secondary" type="button" data-paid="${index}">Marcar pagado</button>
      <button class="button secondary" type="button" data-delete-purchase="${index}">Eliminar</button>
    </div>
  `;
  return article;
}

function renderPurchases() {
  const container = $("#purchaseInventory");
  if (!container) return;
  const purchases = getPurchases();
  container.innerHTML = "";
  if (!purchases.length) {
    container.innerHTML = `<div class="empty">Todavia no hay compras registradas.</div>`;
    return;
  }
  purchases.forEach((purchase, index) => {
    container.appendChild(purchaseCard(purchase, index));
  });
}

function fillCertificate(studentName, courseTitle) {
  const certificate = {
    studentName,
    courseTitle,
    date: new Date().toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  };
  localStorage.setItem(storageKeys.certificate, JSON.stringify(certificate));
  if (!$("#certName") || !$("#certCourse")) return;
  $("#certName").textContent = certificate.studentName;
  $("#certCourse").textContent = certificate.courseTitle;
  $("#certDate").textContent = certificate.date;
  if ($("#certificateMessage")) {
    $("#certificateMessage").textContent = `Certificado generado para ${certificate.studentName}. Ya puedes imprimirlo o guardarlo como PDF.`;
  }
}

function normalizeCode(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function validateCourseCode(course, code) {
  return normalizeCode(course.certificateCode || "") === normalizeCode(code);
}

function generateCouponCode(prefix) {
  const cleanPrefix = normalizeCode(prefix || "JR") || "JR";
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  const timePart = Date.now().toString(36).slice(-5).toUpperCase();
  return `${cleanPrefix}-${randomPart}-${timePart}`;
}

function couponMatchesCourse(coupon, course) {
  return coupon.courseKey === courseKey(course) || coupon.courseTitle === course.title;
}

function useCoupon(course, rawCode) {
  const profile = getProfile();
  if (!profile) {
    return { ok: false, message: "Primero entra con tu perfil para usar el cupon." };
  }

  const code = normalizeCode(rawCode);
  const coupons = getCoupons();
  const index = coupons.findIndex((coupon) => normalizeCode(coupon.code) === code && couponMatchesCourse(coupon, course));

  if (index === -1) {
    return { ok: false, message: "Cupon incorrecto o no pertenece a este curso." };
  }

  if (coupons[index].used) {
    const usedBy = coupons[index].usedByEmail ? ` por ${coupons[index].usedByEmail}` : "";
    return { ok: false, message: `Este cupon ya fue usado${usedBy}.` };
  }

  coupons[index] = {
    ...coupons[index],
    used: true,
    usedByName: profile.name,
    usedByEmail: profile.email,
    usedAt: new Date().toLocaleString("es-BO")
  };
  saveCoupons(coupons);
  unlockCourse(course);
  fillCertificate(profile.name, course.title);
  return { ok: true, message: "Cupon validado. Curso desbloqueado y certificado listo." };
}

function renderCouponCourseOptions() {
  const select = $("#couponCourse");
  if (!select) return;
  select.innerHTML = "";
  getCourses().forEach((course) => {
    const option = document.createElement("option");
    option.value = courseKey(course);
    option.textContent = `${course.title} - ${course.price}`;
    select.appendChild(option);
  });
}

function couponCard(coupon, index) {
  const article = document.createElement("article");
  article.className = "inventory-card";
  article.innerHTML = `
    <div>
      <span class="pill">${coupon.used ? "Usado" : "Disponible"}</span>
      <h3>${coupon.code}</h3>
      <p>${coupon.courseTitle}</p>
      <small>Creado: ${coupon.createdAt}${coupon.usedAt ? ` - Usado: ${coupon.usedAt}` : ""}</small>
      ${coupon.usedByEmail ? `<small>Alumno: ${coupon.usedByName} - ${coupon.usedByEmail}</small>` : ""}
    </div>
    <div class="card-actions">
      <button class="button primary" type="button" data-copy-coupon="${index}">Copiar</button>
      <button class="button secondary" type="button" data-delete-coupon="${index}">Eliminar</button>
    </div>
  `;
  return article;
}

function renderCoupons() {
  const list = $("#couponList");
  if (!list) return;
  const coupons = getCoupons();
  list.innerHTML = "";
  if (!coupons.length) {
    list.innerHTML = `<div class="empty">Todavia no hay cupones creados.</div>`;
    return;
  }
  coupons.forEach((coupon, index) => list.appendChild(couponCard(coupon, index)));
}

function renderCertificate() {
  if (!$("#certName") || !$("#certCourse")) return;
  const saved = localStorage.getItem(storageKeys.certificate);
  if (!saved) return;
  const certificate = JSON.parse(saved);
  $("#certName").textContent = certificate.studentName;
  $("#certCourse").textContent = certificate.courseTitle;
  $("#certDate").textContent = certificate.date;
  if ($("#certificateMessage")) {
    $("#certificateMessage").textContent = `Certificado generado para ${certificate.studentName}. Ya puedes imprimirlo o guardarlo como PDF.`;
  }
}

function renderCertificateCourseOptions() {
  const select = $("#certificateCourseSelect");
  if (!select) return;
  select.innerHTML = "";
  getCourses().forEach((course, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${course.title} - ${course.price}`;
    select.appendChild(option);
  });
}

function renderTaskCourseOptions() {
  const select = $("#taskCourse");
  if (!select) return;
  select.innerHTML = "";
  getCourses().forEach((course, index) => {
    const option = document.createElement("option");
    option.value = course.title;
    option.textContent = course.title;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

function taskFileType(filename) {
  const extension = filename.split(".").pop().toUpperCase();
  return extension || "DOC";
}

function taskCard(task, index, options = {}) {
  const fileHref = task.fileUrl || task.dataUrl;
  const submissionForm = options.allowSubmission ? `
    <form class="submission-form" data-submit-task="${task.id || task.title}">
      <label>
        Subir trabajo para corregir
        <input type="file" name="submissionFile" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*" required>
      </label>
      <textarea name="submissionNote" rows="2" placeholder="Comentario para el instructor"></textarea>
      <button class="button secondary" type="submit">Enviar trabajo</button>
    </form>
  ` : "";
  const article = document.createElement("article");
  article.className = "task-card";
  article.innerHTML = `
    <div class="task-icon">${taskFileType(task.filename)}</div>
    <div class="task-body">
      <span class="pill">${task.course}</span>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <small>${task.filename} - ${task.createdAt}</small>
      <div class="card-actions">
        <a class="button primary" href="${fileHref}" download="${task.filename}">Descargar</a>
        <a class="button secondary" href="${fileHref}" target="_blank" rel="noreferrer">Abrir</a>
        ${options.admin ? `<button class="button primary" type="button" data-edit-task="${index}">Editar</button><button class="button secondary" type="button" data-delete-task="${index}">Eliminar</button>` : ""}
      </div>
      ${submissionForm}
    </div>
  `;
  return article;
}

function renderTasks() {
  const profile = getProfile();
  const locked = $("#tasksLocked");
  const content = $("#tasksContent");
  const list = $("#taskList");
  const adminList = $("#adminTaskList");
  const tasks = getTasks();
  const visibleTasks = getUnlockedTasksForProfile(profile);

  if (locked && content) {
    locked.classList.toggle("hidden", Boolean(profile));
    content.classList.toggle("hidden", !profile);
  }

  if (list) {
    list.innerHTML = "";
    if (!profile) return;
    if (!visibleTasks.length) {
      list.innerHTML = `<div class="empty">Todavia no tienes documentos desbloqueados. Entra a un curso comprado e ingresa su cupon.</div>`;
    } else {
      visibleTasks.forEach((task, index) => list.appendChild(taskCard(task, index)));
    }
  }

  if (adminList) {
    adminList.innerHTML = "";
    if (!tasks.length) {
      adminList.innerHTML = `<div class="empty">Todavia no subiste tareas.</div>`;
    } else {
      tasks.forEach((task, index) => adminList.appendChild(taskCard(task, index, { admin: true })));
    }
  }
}

function renderCourseTasks() {
  const list = $("#courseTaskList");
  if (!list) return;
  const courses = getCourses();
  const course = courses[getCurrentCourseIndex()];
  if (!course) {
    list.innerHTML = `<div class="empty">Curso no encontrado.</div>`;
    return;
  }
  if (!getProfile()) {
    list.innerHTML = `<div class="empty">Primero entra con tu perfil para ver documentos.</div>`;
    return;
  }
  if (!isCourseUnlocked(course)) {
    list.innerHTML = `<div class="empty">Ingresa un cupon de un solo uso para ver sus documentos.</div>`;
    return;
  }
  const tasks = getTasks().filter((task) => task.course === course.title);
  if (!tasks.length) {
    list.innerHTML = `<div class="empty">Este curso todavia no tiene documentos subidos.</div>`;
    return;
  }
  list.innerHTML = "";
  tasks.forEach((task, index) => list.appendChild(taskCard(task, index)));
}

function renderCourseUnlockState() {
  const message = $("#courseUnlockMessage");
  const form = $("#courseUnlockForm");
  if (!message || !form) return;
  const course = getCourses()[getCurrentCourseIndex()];
  if (!course) return;
  if (!getProfile()) {
    message.textContent = "Primero entra con tu perfil para desbloquear documentos.";
    return;
  }
  if (isCourseUnlocked(course)) {
    message.textContent = "Curso desbloqueado. Ya puedes ver y descargar sus documentos.";
    form.classList.add("hidden");
  } else {
    message.textContent = "Compra el curso y escribe el cupon de un solo uso entregado por el administrador para ver los documentos.";
    form.classList.remove("hidden");
  }
}

function userCard(user, index) {
  const article = document.createElement("article");
  article.className = "user-card";
  article.innerHTML = `
    <div class="user-avatar">${user.photo ? `<img src="${user.photo}" alt="Foto de ${user.name}">` : initials(user.name)}</div>
    <div class="user-body">
      <span class="pill">${user.role}</span>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <small>${user.phone || "Sin telefono"} - ${user.address || "Sin direccion"}</small>
      <div class="card-actions">
        <button class="button primary" type="button" data-edit-user="${index}">Editar</button>
        <button class="button secondary" type="button" data-delete-user="${index}">Eliminar</button>
      </div>
    </div>
  `;
  return article;
}

function renderUsers() {
  const list = $("#userList");
  if (!list) return;
  const users = getUsers();
  list.innerHTML = "";
  if (!users.length) {
    list.innerHTML = `<div class="empty">Todavia no hay usuarios registrados.</div>`;
    return;
  }
  users.forEach((user, index) => list.appendChild(userCard(user, index)));
}

function submissionCard(submission, index) {
  const href = submission.fileUrl || submission.dataUrl;
  const article = document.createElement("article");
  article.className = "inventory-card";
  article.innerHTML = `
    <div>
      <span class="pill">${submission.status}</span>
      <h3>${submission.taskTitle}</h3>
      <p>${submission.studentName} - ${submission.studentEmail}</p>
      <small>${submission.courseTitle} - ${submission.filename} - ${submission.createdAt}</small>
      ${submission.note ? `<p>${submission.note}</p>` : ""}
    </div>
    <div class="card-actions">
      <a class="button primary" href="${href}" download="${submission.filename}">Descargar</a>
      <a class="button secondary" href="${href}" target="_blank" rel="noreferrer">Abrir</a>
      <button class="button secondary" type="button" data-reviewed="${index}">Marcar corregido</button>
      <button class="button secondary" type="button" data-delete-submission="${index}">Eliminar</button>
    </div>
  `;
  return article;
}

function renderSubmissions() {
  const list = $("#submissionList");
  if (!list) return;
  const submissions = getSubmissions();
  list.innerHTML = "";
  if (!submissions.length) {
    list.innerHTML = `<div class="empty">Todavia no hay trabajos entregados por alumnos.</div>`;
    return;
  }
  submissions.forEach((submission, index) => list.appendChild(submissionCard(submission, index)));
}

async function saveStudentSubmission(form, task) {
  const profile = getProfile();
  if (!profile) {
    alert("Primero entra con tu perfil para subir tu trabajo.");
    window.location.href = "acceso.html";
    return;
  }
  const file = form.elements.submissionFile.files[0];
  if (!file) return;
  const dataUrl = firebaseEnabled() ? "" : await readFileAsDataUrl(file);
  const fileUrl = firebaseEnabled()
    ? await window.JRFirebase.uploadFile(`submissions/${Date.now()}-${file.name}`, file)
    : "";
  const submissions = getSubmissions();
  submissions.unshift({
    id: `SUB-${Date.now()}`,
    taskId: task.id || task.title,
    taskTitle: task.title,
    courseTitle: task.course,
    studentName: profile.name,
    studentEmail: profile.email,
    filename: file.name,
    type: file.type,
    note: form.elements.submissionNote.value.trim(),
    dataUrl,
    fileUrl,
    status: "Pendiente de correccion",
    createdAt: new Date().toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  });
  saveSubmissions(submissions);
  form.reset();
  alert("Trabajo enviado para correccion.");
  renderSubmissions();
}

function bindSubmissionForms(container, taskResolver) {
  if (!container) return;
  container.addEventListener("submit", async (event) => {
    const form = event.target.closest(".submission-form");
    if (!form) return;
    event.preventDefault();
    const task = taskResolver(form);
    if (!task) return;
    await saveStudentSubmission(form, task);
  });
}

function courseCard(course, index, options = {}) {
  const article = document.createElement("article");
  article.className = "course-card";
  const adminButtons = `
    ${course.link ? `<a class="button secondary" href="${course.link}" target="_blank" rel="noreferrer">Abrir clase</a>` : ""}
    <button class="button primary" type="button" data-edit="${index}">Editar</button>
    <button class="button secondary" type="button" data-delete="${index}">Eliminar</button>
  `;
  const studentButtons = `
    ${course.link ? `<a class="button secondary" href="${course.link}" target="_blank" rel="noreferrer">Abrir clase</a>` : ""}
    <button class="button primary" type="button" data-buy="${index}">Registrar compra</button>
    <a class="button secondary" href="curso.html?id=${index}#courseUnlockForm">Desbloquear con cupon</a>
    <button class="button secondary" type="button" data-complete="${index}">Certificado con cupon</button>
  `;
  article.innerHTML = `
    <div class="course-cover"${course.image ? ` style="background-image: linear-gradient(rgba(15, 64, 59, 0.45), rgba(15, 64, 59, 0.45)), url('${course.image}');"` : ""}>
      <span>${course.category}</span>
    </div>
    <div class="course-card-body">
      <div class="card-meta">
        <span class="pill">${course.category}</span>
        <span class="pill">${course.price}</span>
      </div>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <div class="card-actions">
        <a class="button primary" href="curso.html?id=${index}">Ver curso</a>
        <a class="button secondary" href="${whatsappLink(course)}" target="_blank" rel="noreferrer">Consultar</a>
        ${options.admin ? adminButtons : studentButtons}
      </div>
    </div>
  `;
  return article;
}

function shopCard(course) {
  const article = document.createElement("article");
  article.className = "shop-card";
  article.innerHTML = `
    <span class="pill">${course.category}</span>
    <h3>${course.title}</h3>
    <p>${course.description}</p>
    <strong class="price">${course.price}</strong>
    <a class="button primary" href="${whatsappLink(course)}" target="_blank" rel="noreferrer">Comprar por WhatsApp</a>
  `;
  return article;
}

function renderCourses() {
  const courses = getCourses();
  const list = $("#courseList");
  const shop = $("#shopList");

  if (list) list.innerHTML = "";
  if (shop) shop.innerHTML = "";
  if ($("#courseCount")) $("#courseCount").textContent = courses.length;

  courses.forEach((course, index) => {
    if (list) list.appendChild(courseCard(course, index, { admin: page === "admin" }));
    if (shop) shop.appendChild(shopCard(course));
  });
}

function getCurrentCourseIndex() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return Number.isInteger(id) && id >= 0 ? id : 0;
}

function renderCourseDetail() {
  const detail = $("#courseDetail");
  if (!detail) return;
  const courses = getCourses();
  const index = getCurrentCourseIndex();
  const course = courses[index];
  if (!course) {
    detail.innerHTML = `
      <section class="page-hero">
        <p class="eyebrow">Curso no encontrado</p>
        <h1>Este curso no existe</h1>
        <p>Vuelve a la lista de cursos para seleccionar uno disponible.</p>
        <a class="button primary" href="cursos.html">Ver cursos</a>
      </section>
    `;
    return;
  }
  document.title = `${course.title} | JRUnlock&Repairs`;
  detail.innerHTML = `
    <section class="course-page-hero">
      <div class="course-page-cover"${course.image ? ` style="background-image: linear-gradient(rgba(15, 64, 59, 0.38), rgba(15, 64, 59, 0.55)), url('${course.image}');"` : ""}>
        <span>${course.category}</span>
      </div>
      <div class="course-page-body">
        <p class="eyebrow">Curso</p>
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <div class="card-meta">
          <span class="pill">${course.price}</span>
        <span class="pill">${isCourseUnlocked(course) ? "Documentos desbloqueados" : "Requiere cupon"}</span>
        </div>
        <div class="hero-actions">
          <button class="button primary" type="button" data-buy-current="${index}">Registrar compra</button>
          <a class="button secondary" href="${whatsappLink(course)}" target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
        </div>
      </div>
    </section>
  `;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(undefined);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

async function readImageForCourse(file) {
  if (!file) return undefined;
  if (firebaseEnabled()) {
    return window.JRFirebase.uploadFile(`course-images/${Date.now()}-${file.name}`, file);
  }
  return readFileAsDataUrl(file);
}

function setCourseImagePreview(image) {
  const preview = $("#courseImagePreview");
  if (!preview) return;
  if (!image) {
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }
  preview.classList.remove("hidden");
  preview.innerHTML = `
    <span>Foto actual del curso</span>
    <img src="${image}" alt="Foto actual del curso">
  `;
}

function fillCourseForm(course, index) {
  if (!$("#courseForm")) return;
  $("#courseTitle").value = course.title;
  $("#courseCategory").value = course.category;
  $("#coursePrice").value = course.price;
  $("#courseLink").value = course.link || "";
  $("#courseCode").value = course.certificateCode || "";
  $("#courseDescription").value = course.description;
  $("#courseRemoveImage").checked = false;
  setCourseImagePreview(course.image || "");
  $("#courseEditIndex").value = String(index);
  $("#courseSubmitButton").textContent = "Guardar cambios";
  $("#courseCancelEdit").classList.remove("hidden");
  $("#courseTitle").focus();
}

function resetCourseForm() {
  if (!$("#courseForm")) return;
  $("#courseForm").reset();
  $("#courseEditIndex").value = "";
  if ($("#courseRemoveImage")) $("#courseRemoveImage").checked = false;
  setCourseImagePreview("");
  $("#courseSubmitButton").textContent = "Subir curso";
  $("#courseCancelEdit").classList.add("hidden");
}

function fillTaskForm(task, index) {
  if (!$("#taskForm")) return;
  $("#taskTitle").value = task.title;
  $("#taskCourse").value = task.course;
  $("#taskDescription").value = task.description;
  $("#taskFile").required = false;
  $("#taskEditIndex").value = String(index);
  $("#taskSubmitButton").textContent = "Guardar tarea";
  $("#taskCancelEdit").classList.remove("hidden");
  $("#taskTitle").focus();
}

function resetTaskForm() {
  if (!$("#taskForm")) return;
  $("#taskForm").reset();
  $("#taskFile").required = true;
  $("#taskEditIndex").value = "";
  $("#taskSubmitButton").textContent = "Subir tarea";
  $("#taskCancelEdit").classList.add("hidden");
}

function fillUserForm(user, index) {
  if (!$("#userForm")) return;
  $("#userName").value = user.name;
  $("#userEmail").value = user.email;
  $("#userRole").value = user.role;
  $("#userPhone").value = user.phone || "";
  $("#userAddress").value = user.address || "";
  $("#userPassword").value = "";
  $("#userEditIndex").value = String(index);
  $("#userSubmitButton").textContent = "Guardar usuario";
  $("#userCancelEdit").classList.remove("hidden");
  $("#userName").focus();
}

function resetUserForm() {
  if (!$("#userForm")) return;
  $("#userForm").reset();
  $("#userEditIndex").value = "";
  $("#userSubmitButton").textContent = "Guardar usuario";
  $("#userCancelEdit").classList.add("hidden");
}

function syncPurchasesForUser(oldEmail, user) {
  const purchases = getPurchases();
  let changed = false;
  purchases.forEach((purchase) => {
    if (purchase.studentEmail === oldEmail) {
      purchase.studentEmail = user.email;
      purchase.studentName = user.name;
      changed = true;
    }
  });
  if (changed) savePurchases(purchases);
}

function syncCurrentProfileAfterUserEdit(oldEmail, user) {
  const profile = getProfile();
  if (!profile || profile.email !== oldEmail) return;
  setProfile({
    name: user.name,
    email: user.email,
    role: user.role
  });
}

function renderAdminAccess() {
  if (page !== "admin") return;
  const profile = getProfile();
  const allowed = profile && profile.role === "Administrador";
  $("#adminLocked").classList.toggle("hidden", allowed);
  $("#adminContent").classList.toggle("hidden", !allowed);
}

function bindHomeEvents() {
  if ($("#signInForm")) $("#signInForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const result = await loginExistingUser({
      email: $("#signInEmail").value,
      password: $("#signInPassword").value
    });
    if (!result.ok) {
      alert(result.message);
      return;
    }
    renderProfile();
    renderAdminAccess();
    renderTasks();
    event.target.reset();
  });

  if ($("#roleInput")) $("#roleInput").addEventListener("change", () => {
    const isAdmin = $("#roleInput").value === "Administrador";
    $("#adminCodeGroup").classList.toggle("hidden", !isAdmin);
    $("#adminCodeInput").required = isAdmin;
  });

  if ($("#loginForm")) $("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const role = $("#roleInput").value;
    if (role === "Administrador" && $("#adminCodeInput").value !== adminAccessCode) {
      alert("Codigo de administrador incorrecto.");
      return;
    }
    const result = await createOrLoginUser({
      name: $("#nameInput").value.trim(),
      email: $("#emailInput").value.trim(),
      password: $("#passwordInput").value,
      role
    });
    if (!result.ok) {
      alert(result.message);
      return;
    }
    renderProfile();
    renderAdminAccess();
    renderTasks();
    event.target.reset();
  });

  if ($("#logoutButton")) $("#logoutButton").addEventListener("click", () => {
    if (firebaseEnabled()) {
      window.JRFirebase.signOut().catch((error) => console.warn("No se pudo cerrar sesion en Firebase", error));
    }
    localStorage.removeItem(storageKeys.profile);
    renderProfile();
    renderAdminAccess();
    renderTasks();
  });

  if ($("#profileDetailsForm")) $("#profileDetailsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const photoFile = $("#profilePhotoInput").files[0];
    const saveDetails = (photo) => {
      const updates = {
        phone: $("#profilePhoneInput").value.trim(),
        address: $("#profileAddressInput").value.trim()
      };
      if (photo !== undefined) updates.photo = photo;
      updateCurrentUser(updates);
      renderProfile();
      $("#profilePhotoInput").value = "";
      alert("Informacion del perfil guardada.");
    };

    if (!photoFile) {
      saveDetails(undefined);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => saveDetails(reader.result));
    reader.readAsDataURL(photoFile);
  });

}

function bindPrintEvents() {
  if (!$("#printCertificate")) return;
  $("#printCertificate").addEventListener("click", () => {
    if (!localStorage.getItem(storageKeys.certificate)) {
      alert("Primero valida el cupon del curso para generar el certificado.");
      return;
    }
    window.print();
  });
}

function bindCourseEvents() {
  bindSubmissionForms($("#courseTaskList"), (form) => {
    const taskId = form.dataset.submitTask;
    return getTasks().find((task) => String(task.id || task.title) === taskId);
  });

  bindSubmissionForms($("#taskList"), (form) => {
    const taskId = form.dataset.submitTask;
    return getTasks().find((task) => String(task.id || task.title) === taskId);
  });

  bindSubmissionForms($("#profileTaskList"), (form) => {
    const taskId = form.dataset.submitTask;
    return getTasks().find((task) => String(task.id || task.title) === taskId);
  });

  if ($("#courseDetail")) $("#courseDetail").addEventListener("click", (event) => {
    const buyButton = event.target.closest("[data-buy-current]");
    if (!buyButton) return;
    const course = getCourses()[Number(buyButton.dataset.buyCurrent)];
    registerPurchase(course);
  });

  if ($("#courseUnlockForm")) $("#courseUnlockForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile) {
      alert("Primero entra con tu perfil para desbloquear documentos.");
      window.location.href = "acceso.html";
      return;
    }
    const course = getCourses()[getCurrentCourseIndex()];
    const code = $("#courseUnlockCode").value;
    const result = useCoupon(course, code);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    alert(result.message);
    $("#courseUnlockCode").value = "";
    renderCourseUnlockState();
    renderCourseTasks();
    renderTasks();
    renderProfileAssignments();
    renderCoupons();
  });

  if (!$("#courseList") || page === "admin") return;

  $("#courseList").addEventListener("click", (event) => {
    const buyButton = event.target.closest("[data-buy]");
    if (buyButton) {
      const course = getCourses()[Number(buyButton.dataset.buy)];
      registerPurchase(course);
      return;
    }

    const button = event.target.closest("[data-complete]");
    if (!button) return;
    const profile = getProfile();
    if (!profile) {
      window.location.href = "acceso.html";
      alert("Primero crea o entra con tu perfil para generar el certificado.");
      return;
    }
    const index = Number(button.dataset.complete);
    const course = getCourses()[index];
    const code = prompt(`Ingresa el cupon del curso "${course.title}" para generar el certificado:`);
    if (code === null) return;
    const result = useCoupon(course, code);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    window.location.href = "certificados.html";
  });
}

function bindCertificateCodeEvents() {
  if (!$("#certificateCodeForm")) return;

  $("#certificateCodeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile) {
      alert("Primero entra con tu perfil para generar el certificado.");
      window.location.href = "acceso.html";
      return;
    }
    const courses = getCourses();
    const selectedCourse = courses[Number($("#certificateCourseSelect").value)];
    const code = $("#certificateCodeInput").value;
    const result = useCoupon(selectedCourse, code);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    alert(result.message);
    $("#certificateCodeInput").value = "";
    renderCoupons();
  });
}

function bindAdminEvents() {
  if ($("#courseForm")) $("#courseForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const courses = getCourses();
    const editIndex = $("#courseEditIndex").value;
    const currentCourse = editIndex !== "" ? courses[Number(editIndex)] : null;
    const uploadedImage = await readImageForCourse($("#courseImage").files[0]);
    const shouldRemoveImage = $("#courseRemoveImage")?.checked;
    const courseData = {
      title: $("#courseTitle").value.trim(),
      category: $("#courseCategory").value,
      price: $("#coursePrice").value.trim(),
      link: $("#courseLink").value.trim(),
      image: shouldRemoveImage ? "" : (uploadedImage !== undefined ? uploadedImage : currentCourse?.image || ""),
      certificateCode: normalizeCode($("#courseCode").value),
      description: $("#courseDescription").value.trim()
    };
    if (currentCourse) {
      courses[Number(editIndex)] = courseData;
    } else {
      courses.unshift(courseData);
    }
    saveCourses(courses);
    if (currentCourse) syncCouponsForCourse(currentCourse, courseData);
    renderCourses();
    renderTaskCourseOptions();
    renderCouponCourseOptions();
    renderCoupons();
    resetCourseForm();
  });

  if ($("#courseList")) $("#courseList").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
      const index = Number(editButton.dataset.edit);
      fillCourseForm(getCourses()[index], index);
      return;
    }
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const index = Number(button.dataset.delete);
    const courses = getCourses();
    courses.splice(index, 1);
    saveCourses(courses);
    renderCourses();
    renderTaskCourseOptions();
    renderCouponCourseOptions();
    resetCourseForm();
  });

  if ($("#courseCancelEdit")) $("#courseCancelEdit").addEventListener("click", () => {
    resetCourseForm();
  });

  if ($("#courseImage")) $("#courseImage").addEventListener("change", async () => {
    const file = $("#courseImage").files[0];
    if (!file) return;
    const preview = await readFileAsDataUrl(file);
    setCourseImagePreview(preview);
    if ($("#courseRemoveImage")) $("#courseRemoveImage").checked = false;
  });

  if ($("#courseRemoveImage")) $("#courseRemoveImage").addEventListener("change", () => {
    if ($("#courseRemoveImage").checked) {
      setCourseImagePreview("");
      $("#courseImage").value = "";
    }
  });

  if ($("#taskForm")) $("#taskForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const tasks = getTasks();
    const editIndex = $("#taskEditIndex").value;
    const currentTask = editIndex !== "" ? tasks[Number(editIndex)] : null;
    const file = $("#taskFile").files[0];
    if (!file && !currentTask) return;
    const dataUrl = firebaseEnabled() ? undefined : await readFileAsDataUrl(file);
    const fileUrl = firebaseEnabled() && file
      ? await window.JRFirebase.uploadFile(`tasks/${Date.now()}-${file.name}`, file)
      : undefined;
    const taskData = {
      id: currentTask?.id || `TSK-${Date.now()}`,
      title: $("#taskTitle").value.trim(),
      course: $("#taskCourse").value,
      description: $("#taskDescription").value.trim(),
      filename: file ? file.name : currentTask.filename,
      type: file ? file.type : currentTask.type,
      dataUrl: dataUrl !== undefined ? dataUrl : currentTask?.dataUrl || "",
      fileUrl: fileUrl !== undefined ? fileUrl : currentTask?.fileUrl || "",
      createdAt: currentTask?.createdAt || new Date().toLocaleDateString("es-BO", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
    if (currentTask) {
      tasks[Number(editIndex)] = taskData;
    } else {
      tasks.unshift(taskData);
    }
    saveTasks(tasks);
    renderTasks();
    renderProfileAssignments();
    resetTaskForm();
  });

  if ($("#adminTaskList")) $("#adminTaskList").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-task]");
    if (editButton) {
      const index = Number(editButton.dataset.editTask);
      fillTaskForm(getTasks()[index], index);
      return;
    }
    const button = event.target.closest("[data-delete-task]");
    if (!button) return;
    const index = Number(button.dataset.deleteTask);
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
    renderProfileAssignments();
    resetTaskForm();
  });

  if ($("#taskCancelEdit")) $("#taskCancelEdit").addEventListener("click", () => {
    resetTaskForm();
  });

  if ($("#userForm")) $("#userForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const users = getUsers();
    const editIndex = $("#userEditIndex").value;
    const currentUser = editIndex !== "" ? users[Number(editIndex)] : null;
    const email = normalizeEmail($("#userEmail").value);
    const duplicate = users.some((user, index) => user.email === email && String(index) !== editIndex);
    if (duplicate) {
      alert("Ese correo ya esta registrado en otro usuario.");
      return;
    }
    const photo = await readFileAsDataUrl($("#userPhoto").files[0]);
    const password = $("#userPassword").value;
    const userData = {
      id: currentUser?.id || `USR-${Date.now()}`,
      name: $("#userName").value.trim(),
      email,
      role: $("#userRole").value,
      passwordHash: firebaseEnabled() ? "" : (password ? encodePassword(password) : currentUser?.passwordHash || encodePassword("1234")),
      phone: $("#userPhone").value.trim(),
      address: $("#userAddress").value.trim(),
      photo: photo !== undefined ? photo : currentUser?.photo || "",
      createdAt: currentUser?.createdAt || new Date().toLocaleDateString("es-BO", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
    const oldEmail = currentUser?.email || userData.email;
    if (currentUser) {
      users[Number(editIndex)] = userData;
    } else {
      users.push(userData);
    }
    saveUsers(users);
    syncPurchasesForUser(oldEmail, userData);
    syncCurrentProfileAfterUserEdit(oldEmail, userData);
    renderUsers();
    renderProfile();
    renderPurchases();
    resetUserForm();
  });

  if ($("#userList")) $("#userList").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-user]");
    if (editButton) {
      fillUserForm(getUsers()[Number(editButton.dataset.editUser)], Number(editButton.dataset.editUser));
      return;
    }
    const deleteButton = event.target.closest("[data-delete-user]");
    if (!deleteButton) return;
    const index = Number(deleteButton.dataset.deleteUser);
    const users = getUsers();
    const profile = getProfile();
    if (profile && users[index]?.email === profile.email) {
      alert("No puedes eliminar el usuario administrador que esta activo.");
      return;
    }
    users.splice(index, 1);
    saveUsers(users);
    renderUsers();
    resetUserForm();
  });

  if ($("#userCancelEdit")) $("#userCancelEdit").addEventListener("click", () => {
    resetUserForm();
  });

  if ($("#couponForm")) $("#couponForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const courses = getCourses();
    const selectedKey = $("#couponCourse").value;
    const course = courses.find((item) => courseKey(item) === selectedKey) || courses[0];
    if (!course) {
      alert("Primero crea un curso para poder generar cupones.");
      return;
    }
    const quantity = Math.max(1, Math.min(50, Number($("#couponQuantity").value) || 1));
    const coupons = getCoupons();
    for (let index = 0; index < quantity; index += 1) {
      coupons.unshift({
        id: `CPN-${Date.now()}-${index}`,
        code: generateCouponCode($("#couponPrefix").value),
        courseTitle: course.title,
        courseKey: courseKey(course),
        used: false,
        usedByName: "",
        usedByEmail: "",
        usedAt: "",
        createdAt: new Date().toLocaleString("es-BO")
      });
    }
    saveCoupons(coupons);
    $("#couponForm").reset();
    renderCouponCourseOptions();
    renderCoupons();
  });

  if ($("#couponList")) $("#couponList").addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-coupon]");
    const deleteButton = event.target.closest("[data-delete-coupon]");
    const coupons = getCoupons();

    if (copyButton) {
      const coupon = coupons[Number(copyButton.dataset.copyCoupon)];
      if (!coupon) return;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coupon.code);
        alert("Cupon copiado.");
      } else {
        prompt("Copia este cupon:", coupon.code);
      }
      return;
    }

    if (deleteButton) {
      coupons.splice(Number(deleteButton.dataset.deleteCoupon), 1);
      saveCoupons(coupons);
      renderCoupons();
    }
  });

  if ($("#purchaseInventory")) $("#purchaseInventory").addEventListener("click", (event) => {
    const paidButton = event.target.closest("[data-paid]");
    const deleteButton = event.target.closest("[data-delete-purchase]");
    const purchases = getPurchases();
    if (paidButton) {
      purchases[Number(paidButton.dataset.paid)].status = "Pagado";
      savePurchases(purchases);
      renderPurchases();
      renderProfileCourses();
      return;
    }
    if (deleteButton) {
      purchases.splice(Number(deleteButton.dataset.deletePurchase), 1);
      savePurchases(purchases);
      renderPurchases();
      renderProfileCourses();
    }
  });

  if ($("#submissionList")) $("#submissionList").addEventListener("click", (event) => {
    const reviewedButton = event.target.closest("[data-reviewed]");
    const deleteButton = event.target.closest("[data-delete-submission]");
    const submissions = getSubmissions();
    if (reviewedButton) {
      submissions[Number(reviewedButton.dataset.reviewed)].status = "Corregido";
      saveSubmissions(submissions);
      renderSubmissions();
      return;
    }
    if (deleteButton) {
      submissions.splice(Number(deleteButton.dataset.deleteSubmission), 1);
      saveSubmissions(submissions);
      renderSubmissions();
    }
  });
}

if ($("#certDate")) {
  $("#certDate").textContent = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function loadRemoteData() {
  if (!firebaseEnabled()) return;
  try {
    const [remoteUsers, remoteCourses, remotePurchases, remoteTasks, remoteSubmissions, remoteCoupons] = await Promise.all([
      window.JRFirebase.loadCollection("users"),
      window.JRFirebase.loadCollection("courses"),
      window.JRFirebase.loadCollection("purchases"),
      window.JRFirebase.loadCollection("tasks"),
      window.JRFirebase.loadCollection("submissions"),
      window.JRFirebase.loadCollection("coupons")
    ]);
    if (remoteUsers.length) localStorage.setItem(storageKeys.users, JSON.stringify(remoteUsers));
    if (remoteCourses.length) localStorage.setItem(storageKeys.courses, JSON.stringify(remoteCourses));
    if (remotePurchases.length) localStorage.setItem(storageKeys.purchases, JSON.stringify(remotePurchases));
    if (remoteTasks.length) localStorage.setItem(storageKeys.tasks, JSON.stringify(remoteTasks));
    if (remoteSubmissions.length) localStorage.setItem(storageKeys.submissions, JSON.stringify(remoteSubmissions));
    if (remoteCoupons.length) localStorage.setItem(storageKeys.coupons, JSON.stringify(remoteCoupons));
  } catch (error) {
    console.warn("No se pudo cargar la data de Firebase. Usando base local.", error);
  }
}

function renderApp() {
  renderProfile();
  renderAdminAccess();
  renderCertificate();
  renderCertificateCourseOptions();
  renderTaskCourseOptions();
  renderCouponCourseOptions();
  renderCourseDetail();
  renderCourseUnlockState();
  renderCourseTasks();
  renderCourses();
  renderTasks();
  renderPurchases();
  renderSubmissions();
  renderCoupons();
  renderProfileCourses();
  renderProfileAssignments();
  renderUsers();
}

async function bootApp() {
  await loadRemoteData();
  bindHomeEvents();
  bindCourseEvents();
  bindPrintEvents();
  bindCertificateCodeEvents();
  bindAdminEvents();
  renderApp();
}

bootApp();
