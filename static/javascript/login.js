'use strict';

async function checkAlreadyAuthed() {
  try {
    const s = await fetch('/api/auth/status').then(r => r.json());
    if (s.authenticated || !s.auth_enabled) { window.location.href = '/'; }
  } catch(_) {}
}

async function doLogin() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  try {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (r.ok) {
      window.location.href = '/';
    } else {
      document.getElementById('login-error').textContent = 'Invalid username or password';
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
    }
  } finally {
    btn.disabled = false;
  }
}

document.getElementById('login-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
document.getElementById('login-btn').addEventListener('click', doLogin);

checkAlreadyAuthed();
