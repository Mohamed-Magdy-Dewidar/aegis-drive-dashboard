# 🛡️ AegisDrive Dashboard

> The central command center for the **AegisDrive Vehicle Safety Ecosystem**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.0-purple)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-cyan)

## 📖 Overview

**AegisDrive** is a locally manufactured, AI-powered vehicle safety system that aims to prevent accidents and provide real-time evidence. This repository contains the **Frontend Dashboard**, a React-based web application that empowers fleet managers to:

- **Monitor** vehicle locations in real-time.
- **Receive** instant critical alerts (drowsiness, distraction, crash) via SignalR.
- **Review** historical safety logs and visual evidence (images/metrics) from the Edge AI device.
- **Analyze** driver behavior and safety scores.

## ✨ Key Features

- **🚨 Real-Time Alerts**: Instant red-screen popups for critical drowsiness events with latency under 200ms.
- **🗺️ Live Fleet Map**: Interactive map to track active vehicles using GPS telemetry.
- **📸 Incident Evidence**: Detailed view of safety events, including driver snapshots, road context, and EAR/MAR metrics.
- **📊 Safety Logs**: Filterable history of all alerts (Critical, High, Warning), with controls for date and severity.
- **⚡ SignalR Integration**: WebSocket-based live connection to the AegisDrive .NET backend for instant data updates.

## 🏗️ Architecture

This project is a part of a distributed IoT ecosystem:

1. **Edge Device (C++)**: A Raspberry Pi running OpenCV that detects drowsiness and publishes messages.
2. **Backend API (.NET)**: Processes telemetry data and broadcasts updates to the frontend.
3. **Frontend (React)**: Consumes updates from the backend via `SignalRContext` and visualizes data.

## 🚀 Getting Started

### Prerequisites

Ensure that you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** (choose one)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/aegis-drive-dashboard.git
    cd aegis-drive-dashboard
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment Variables**:

    Create a `.env` file in the root directory of your project with the following content:

    ```env
    VITE_API_BASE_URL=https://localhost:7199/api/v1
    VITE_SIGNALR_HUB_URL=https://localhost:7199/hubs/fleet
    ```

4. **Run the Development Server**:

    ```bash
    npm run dev
    ```

    Once the server is running, you can access the app at [http://localhost:5173](http://localhost:5173).

## 📂 Project Structure

The project is organized as follows:

```text
src/
├── api/             # Axios setup and API service calls
├── components/      # Reusable UI components (e.g., Layout, Cards, Popups)
├── context/         # React Context for state management (e.g., Auth, SignalR connection)
├── features/        # Feature-based folders (e.g., Map, Events, Auth)
├── types/           # TypeScript interfaces (e.g., IncidentDetails, Telemetry)
└── App.tsx          # Main entry point with routing setup
```
