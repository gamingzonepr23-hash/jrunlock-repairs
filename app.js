const whatsappNumber = "19392063234";
const storageKeys = {
  profile: "jr_profile",
  courses: "jr_courses"
};

const starterCourses = [
  {
    title: "Reparacion de celulares desde cero",
    category: "Celulares",
    price: "49 USD",
    link: "",
    description: "Diagnostico, cambio de pantallas, bateria, conectores de carga y pruebas basicas."
  },
  {
    title: "Mantenimiento y reparacion de PC",
    category: "Computadoras PC",
    price: "350 Bs",
    link: "",
    description: "Limpieza, armado, instalacion de sistema, drivers, discos, RAM y fallas comunes."
  },
  {
    title: "Unlock y software movil",
    category: "Unlock y software",
    price: "Gratis",
    link: "",
    description: "Conceptos iniciales de flasheo, respaldo, herramientas y cuidados antes de desbloquear."
  }
];

const $ = (selector) => document.querySelector(selector);

function getCourses() {
  const saved = localStorage.getItem(storageKeys.courses);
  if (!saved) {
    localStorage.setItem(storageKeys.courses, JSON.stringify(starterCourses));
    return starterCourses;
  }
  return JSON.parse(saved);
}

function saveCourses(courses) {
  localStorage.setItem(storageKeys.courses, JSON.stringify(courses));
}

function getProfile() {
  const saved = localStorage.getItem(storageKeys.profile);
  return saved ? JSON.parse(saved) : null;
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
  const users = profile ? 1 : 0;

  $("#studentCount").textContent = users;

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

function courseCard(course, index) {
  const article = document.createElement("article");
  article.className = "course-card";
  article.innerHTML = `
    <div class="card-meta">
      <span class="pill">${course.category}</span>
      <span class="pill">${course.price}</span>
    </div>
    <h3>${course.title}</h3>
    <p>${course.description}</p>
    <div class="card-actions">
      ${course.link ? `<a class="button secondary" href="${course.link}" target="_blank" rel="noreferrer">Abrir clase</a>` : ""}
      <button class="button secondary" type="button" data-delete="${index}">Eliminar</button>
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

  list.innerHTML = "";
  shop.innerHTML = "";
  $("#courseCount").textContent = courses.length;

  courses.forEach((course, index) => {
    list.appendChild(courseCard(course, index));
    shop.appendChild(shopCard(course));
  });
}

function bindEvents() {
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = {
      name: $("#nameInput").value.trim(),
      email: $("#emailInput").value.trim(),
      role: $("#roleInput").value
    };
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
    renderProfile();
    event.target.reset();
  });

  $("#logoutButton").addEventListener("click", () => {
    localStorage.removeItem(storageKeys.profile);
    renderProfile();
  });

  $("#courseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const courses = getCourses();
    courses.unshift({
      title: $("#courseTitle").value.trim(),
      category: $("#courseCategory").value,
      price: $("#coursePrice").value.trim(),
      link: $("#courseLink").value.trim(),
      description: $("#courseDescription").value.trim()
    });
    saveCourses(courses);
    renderCourses();
    event.target.reset();
  });

  $("#courseList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const index = Number(button.dataset.delete);
    const courses = getCourses();
    courses.splice(index, 1);
    saveCourses(courses);
    renderCourses();
  });

  $("#certificateForm").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#certName").textContent = $("#certificateName").value.trim();
    $("#certCourse").textContent = $("#certificateCourse").value.trim();
    $("#certDate").textContent = new Date().toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  $("#printCertificate").addEventListener("click", () => {
    window.print();
  });
}

$("#certDate").textContent = new Date().toLocaleDateString("es-BO", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

bindEvents();
renderProfile();
renderCourses();
