# 🟦 Upgraded OBL Trainer

![Status](https://img.shields.io/badge/Status-Refactored-success)
![Architecture](https://img.shields.io/badge/Architecture-Modular%20%2F%20SOLID-blue)
[![Demo](https://img.shields.io/badge/Demo-Start_Training-brightgreen)](https://jdsolano02.github.io/OBLTrainer/)

> **🔴 Live App:** [Click here to launch the Trainer](https://jdsolano02.github.io/OBLTrainer/)

## 📖 Project Overview

A professional, modular, and feature-rich trainer for **Square-1 Orientation of Both Layers (OBL)**.

This project represents a **major refactor and modernization** of the original trainer created by the community. My primary goal was to transform the codebase from a legacy script into a scalable, maintainable application following modern software engineering standards.

---

## 🛠 Architecture & Refactoring (Engineering Spotlight)

The core value of this update is the shift towards **Clean Code** and **SOLID principles**.

* **From Monolith to Modular:** We migrated away from a legacy "god file" (`cube.js`) that handled everything, moving to a structured architecture where concerns are separated.
* **Single Responsibility Principle (SRP):** Each logic component now resides in its own dedicated module within the `/JavaScript/` directory:

| Module | Responsibility |
| :--- | :--- |
| `App.js` | Main coordinator and event entry point. |
| `Timer.js` | Core timing logic and state management. |
| `Sidebar.js` | Grid rendering, filtering, and DOM list management. |
| `Scrambler.js` | Random walk scramble generation algorithms. |
| `Solves.js` | Data persistence (LocalStorage) and statistics calculation. |

---

## ✨ Key Features

### 💾 Solve Persistence & Tracking
* **LocalStorage Save:** Sessions are automatically saved. Closing the tab or restarting the browser won't result in data loss.
* **Per-Case Tracking:** Times are linked to specific OBL cases (e.g., `cadj/cadj`), enabling targeted practice on weak spots.

### 📊 Dynamic Statistics
* **At-a-glance Summary:** A dedicated panel highlights your **Best** (Gold) and **Worst** (Red) performing cases based on running averages.
* **Real-time History:** The solve list updates instantly, displaying total solve counts and individual case averages.

### 🎨 UI/UX & Visual Feedback
* **Dark Neon Theme:** A modern, high-contrast interface using "Cyan Neon" accents to reduce eye strain during long practice sessions.
* **Responsive Design:** Optimized layout for both Desktop and Mobile. Includes a functional "Toggle Selector" and adaptive grids.
* **Improved Grid:** Expanded 8-column layout (on desktop) for better visibility.

---

## ⚙️ Advanced Settings & WIP

### SVG Migration (Work in Progress)
I am currently migrating visual assets from PNG to standardized **SVGs**. This ensures crisp visuals at any zoom level on any device.
* *Status:* Updated up to 4-Slicer cases.

### 🛠 Data Management
* **Backup:** Use the **Upload (↑)** and **Download (↓)** buttons to transfer your stats between devices.
* **Wipe:** Use the `(clear)` link in the Solves panel to reset statistics and LocalStorage if needed.

---

## 🤝 Credits

* **Refactor & Maintainer:** [Jose Solano (@realxones)](https://github.com/jdsolano02)
* **Original Creator:** Discord user `@this_is_not_matt`

## 🗂 Legacy

* **Algorithm Logic:** Uses random walk for scramble generation.
* **Legacy Notes:** *good thumb/bunny* refers to cases where F move leads to good pairs; *good axe/axe* are same axe/axe.

> **Found a bug?** Please [Open an Issue](https://github.com/jdsolano02/OBLTrainer/issues) on GitHub or contact me on Discord `@realxones`.
