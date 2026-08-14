// main.js —— 主页逻辑：登录态显示、退出、滚动动画（纯本地存储）

// ===== 登录态 =====
function loadUser() {
  const userArea = document.getElementById('userArea');
  const username = localStorage.getItem('myBlogCurrentUser');
  if (username) {
    userArea.innerHTML = `<span class="user-name">👋 ${username}</span>
      <button class="logout-btn" id="logoutBtn">退出</button>`;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    userArea.innerHTML = `<a href="auth.html" class="login-link">登录</a>`;
  }
}

function logout() {
  localStorage.removeItem('myBlogCurrentUser');
  window.location.href = 'index.html';
}

loadUser();

// ===== 滚动淡入动画 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));