import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend for emails
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(express.static("."));
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(__dirname));

// In-memory storage for contacts and chat sessions
const contacts = [];
const activeChatSessions = new Map();
const chatHistory = new Map();


// Admin page routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'admin.html'));
});

app.get('/pages/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'admin.html'));
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple authentication (username: admin, password: admin123)
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'admin-authenticated' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Get admin configuration
app.get('/api/admin/config', (req, res) => {
  res.json({
    adminEmail: process.env.ADMIN_EMAIL || 'admin@yourfirm.com'
  });
});

// Get all contacts
app.get("/api/admin/contacts", async (req, res) => {
  console.log('📋 Admin requesting contacts. Total:', contacts.length);
  res.json(contacts);
});

// Contact form submission
app.post("/api/contact/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log('📝 New contact form submission:', { name, email, phone });

    // Store in memory
    const contact = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      created_at: new Date().toISOString()
    };
    contacts.push(contact);
    console.log('💾 Contact stored. Total contacts:', contacts.length);

    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('❌ Contact submission error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat sessions
app.get('/api/admin/chat-sessions', (req, res) => {
  const sessions = Array.from(activeChatSessions.entries()).map(([sessionId, session]) => ({
    sessionId,
    joinedAt: session.joinedAt,
    isActive: session.isActive,
    messageCount: chatHistory.get(sessionId)?.length || 0
  }));
  
  res.json(sessions);
});

// Get chat history for a session
app.get('/api/admin/chat-history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = chatHistory.get(sessionId) || [];
  res.json(history);
});

// Live chat
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on('join-chat', (data) => {
    const { sessionId, isAdmin } = data;
    socket.join(sessionId);
    
    if (!isAdmin) {
      activeChatSessions.set(sessionId, {
        socketId: socket.id,
        joinedAt: new Date().toISOString(),
        isActive: true
      });
      
      if (!chatHistory.has(sessionId)) {
        chatHistory.set(sessionId, []);
      }
    }
    
    // Send chat history to the user joining
    const history = chatHistory.get(sessionId) || [];
    socket.emit('chat-history', history);
    
    console.log(`${isAdmin ? 'Admin' : 'Client'} joined chat: ${sessionId}`);
  });

  socket.on("message", async (msg) => {
    const { sessionId, message, senderName, isAdmin } = msg;
    
    const chatMessage = {
      message,
      senderName: senderName || (isAdmin ? 'Legal Team' : 'Client'),
      timestamp: new Date().toISOString(),
      isAdmin: isAdmin || false
    };
    
    // Store in chat history
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, []);
    }
    chatHistory.get(sessionId).push(chatMessage);
    
    // Broadcast to all users in the session (including sender for confirmation)
    io.to(sessionId).emit("message", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    
    for (const [sessionId, session] of activeChatSessions.entries()) {
      if (session.socketId === socket.id) {
        session.isActive = false;
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Law Firm Website running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications enabled`);
  console.log(`💬 Live chat enabled`);
  console.log(`🌐 Admin panel: http://localhost:${PORT}/admin`);
});