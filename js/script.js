// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chat widget functionality
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            chatBox.classList.toggle('hidden');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatBox.classList.add('hidden');
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message
            alert('Thank you for your inquiry! We will contact you within 24 hours to schedule your consultation.');
            
            // Reset form
            this.reset();
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[href^="#"]');

    function highlightNavigation() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
});

// Chat functionality with Socket.IO
let socket;
let chatSessionId;
let userName;
let isConnected = false;

function initializeChat() {
    // Use existing session ID or generate new one
    if (!chatSessionId) {
        chatSessionId = localStorage.getItem('chatSessionId') || 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', chatSessionId);
    }
    
    // Get stored username
    userName = localStorage.getItem('chatUserName');
    
    // Initialize socket connection
    socket = io();
    
    // Connection status
    socket.on('connect', function() {
        console.log('Connected to chat server');
        isConnected = true;
        // Join chat session
        socket.emit('join-chat', { sessionId: chatSessionId, isAdmin: false });
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from chat server');
        isConnected = false;
    });
    
    // Listen for chat history
    socket.on('chat-history', function(history) {
        const messages = document.getElementById('messages');
        if (messages) {
            messages.innerHTML = ''; // Clear existing messages
            history.forEach(msg => {
                displayMessage(msg.message, msg.senderName, msg.isAdmin, msg.timestamp);
            });
        }
    });
    
    // Listen for new messages
    socket.on('message', function(data) {
        displayMessage(data.message, data.senderName, data.isAdmin, data.timestamp);
    });
}

function displayMessage(message, senderName, isAdmin, timestamp) {
    const messages = document.getElementById('messages');
    if (!messages) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '10px';
    msgDiv.style.padding = '8px';
    msgDiv.style.borderRadius = '5px';
    msgDiv.style.backgroundColor = isAdmin ? '#e8f5e8' : '#f0f0f0';
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.marginLeft = isAdmin ? 'auto' : '0';
    msgDiv.style.marginRight = isAdmin ? '0' : 'auto';
    
    const displayTime = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    msgDiv.innerHTML = `<strong>${senderName}:</strong> ${message} <br><small style="color: #666;">${displayTime}</small>`;
    
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendMsg() {
    const msgInput = document.getElementById('msg');
    
    if (!msgInput || !msgInput.value.trim()) return;
    
    const message = msgInput.value.trim();
    
    // Get user name if not set
    if (!userName) {
        userName = prompt('Please enter your name:') || 'Anonymous';
        localStorage.setItem('chatUserName', userName);
    }
    
    // Initialize chat if not already done
    if (!socket || !isConnected) {
        initializeChat();
        // Wait a moment for connection
        setTimeout(() => {
            sendMessage(message);
        }, 500);
    } else {
        sendMessage(message);
    }
    
    msgInput.value = '';
}

function sendMessage(message) {
    if (!socket || !isConnected) {
        console.log('Socket not connected, message not sent');
        return;
    }
    
    // Send message via socket
    socket.emit('message', {
        sessionId: chatSessionId,
        message: message,
        senderName: userName,
        isAdmin: false
    });
}

// Initialize chat when chat box is opened
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            const chatBox = document.getElementById('chat-box');
            if (chatBox && !chatBox.classList.contains('hidden')) {
                // Chat is being opened, initialize if needed
                if (!socket) {
                    initializeChat();
                }
            }
        });
    }
    
    // Handle Enter key in chat input
    const msgInput = document.getElementById('msg');
    if (msgInput) {
        msgInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMsg();
            }
        });
    }
});

// Admin login functions
function showAdminLogin() {
    document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminLogin() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

// Admin login form handler
document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    localStorage.setItem('adminToken', result.token);
                    window.location.href = '/admin';
                } else {
                    document.getElementById('loginError').textContent = 'Invalid username or password';
                }
            } catch (error) {
                document.getElementById('loginError').textContent = 'Login failed. Please try again.';
            }
        });
    }
});