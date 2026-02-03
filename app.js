const SERVICES = [
    {
        name: "Paper Trading Service",
        url: "https://trademaster-paper-trading-service.onrender.com/health",
        id: "paper-service"
    },
    {
        name: "Watchlist Service",
        url: "https://trademaster-watchlist-generation-service.onrender.com/health",
        id: "watchlist-service"
    },
    {
        name: "TradeMaster Backend",
        url: "https://trademasterbackend.onrender.com/health",
        id: "backend"
    },
    {
        name: "ICICI Breeze Interface",
        url: "https://icici-dirct-breeze-api-interface.onrender.com/health",
        id: "breeze-interface"
    }
];

const PING_INTERVAL_MIN = 14;
let nextPingTime = Date.now() + (PING_INTERVAL_MIN * 60 * 1000);

// Initialize Lucide Icons
lucide.createIcons();

// --- DOM Elements ---
const servicesContainer = document.getElementById('services-container');
const logsContainer = document.getElementById('logs');
const countdownEl = document.getElementById('countdown');
const istTimeEl = document.getElementById('ist-time');
const sleepBadge = document.getElementById('sleep-badge');
const systemStateEl = document.getElementById('system-state');
const clearLogsBtn = document.getElementById('clear-logs');

// --- Initialization ---
function init() {
    renderServices();
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);

    // Initial Ping
    performGlobalPing();
}

function renderServices() {
    servicesContainer.innerHTML = SERVICES.map(service => `
        <a href="${service.url}" target="_blank" class="service-card-link">
            <div class="service-card" id="card-${service.id}">
                <div class="service-info">
                    <h3>${service.name}</h3>
                </div>
                <div class="service-status">
                    <div class="status-indicator">
                        <div class="dot" id="dot-${service.id}"></div>
                        <span id="text-${service.id}">INITIALIZING</span>
                    </div>
                    <i data-lucide="external-link" size="14" class="link-icon"></i>
                </div>
            </div>
        </a>
    `).join('');
    // Re-run lucide icons for new content
    lucide.createIcons();
}

// --- Logic ---
function updateClock() {
    const now = new Date();
    const istString = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    istTimeEl.textContent = `${istString} IST`;

    // Sleep Time Check (12 AM to 7 AM IST)
    const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istDate.getHours();

    if (hours >= 0 && hours < 7) {
        sleepBadge.textContent = "SLEEP MODE (SILENT)";
        sleepBadge.className = "badge sleep";
        systemStateEl.textContent = "IDLE";
        systemStateEl.className = "stat-value";
    } else {
        sleepBadge.textContent = "ACTIVE MONITORING";
        sleepBadge.className = "badge";
    }
}

function updateCountdown() {
    const now = Date.now();
    const diff = nextPingTime - now;

    if (diff <= 0) {
        performGlobalPing();
        nextPingTime = Date.now() + (PING_INTERVAL_MIN * 60 * 1000);
        return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function performGlobalPing() {
    // Check if it's sleep time
    const istDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istDate.getHours();

    if (hours >= 0 && hours < 7) {
        addLog("Pings skipped. System in Sleep Mode (12 AM - 7 AM IST).", "log-sleep");
        return;
    }

    addLog("Initiating global pulse...", "log-pulse");

    const results = await Promise.all(SERVICES.map(service => pingService(service)));

    const allHealthy = results.every(r => r === true);
    systemStateEl.textContent = allHealthy ? "HEALTHY" : "DEGRADED";
    systemStateEl.className = allHealthy ? "stat-value text-success" : "stat-value text-error";
}

async function pingService(service) {
    const dot = document.getElementById(`dot-${service.id}`);
    const text = document.getElementById(`text-${service.id}`);

    dot.className = "dot pending";
    text.textContent = "PINGING...";

    try {
        const start = Date.now();
        // Use a cache buster and mode: no-cors if restricted, but health endpoints should ideally be open
        const response = await fetch(service.url + "?t=" + start, {
            method: 'GET',
            mode: 'no-cors' // Render will still spin up on any request, even if CORS fails
        });

        const latency = Date.now() - start;

        dot.className = "dot online";
        text.textContent = `ONLINE (${latency}ms)`;
        addLog(`Pulse received from ${service.name} [${latency}ms]`, "log-success");
        return true;
    } catch (err) {
        dot.className = "dot offline";
        text.textContent = "OFFLINE";
        addLog(`ERROR: Pulse lost for ${service.name}`, "log-error");
        return false;
    }
}

function addLog(message, colorClass = "") {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour12: false });

    const entry = document.createElement('div');
    entry.className = `log-entry ${colorClass}`;
    entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;

    logsContainer.prepend(entry);

    // Keep only last 50 logs
    if (logsContainer.children.length > 50) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

clearLogsBtn.addEventListener('click', () => {
    logsContainer.innerHTML = '<div class="log-entry">Logs cleared.</div>';
});

// Boot
init();
