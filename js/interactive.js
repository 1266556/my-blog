// interactive.js —— 全站可点击元素的交互反馈
// ① 点击水波纹  ② 卡片随鼠标 3D 倾斜

// ===== 点击水波纹 =====
function attachRipple() {
  const selectors = '.auth-btn, .btn, .enter-btn, .tab, .logout-btn, .login-link';
  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ink = document.createElement('span');
      ink.className = 'ripple-ink';
      ink.style.width = ink.style.height = size + 'px';
      ink.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ink.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ink);
      setTimeout(() => ink.remove(), 600);
    });
  });
}

// ===== 卡片随鼠标 3D 倾斜 =====
function attachTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 ~ 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${-py * 10}deg) rotateY(${px * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachRipple();
  attachTilt();
});
