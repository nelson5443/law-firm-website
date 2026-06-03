// ===== NAVBAR HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
}

// ===== ADMIN MODAL =====
function showAdminLogin() {
  document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminLogin() {
  document.getElementById('adminModal').style.display = 'none';
  document.getElementById('loginError').textContent = '';
}

// ===== CHAT: send message (called by onclick in HTML) =====
function sendMsg() {
  const input = document.getElementById('msg');
  if (!input || !window._chatSocket) return;
  const message = input.value.trim();
  if (!message) return;
  window._chatSocket.emit('message', {
    sessionId: localStorage.getItem('chatSessionId'),
    message,
    senderName: 'Client',
    isAdmin: false
  });
  input.value = '';
}

function appendMessage(message, senderName, isAdmin) {
  const messages = document.getElementById('messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.style.cssText = `margin-bottom:8px;padding:8px 10px;border-radius:8px;font-size:0.9rem;
    background:${isAdmin ? '#e8f5e8' : '#f0f4ff'};
    text-align:${isAdmin ? 'left' : 'right'};`;
  div.innerHTML = `<strong>${senderName}:</strong> ${message}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function () {

  // --- Admin modal close on outside click ---
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeAdminLogin(); });
  }

  // --- Admin login form ---
  const adminForm = document.getElementById('adminLoginForm');
  if (adminForm) {
    adminForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('adminUsername').value;
      const password = document.getElementById('adminPassword').value;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          closeAdminLogin();
          window.location.href = '/pages/admin.html';
        } else {
          document.getElementById('loginError').textContent = 'Invalid credentials.';
        }
      } catch {
        document.getElementById('loginError').textContent = 'Connection error.';
      }
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/contact/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim(),
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
          })
        });
        const data = await res.json();
        alert(data.success ? 'Thank you! We will contact you shortly.' : 'Submission failed. Please try again.');
        if (data.success) contactForm.reset();
      } catch {
        alert('Connection error. Please try again.');
      } finally {
        btn.textContent = 'Request Consultation';
        btn.disabled = false;
      }
    });
  }

  // --- Chat widget toggle ---
  const chatToggle = document.getElementById('chat-toggle');
  const chatBox = document.getElementById('chat-box');
  const chatClose = document.getElementById('chat-close');
  const msgInput = document.getElementById('msg');

  if (chatToggle) {
    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('hidden');
      if (!chatBox.classList.contains('hidden') && msgInput) msgInput.focus();
    });
  }
  if (chatClose) {
    chatClose.addEventListener('click', () => chatBox.classList.add('hidden'));
  }
  if (msgInput) {
    msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMsg(); });
  }

  // --- Socket.io chat ---
  if (typeof io === 'undefined') return;

  let sessionId = localStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = 'client-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', sessionId);
  }

  window._chatSocket = io();
  window._chatSocket.on('connect', () => {
    window._chatSocket.emit('join-chat', { sessionId, isAdmin: false });
  });
  window._chatSocket.on('chat-history', (history) => {
    history.forEach(msg => appendMessage(msg.message, msg.senderName, msg.isAdmin));
  });
  window._chatSocket.on('message', (data) => {
    appendMessage(data.message, data.senderName, data.isAdmin);
  });
});
