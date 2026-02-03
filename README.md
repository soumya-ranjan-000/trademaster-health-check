# TradeMaster | Service Sentinel 🛡️

A premium, static dashboard designed to monitor and keep-alive the TradeMaster ecosystem services hosted on Render.

## Features

- **Keep-Alive Pulses**: Pings all services every **14 minutes** to prevent Render's free-tier 15-minute hibernation.
- **IST Smart Scheduling**: Automatically observes "Sleep Mode" between **12:00 AM and 7:00 AM IST** to save resources and comply with sleep hours.
- **Deep Status Monitoring**: Real-time dashboard showing latency and system health.
- **Zero-Downtime Hosting**: Designed to be hosted on **GitHub Pages**.

## Services Monitored

1. **Paper Trading Service** (`trademaster-paper-trading-service`)
2. **Watchlist Service** (`trademaster-watchlist-generation-service`)
3. **Main Backend** (`TradeMasterBackend`)
4. **ICICI Breeze Interface** (`icici-dirct-breeze-api-interface`)

## Setup Instructions

1. Create a new repository on GitHub.
2. Upload the files in this directory (`index.html`, `style.css`, `app.js`).
3. Go to **Settings > Pages** in your GitHub repository.
4. Select `main` branch and `/root` folder, then click **Save**.
5. Your dashboard will be live at `https://your-username.github.io/your-repo-name/`.

## Usage

Simply keep this dashboard open in a browser tab on any computer or server. As long as the tab is active, it will act as the "heartbeat" for your entire infrastructure.

---
*Built for the TradeMaster Ecosystem • 2026*
