const whatsappNumber = "19392063234";
const adminAccessCode = "JR939";
const storageKeys = {
  profile: "jr_profile",
  courses: "jr_courses",
  certificate: "jr_certificate",
  tasks: "jr_tasks"
};

const starterCourses = [
  {
    title: "Reparacion de celulares desde cero",
    category: "Celulares",
    price: "Desde $250",
    link: "",
    certificateCode: "CEL250",
    description: "Diagnostico, cambio de pantallas, bateria, conectores de carga y pruebas basicas."
  },
  {
    title: "Mantenimiento y reparacion de PC",
    category: "Computadoras PC",
    price: "$500",
    link: "",
    certificateCode: "PC500",
    description: "Limpieza, armado, instalacion de sistema, drivers, discos, RAM y fallas comunes."
  },
  {
    title: "Unlock y software movil",
    category: "Unlock y software",
    price: "Gratis",
    link: "",
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

function renderProfile() {
  const profile = getProfile();
  const empty = $("#profileEmpty");
  const card = $("#profileCard");
  const logout = $("#logoutButton");
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
    empty.classList.remove("hidden");
    card.classList.add("hidden");
    logout.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  card.classList.remove("hidden");
  logout.classList.remove("hidden");
  $("#profileInitials").textContent = initials(profile.name);
  $("#profileName").textContent = profile.name;
  $("#profileEmail").textContent = profile.email;
  $("#profileRole").textContent = profile.role;
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
        ${options.admin ? `<button class="button secondary" type="button" data-delete-task="${index}">Eliminar</button>` : ""}
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

function courseCard(course, index, options = {}) {
  const article = document.createElement("article");
  article.className = "course-card";
  const adminButtons = `
    ${course.link ? `<a class="button secondary" href="${course.link}" target="_blank" rel="noreferrer">Abrir clase</a>` : ""}
    <button class="button secondary" type="button" data-delete="${index}">Eliminar</button>
  `;
  const studentButtons = `
    ${course.link ? `<a class="button secondary" href="${course.link}" target="_blank" rel="noreferrer">Abrir clase</a>` : ""}
    <button class="button secondary" type="button" data-complete="${index}">Certificado con codigo</button>
  `;
  article.innerHTML = `
    <div class="course-cover">
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
        <a class="button primary" href="${whatsappLink(course)}" target="_blank" rel="noreferrer">Consultar</a>
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
    const profile = {
      name: $("#nameInput").value.trim(),
      email: $("#emailInput").value.trim(),
      role
    };
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
    renderProfile();
    renderAdminAccess();
    event.target.reset();
  });

  $("#logoutButton").addEventListener("click", () => {
    localStorage.removeItem(storageKeys.profile);
    renderProfile();
    renderAdminAccess();
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
  if ($("#courseForm")) $("#courseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const courses = getCourses();
    courses.unshift({
      title: $("#courseTitle").value.trim(),
      category: $("#courseCategory").value,
      price: $("#coursePrice").value.trim(),
      link: $("#courseLink").value.trim(),
      certificateCode: normalizeCode($("#courseCode").value),
      description: $("#courseDescription").value.trim()
    });
    saveCourses(courses);
    renderCourses();
    event.target.reset();
  });

  if ($("#courseList")) $("#courseList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const index = Number(button.dataset.delete);
    const courses = getCourses();
    courses.splice(index, 1);
    saveCourses(courses);
    renderCourses();
  });

  if ($("#taskForm")) $("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.role !== "Administrador") {
      renderAdminAccess();
      return;
    }
    const file = $("#taskFile").files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const tasks = getTasks();
      tasks.unshift({
        title: $("#taskTitle").value.trim(),
        course: $("#taskCourse").value,
        description: $("#taskDescription").value.trim(),
        filename: file.name,
        type: file.type,
        dataUrl: reader.result,
        createdAt: new Date().toLocaleDateString("es-BO", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      });
      saveTasks(tasks);
      renderTasks();
      event.target.reset();
    });
    reader.readAsDataURL(file);
  });

  if ($("#adminTaskList")) $("#adminTaskList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-task]");
    if (!button) return;
    const index = Number(button.dataset.deleteTask);
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
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
