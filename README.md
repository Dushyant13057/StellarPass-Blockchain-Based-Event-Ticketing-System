<div align="center">

# 🎟️ StellarPass

### *Secure • Transparent • Blockchain-Powered Event Ticketing*

<p>
A modern decentralized event ticketing platform built on the <b>Stellar Blockchain</b> that enables secure ticket purchases, blockchain-verified ownership, and QR-based event entry.
</p>

<p>

![GitHub stars](https://img.shields.io/github/stars/your-username/stellarpass?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/your-username/stellarpass?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/your-username/stellarpass?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb)
![Stellar](https://img.shields.io/badge/Stellar-Blockchain-000000?style=for-the-badge)

</p>

---

### 🚀 Live Demo *(Coming Soon)*

🌐 Website: **Coming Soon**

📽️ Demo Video: **Coming Soon**

📄 Documentation: **Coming Soon**

---

## ✨ Why StellarPass?

Most event ticketing systems rely on centralized databases, making them vulnerable to ticket duplication, fraud, and manual verification.

**StellarPass** introduces a blockchain-first approach where every ticket purchase is backed by a verified Stellar transaction, giving attendees and organizers a transparent, secure, and trustworthy experience.

---

## 🎯 Key Highlights

✨ Secure XLM Payments via Freighter Wallet

🔐 Blockchain Transaction Verification

🎫 QR Code Based Digital Tickets

📊 Organizer Analytics Dashboard

⚡ Instant Ticket Validation

📱 Fully Responsive UI

🌙 Dark Mode Support

🛡️ Fraud Prevention using Blockchain

---

# 🖥️ System Architecture

```text
                    ┌────────────────────────────┐
                    │        React + Vite        │
                    │       Frontend (UI)        │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                     REST API (Express.js)
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
    MongoDB Database       Stellar SDK            Freighter Wallet
          │                       │                       │
          └─────────────── Horizon Testnet ──────────────┘
                                  │
                                  ▼
                     Blockchain Transaction Verification
```

---

# 🌟 Core Features

| 👤 Attendees              | 🎯 Organizers                  |
| ------------------------- | ------------------------------ |
| Connect Freighter Wallet  | Create & Manage Events         |
| Browse Events             | View Ticket Sales              |
| Purchase Tickets with XLM | Scan QR Tickets                |
| Download QR Ticket        | Verify Blockchain Transactions |
| View Ticket History       | Analytics Dashboard            |
| Manage Wallet             | Attendee Management            |

---

# ⚙️ Tech Stack

| Category   | Technologies                               |
| ---------- | ------------------------------------------ |
| Frontend   | React, Vite, Tailwind CSS, React Router    |
| Backend    | Node.js, Express.js                        |
| Database   | MongoDB, Mongoose                          |
| Blockchain | Stellar SDK, Horizon API, Freighter Wallet |
| Utilities  | QR Code Generator, HTML5 QR Scanner        |

---

# 🔄 Ticket Purchase Flow

```text
Browse Event
      │
      ▼
Connect Freighter Wallet
      │
      ▼
Approve XLM Payment
      │
      ▼
Transaction Submitted
      │
      ▼
Horizon Verification
      │
      ▼
Ticket Created
      │
      ▼
QR Code Generated
      │
      ▼
Ready for Event Entry
```

---

# 🎫 Event Entry Verification

```text
Scan QR Code
      │
      ▼
Retrieve Ticket
      │
      ▼
Verify Stellar Transaction
      │
      ▼
Check Ticket Status
      │
      ▼
Valid ✅
      │
      ▼
Mark as USED
```

---

# 📂 Project Structure

```text
stellarpass
│
├── client
│   ├── components
│   ├── pages
│   ├── services
│   ├── hooks
│   ├── assets
│   └── utils
│
├── server
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── models
│   └── config
│
└── README.md
```

---

# 📸 Screenshots

| Home               | Event Details      |
| ------------------ | ------------------ |
| *(Add Screenshot)* | *(Add Screenshot)* |

| Organizer Dashboard | QR Scanner         |
| ------------------- | ------------------ |
| *(Add Screenshot)*  | *(Add Screenshot)* |

---

# 🚀 Roadmap

* ✅ Wallet Authentication
* ✅ Stellar Testnet Payments
* ✅ QR Ticket Generation
* ✅ Ticket Verification
* ⏳ Email Notifications
* ⏳ NFT Tickets
* ⏳ Soroban Smart Contracts
* ⏳ Mobile Application

---

# 👨‍💻 Developed By

**Dushyant Sharnagat**

B.Tech CSE (Data Science)

Blockchain • Full Stack Development • Cybersecurity

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

**Building the future of event ticketing with Stellar Blockchain.**

</div>
