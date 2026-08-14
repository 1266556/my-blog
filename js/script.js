// ===== 手机端菜单展开/收起 =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 点击菜单项后自动收起（手机端体验更好）
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== 深色 / 浅色模式切换 =====
const themeBtn = document.getElementById('themeBtn');

// 读取上次保存的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️ 浅色';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? '☀️ 浅色' : '🌙 深色';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
