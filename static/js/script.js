        // Configuration - injectée par templates/index.html depuis les variables du .env
        const CONFIG = window.NORA_CONFIG || {
            portfolio: '#',
            github: '#',
            linkedin: '#',
            twitter: '#'
        };

        // Initialize social links
        function initSocialLinks() {
            const socialLinks = [
                { icon: 'fas fa-briefcase', label: 'Portfolio', url: CONFIG.portfolio },
                { icon: 'fab fa-github', label: 'GitHub', url: CONFIG.github },
                { icon: 'fab fa-linkedin', label: 'LinkedIn', url: CONFIG.linkedin },
                { icon: 'fab fa-twitter', label: 'Twitter', url: CONFIG.twitter }
            ];

            const container = document.getElementById('socialLinks');
            container.innerHTML = socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="${link.icon}"></i>
                    <span>${link.label}</span>
                </a>
            `).join('');
        }

        // Toggle sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Close sidebar when clicking overlay
        document.getElementById('overlay').addEventListener('click', toggleSidebar);

        // Chat functionality
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const welcomeScreen = document.getElementById('welcomeScreen');

        // Add message to chat
        function addMessage(text, isUser = false) {
            // Hide welcome screen on first message
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            if (isUser) {
                avatar.innerHTML = '<i class="fas fa-user" style="color: #b4b4b4; font-size: 18px;"></i>';
            } else {
                avatar.innerHTML = `
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="var(--dark-bg)" stroke="var(--pink-primary)" stroke-width="2"/>
                        <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="var(--pink-primary)" opacity="0.8"/>
                        <circle cx="50" cy="50" r="15" fill="var(--pink-primary)"/>
                    </svg>
                `;
            }
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = text;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatMessages.appendChild(messageDiv);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Add typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typingIndicator';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="var(--dark-bg)" stroke="var(--pink-primary)" stroke-width="2"/>
                    <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="var(--pink-primary)" opacity="0.8"/>
                    <circle cx="50" cy="50" r="15" fill="var(--pink-primary)"/>
                </svg>
            `;
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            
            content.appendChild(indicator);
            typingDiv.appendChild(avatar);
            typingDiv.appendChild(content);
            chatMessages.appendChild(typingDiv);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remove typing indicator
        function hideTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.remove();
            }
        }

        // Simulate typing effect
        function typeMessage(text, callback) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="var(--dark-bg)" stroke="var(--pink-primary)" stroke-width="2"/>
                    <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="var(--pink-primary)" opacity="0.8"/>
                    <circle cx="50" cy="50" r="15" fill="var(--pink-primary)"/>
                </svg>
            `;
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = '';
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatMessages.appendChild(messageDiv);
            
            let index = 0;
            const typingSpeed = 20;
            
            function type() {
                if (index < text.length) {
                    content.textContent += text.charAt(index);
                    index++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(type, typingSpeed);
                } else if (callback) {
                    callback();
                }
            }
            
            type();
        }

        // Send message
        async function sendMessage() {
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            // Disable input
            messageInput.disabled = true;
            sendBtn.disabled = true;
            
            // Add user message
            addMessage(message, true);
            messageInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                
                // Hide typing indicator
                hideTypingIndicator();
                
                if (data.reply) {
                    // Type the message with animation
                    typeMessage(data.reply, () => {
                        messageInput.disabled = false;
                        sendBtn.disabled = false;
                        messageInput.focus();
                    });
                } else {
                    addMessage("Désolé, je n'ai pas pu traiter votre demande.", false);
                    messageInput.disabled = false;
                    sendBtn.disabled = false;
                }
            } catch (error) {
                hideTypingIndicator();
                addMessage("Une erreur s'est produite. Veuillez réessayer.", false);
                messageInput.disabled = false;
                sendBtn.disabled = false;
            }
        }

        // Enter key to send
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Initialize
        initSocialLinks();
        messageInput.focus();
