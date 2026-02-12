// Additional chat functionality and utilities
// This file provides supplementary chat features

// Auto-reconnect functionality
function setupAutoReconnect() {
    if (socket) {
        socket.on('disconnect', function() {
            console.log('Chat disconnected, attempting to reconnect...');
            setTimeout(() => {
                if (!socket.connected) {
                    initializeChat();
                }
            }, 2000);
        });
    }
}

// Clear chat history (for testing purposes)
function clearChatHistory() {
    localStorage.removeItem('chatSessionId');
    localStorage.removeItem('chatUserName');
    const messages = document.getElementById('messages');
    if (messages) {
        messages.innerHTML = '';
    }
}

// Show typing indicator (future enhancement)
function showTypingIndicator(isTyping) {
    // This can be implemented later for enhanced UX
    console.log('Typing indicator:', isTyping);
}

// Initialize additional chat features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup auto-reconnect after socket is initialized
    setTimeout(() => {
        if (socket) {
            setupAutoReconnect();
        }
    }, 1000);
});