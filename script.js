(function () {
    // 1. Inject UI Styles directly from JS
    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #ffffff;
        }
        #app-container {
            display: flex;
            width: 100vw;
            height: 100vh;
            background-color: #a3a3a3;
        }
        /* Auth Overlay */
        #auth-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        .auth-box {
            background: #5c5c5c;
            padding: 30px;
            border-radius: 8px;
            color: white;
            text-align: center;
            width: 300px;
        }
        .auth-box input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: none;
            border-radius: 4px;
        }
        .auth-box button {
            width: 100%;
            padding: 10px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
        }

        /* Sidebar Styling */
        #sidebar {
            width: 180px;
            background-color: #5c5c5c;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 10px;
            position: relative;
            border-right: 4px solid #000000;
        }
        .profile-avatar {
            width: 80px;
            height: 80px;
            background-color: #000000;
            border-radius: 50%;
            margin-bottom: 15px;
        }
        .profile-username {
            color: #000000;
            font-size: 20px;
            font-weight: 500;
            text-align: center;
            word-break: break-all;
        }
        .logout-btn {
            position: absolute;
            bottom: 40px;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            background: none;
            border: none;
            font-weight: normal;
        }
        .logout-btn:hover {
            text-decoration: underline;
        }

        /* Chat Container Styling */
        #chat-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #a3a3a3;
        }
        #messages-list {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .message-item {
            font-size: 24px;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .message-item img {
            max-width: 300px;
            max-height: 200px;
            border-radius: 6px;
            margin-top: 5px;
        }
        
        /* Input Controls */
        #input-area {
            display: flex;
            padding: 15px;
            background-color: #8c8c8c;
            gap: 10px;
            align-items: center;
        }
        #message-input {
            flex: 1;
            padding: 12px;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            outline: none;
        }
        .file-label {
            background-color: #5c5c5c;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #image-input {
            display: none;
        }
        #send-btn {
            padding: 10px 20px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // 2. Hash Detection Router
    function checkHash() {
        // Triggers if URL contains `#` (e.g. site.com/# or site.com/#chat)
        if (window.location.hash !== "") {
            renderApp();
        } else {
            document.body.innerHTML = ""; // Blank page if no hash present
        }
    }

    // Listen for hash changes in URL bar dynamically
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("load", checkHash);

    // 3. Main Application Renderer
    function renderApp() {
        document.body.innerHTML = `
            <div id="auth-overlay" style="display: none;">
                <div class="auth-box">
                    <h2>Login / Register</h2>
                    <input type="text" id="username-input" placeholder="Enter Username..." />
                    <button id="login-btn">Start Chatting</button>
                </div>
            </div>

            <div id="app-container">
                <div id="sidebar">
                    <div class="profile-avatar"></div>
                    <div class="profile-username" id="display-username">@account</div>
                    <button class="logout-btn" id="logout-btn">logout</button>
                </div>
                <div id="chat-section">
                    <div id="messages-list"></div>
                    <div id="input-area">
                        <input type="text" id="message-input" placeholder="Type a message..." />
                        <label for="image-input" class="file-label">📷 Image</label>
                        <input type="file" id="image-input" accept="image/*" />
                        <button id="send-btn">Send</button>
                    </div>
                </div>
            </div>
        `;

        // Local state setup
        let currentUser = localStorage.getItem("chat_user") || "";
        const authOverlay = document.getElementById("auth-overlay");
        const displayUsername = document.getElementById("display-username");
        const messagesList = document.getElementById("messages-list");

        // Auth Logic
        function updateAuthView() {
            if (!currentUser) {
                authOverlay.style.display = "flex";
            } else {
                authOverlay.style.display = "none";
                displayUsername.textContent = "@" + currentUser;
            }
        }

        document.getElementById("login-btn").addEventListener("click", () => {
            const val = document.getElementById("username-input").value.trim();
            if (val) {
                currentUser = val;
                localStorage.setItem("chat_user", currentUser);
                updateAuthView();
            }
        });

        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("chat_user");
            currentUser = "";
            updateAuthView();
        });

        // Initialize default mock messages to match screenshot
        const defaultMessages = [
            { user: "account", text: "yo" },
            { user: "account123", text: "sup bro" }
        ];

        function renderMessages() {
            const savedMsgs = JSON.parse(localStorage.getItem("chat_messages")) || defaultMessages;
            messagesList.innerHTML = "";
            savedMsgs.forEach(msg => {
                const item = document.createElement("div");
                item.className = "message-item";
                
                let content = `<span>@${msg.user} : ${msg.text || ''}</span>`;
                if (msg.image) {
                    content += `<img src="${msg.image}" alt="Sent image" />`;
                }
                
                item.innerHTML = content;
                messagesList.appendChild(item);
            });
            messagesList.scrollTop = messagesList.scrollHeight;
        }

        // Messaging Logic
        function sendMessage() {
            if (!currentUser) {
                alert("Please log in first!");
                return;
            }

            const textInput = document.getElementById("message-input");
            const fileInput = document.getElementById("image-input");
            const text = textInput.value.trim();
            const file = fileInput.files[0];

            if (!text && !file) return;

            const savedMsgs = JSON.parse(localStorage.getItem("chat_messages")) || defaultMessages;

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    savedMsgs.push({
                        user: currentUser,
                        text: text,
                        image: e.target.result
                    });
                    localStorage.setItem("chat_messages", JSON.stringify(savedMsgs));
                    textInput.value = "";
                    fileInput.value = "";
                    renderMessages();
                };
                reader.readAsDataURL(file);
            } else {
                savedMsgs.push({
                    user: currentUser,
                    text: text
                });
                localStorage.setItem("chat_messages", JSON.stringify(savedMsgs));
                textInput.value = "";
                renderMessages();
            }
        }

        document.getElementById("send-btn").addEventListener("click", sendMessage);
        document.getElementById("message-input").addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });

        // Initial setup calls
        updateAuthView();
        renderMessages();
    }
})();
