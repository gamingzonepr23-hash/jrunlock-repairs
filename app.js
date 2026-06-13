const whatsappNumber = "19392063234";
const adminAccessCode = "JR939";
const storageKeys = {
  profile: "jr_profile",
  courses: "jr_courses",
  certificate: "jr_certificate",
  tasks: "jr_tasks",
  users: "jr_users",
  purchases: "jr_purchases"
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
}

function getTasks() {
  const saved = localStorage.getItem(storageKeys.tasks);
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
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
    return;
  }

  if (loginPanel) loginPanel.classList.add("hidden");
  empty.classList.add("hidden");
  card.classList.remove("hidden");
  logout.classList.remove("hidden");
  if (detailsForm) detailsForm.classList.remove("hidden");
  if (coursesPanel) coursesPanel.classList.remove("hidden");
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
  renderProfileCourses();
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

function createOrLoginUser({ name, email, password, role }) {
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = encodePassword(password);
  const existing = users.find((user) => user.email === normalizedEmail);

  if (existing) {
    if (existing.passwordHash !== passwordHash) {
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

  const user = {
    id: `USR-${Date.now()}`,
    name,
    email: normalizedEmail,
    role,
    passwordHash,
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
        <a class="button primary" href="${task.dataUrl}" download="${task.filename}">Descargar</a>
        <a class="button secondary" href="${task.dataUrl}" target="_blank" rel="noreferrer">Abrir</a>
        ${options.admin ? `<button class="button primary" type="button" data-edit-task="${index}">Editar</button><button class="button secondary" type="button" data-delete-task="${index}">Eliminar</button>` : ""}
      </div>
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

  if (locked && content) {
    locked.classList.toggle("hidden", Boolean(profile));
    content.classList.toggle("hidden", !profile);
  }

  if (list) {
    list.innerHTML = "";
    if (!profile) return;
    if (!tasks.length) {
      list.innerHTML = `<div class="empty">Todavia no hay tareas subidas por el administrador.</div>`;
    } else {
      tasks.forEach((task, index) => list.appendChild(taskCard(task, index)));
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
    <button class="button secondary" type="button" data-complete="${index}">Certificado con codigo</button>
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

function fillCourseForm(course, index) {
  if (!$("#courseForm")) return;
  $("#courseTitle").value = course.title;
  $("#courseCategory").value = course.category;
  $("#coursePrice").value = course.price;
  $("#courseLink").value = course.link || "";
  $("#courseCode").value = course.certificateCode || "";
  $("#courseDescription").value = course.description;
  $("#courseEditIndex").value = String(index);
  $("#courseSubmitButton").textContent = "Guardar cambios";
  $("#courseCancelEdit").classList.remove("hidden");
  $("#courseTitle").focus();
}

function resetCourseForm() {
  if (!$("#courseForm")) return;
  $("#courseForm").reset();
  $("#courseEditIndex").value = "";
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
  if (!$("#loginForm")) return;

  $("#roleInput").addEventListener("change", () => {
    const isAdmin = $("#roleInput").value === "Administrador";
    $("#adminCodeGroup").classList.toggle("hidden", !isAdmin);
    $("#adminCodeInput").required = isAdmin;
  });

  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const role = $("#roleInput").value;
    if (role === "Administrador" && $("#adminCodeInput").value !== adminAccessCode) {
      alert("Codigo de administrador incorrecto.");
      return;
    }
    const result = createOrLoginUser({
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

  $("#logoutButton").addEventListener("click", () => {
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
      alert("Primero valida el codigo del curso para generar el certificado.");
      return;
    }
    window.print();
  });
}

function bindCourseEvents() {
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
    const code = prompt(`Ingresa el codigo del curso "${course.title}" para generar el certificado:`);
    if (code === null) return;
    if (!validateCourseCode(course, code)) {
      alert("Codigo incorrecto. Revisa el codigo entregado por el instructor.");
      return;
    }
    fillCertificate(profile.name, course.title);
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
    if (!validateCourseCode(selectedCourse, code)) {
      alert("Codigo incorrecto. Revisa el codigo entregado por el instructor.");
      return;
    }
    fillCertificate(profile.name, selectedCourse.title);
    $("#certificateCodeInput").value = "";
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
    const uploadedImage = await readFileAsDataUrl($("#courseImage").files[0]);
    const courseData = {
      title: $("#courseTitle").value.trim(),
      category: $("#courseCategory").value,
      price: $("#coursePrice").value.trim(),
      link: $("#courseLink").value.trim(),
      image: uploadedImage !== undefined ? uploadedImage : currentCourse?.image || "",
      certificateCode: normalizeCode($("#courseCode").value),
      description: $("#courseDescription").value.trim()
    };
    if (currentCourse) {
      courses[Number(editIndex)] = courseData;
    } else {
      courses.unshift(courseData);
    }
    saveCourses(courses);
    renderCourses();
    renderTaskCourseOptions();
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
    resetCourseForm();
  });

  if ($("#courseCancelEdit")) $("#courseCancelEdit").addEventListener("click", () => {
    resetCourseForm();
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
    const dataUrl = await readFileAsDataUrl(file);
    const taskData = {
      title: $("#taskTitle").value.trim(),
      course: $("#taskCourse").value,
      description: $("#taskDescription").value.trim(),
      filename: file ? file.name : currentTask.filename,
      type: file ? file.type : currentTask.type,
      dataUrl: dataUrl !== undefined ? dataUrl : currentTask.dataUrl,
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
      passwordHash: password ? encodePassword(password) : currentUser?.passwordHash || encodePassword("1234"),
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
}

if ($("#certDate")) {
  $("#certDate").textContent = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

bindHomeEvents();
bindCourseEvents();
bindPrintEvents();
bindCertificateCodeEvents();
bindAdminEvents();
renderProfile();
renderAdminAccess();
renderCertificate();
renderCertificateCourseOptions();
renderTaskCourseOptions();
renderCourses();
renderTasks();
renderPurchases();
renderProfileCourses();
renderUsers();
