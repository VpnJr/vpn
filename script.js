import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== Firebase config ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDyHRXgmRKT2Pm4P4T5PaGERY1aq6l5yr4",
  authDomain: "vless-panel.firebaseapp.com",
  projectId: "vless-panel",
  storageBucket: "vless-panel.firebasestorage.app",
  messagingSenderId: "49665298978",
  appId: "1:49665298978:web:4f5d9de2f269a19a10307b"
};

/* ===== Init Firebase ===== */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
signInAnonymously(auth).catch(console.error);

/* ===== VPN KEYS ===== */
const vpnList = document.getElementById("vpn-list");

function showSkeleton(count = 3) {
  vpnList.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "card";
    skeleton.innerHTML = `<div class="skeleton"></div>`;
    vpnList.appendChild(skeleton);
  }
}

async function loadKeys() {
  showSkeleton();
  const q = query(collection(db, "vpn_keys"), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  vpnList.innerHTML = '';

  if (snapshot.empty) {
    vpnList.textContent = "Ключей пока нет";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "card";

    const top = document.createElement("div");
    top.className = "card-top";

    const title = document.createElement("h3");
    title.textContent = data.name;

    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.textContent = "Скопировать";

    btn.onclick = async () => {
      await navigator.clipboard.writeText(data.key);
      btn.textContent = "✓";
      btn.classList.add("success");
      setTimeout(() => {
        btn.textContent = "Скопировать";
        btn.classList.remove("success");
      }, 1200);
    };

    top.appendChild(title);
    top.appendChild(btn);

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = `Добавлено: ${data.createdAt}`;

    card.appendChild(top);
    card.appendChild(date);
    vpnList.appendChild(card);
  });
}

/* ===== APPS ===== */
const appsList = document.getElementById("apps-list");

function showAppSkeleton(count = 3) {
  appsList.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "app-card";
    skeleton.innerHTML = `<div class="skeleton" style="height:40px;"></div>`;
    appsList.appendChild(skeleton);
  }
}

async function loadApps() {
  showAppSkeleton();
  const q = query(collection(db, "apps"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  appsList.innerHTML = '';

  if (snapshot.empty) {
    appsList.textContent = "Приложения не найдены";
    return;
  }

  // Группировка по платформам
  const platforms = {
    iOS: [],
    Android: [],
    "Windows/MacOS": []
  };

  snapshot.forEach(doc => {
    const app = doc.data();
    if (platforms[app.platform]) {
      platforms[app.platform].push(app);
    }
  });

  // Создаём блок для каждой платформы
  for (const [platformName, apps] of Object.entries(platforms)) {
    if (apps.length === 0) continue; // пропускаем пустые

    const platformBlock = document.createElement("div");
    platformBlock.className = "device-block";

    const title = document.createElement("h3");
    title.textContent = platformName;
    platformBlock.appendChild(title);

    const appsContainer = document.createElement("div");
    appsContainer.className = "apps-icons";

    apps.forEach(app => {
      const card = document.createElement("div");
      card.className = "app-card";

      const icon = document.createElement("div");
      icon.className = "app-icon";
      icon.innerHTML = app.icon
        ? `<img src="${app.icon}" alt="${app.name}">`
        : "📦";

      const info = document.createElement("div");
      info.className = "app-info";
      info.innerHTML = `
        <div class="app-name">${app.name}</div>
        <div class="app-platform">${app.platform}</div>
      `;

      const btn = document.createElement("button");
      btn.className = "action-btn";
      btn.textContent = "Скачать";
      btn.onclick = () => {
        btn.textContent = "✔️";
        btn.classList.add("success");
        window.open(app.url, "_blank");
        setTimeout(() => {
          btn.textContent = "Скачать";
          btn.classList.remove("success");
        }, 1200);
      };

      card.appendChild(icon);
      card.appendChild(info);
      card.appendChild(btn);
      appsContainer.appendChild(card);
    });

    platformBlock.appendChild(appsContainer);
    appsList.appendChild(platformBlock);
  }
}


/* ===== Load data ===== */
loadKeys();
loadApps();
