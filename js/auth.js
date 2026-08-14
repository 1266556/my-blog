// auth.js —— 登录/注册（纯本地存储，无需服务器）
// 账号存到 localStorage，重启浏览器不丢；密码用 crypto.subtle 哈希

initParticles('particles');

// ===== 标签切换 =====
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    loginForm.classList.toggle('active', target === 'login');
    registerForm.classList.toggle('active', target === 'register');
  });
});

function showMsg(el, text, isError = true) {
  el.textContent = text;
  el.className = 'auth-msg ' + (isError ? 'error' : 'success');
}
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.dataset.text = btn.dataset.text || btn.textContent;
  btn.textContent = loading ? '处理中…' : btn.dataset.text;
}

// ===== 本地账号库 =====
const ACCOUNTS_KEY = 'myBlogAccounts';        // 全部账号
const SESSION_KEY  = 'myBlogCurrentUser';    // 当前登录用户

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch { return {}; }
}
function saveAccounts(acc) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(acc));
}

// 浏览器内置 SHA-256 加密（即使文件被看到，密码也是不可逆哈希）
async function hashPwd(pwd) {
  const buf = new TextEncoder().encode(pwd);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ===== 注册 =====
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value;
  const password2 = document.getElementById('regPass2').value;
  const msg = document.getElementById('regMsg');

  if (username.length < 3)  return showMsg(msg, '用户名至少 3 个字符');
  if (password.length < 6)  return showMsg(msg, '密码至少 6 位');
  if (password !== password2) return showMsg(msg, '两次密码不一致');

  const acc = getAccounts();
  if (acc[username]) return showMsg(msg, '该用户名已被注册');

  setLoading(registerForm.querySelector('.auth-btn'), true);
  acc[username] = { hash: await hashPwd(password), createdAt: Date.now() };
  saveAccounts(acc);
  localStorage.setItem(SESSION_KEY, username);
  showMsg(msg, '注册成功，正在进入…', false);
  setTimeout(() => (window.location.href = 'home.html'), 600);
  setLoading(registerForm.querySelector('.auth-btn'), false);
});

// ===== 登录 =====
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const msg = document.getElementById('loginMsg');

  const acc = getAccounts();
  const u = acc[username];
  if (!u) return showMsg(msg, '用户名不存在，请先注册');

  setLoading(loginForm.querySelector('.auth-btn'), true);
  const hash = await hashPwd(password);
  if (hash !== u.hash) {
    setLoading(loginForm.querySelector('.auth-btn'), false);
    return showMsg(msg, '密码错误');
  }
  localStorage.setItem(SESSION_KEY, username);
  showMsg(msg, '登录成功，正在进入…', false);
  setTimeout(() => (window.location.href = 'home.html'), 600);
  setLoading(loginForm.querySelector('.auth-btn'), false);
});

// ===== 悬浮方块：鼠标滑动时飘动，离开弹回 =====
const floatBlocks = document.querySelectorAll('.float-block');
function moveBlocks(clientX, clientY) {
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const dx = clientX - cx, dy = clientY - cy;
  floatBlocks.forEach(b => {
    const depth = parseFloat(b.dataset.depth) || 0.05;
    b.style.transform = `translate(${dx * depth}px, ${dy * depth}px) rotate(${dx * depth * 0.08}deg)`;
  });
}
window.addEventListener('mousemove', e => moveBlocks(e.clientX, e.clientY));
document.addEventListener('mouseleave', () => {
  floatBlocks.forEach(b => (b.style.transform = ''));
});
window.addEventListener('touchmove', e => {
  const t = e.touches[0];
  if (t) moveBlocks(t.clientX, t.clientY);
}, { passive: true });