# 🟦 Upgraded OBL Trainer

A professional, modular, and feature-rich trainer for Square-1 **Orientation of Both Layers (OBL)**. 

> **Credits:** This project is a major refactor and fork of the original trainer by Discord user `@this_is_not_matt`.

---

## 🛠 New Architecture & Refactoring

This project was recently refactored to follow **Clean Code** and **SOLID** principles. We moved away from a monolithic "god file" (`cube.js`) to a modular, maintainable structure.

* **Single Responsibility Principle (SRP):** The monolithic logic was split into dedicated modules, each with a single, clear responsibility.
* **Modular Structure:** All logic is now organized within the `/JavaScript/` directory:
    * `App.js`: Main coordinator and event entry point.
    * `Timer.js`: Core timing logic.
    * `Sidebar.js`: Grid building, filtering, and list management.
    * `Scrambler.js`: Random walk scramble generation.
    * `Solves.js`: Data persistence and statistics.

---

## ✨ Key Features

### 💾 Solve Persistence & Tracking
* **LocalStorage Save:** Your sessions are automatically saved. Closing the tab or restarting your computer won't lose your progress.
* **Per-Case Tracking:** Times are associated with specific OBL cases (e.g., `cadj/cadj`), allowing for targeted practice.

### 📊 Dynamic Statistics
* **At-a-glance Summary:** A dedicated panel highlights your overall **Best** (Gold) and **Worst** (Red) performing cases based on running averages.
* **Detailed History:** The solves list updates in real-time, showing total solve counts and individual case averages.

### 🎨 UI/UX & Visual Feedback
* **Dark Neon Theme:** A modern, high-contrast interface using "Cyan Neon" accents for better focus.
* **Responsive Design:** Optimized for both Desktop and Mobile. Includes a functional "Toggle Selector" and adaptive layouts.
* **Improved Grid:** Expanded 8-column layout (desktop) with high-quality SVG assets.

### ⚙️ Advanced Settings (New!)
* **SVG Migration:** (WIP) Moving from PNG to standardized SVG assets for crisp visuals at any zoom level. *Currently updated up to 4-Slicer cases.*

---

## 🛠 Data Management

* **Backup:** Use the **Upload (↑)** and **Download (↓)** buttons to move your data between devices.
* **Wipe:** Use the `(clear)` link in the Solves panel to reset your statistics and localStorage.

---

## 🤝 Support & Bug Reports

If you find a bug or have a suggestion, contact me on Discord: **@realxones** (Jose Solano).

---

### 📜 Legacy Notes (Original README)
* **Creator:** `@this_is_not_matt` (Original: [OBLTrainer](https://mattttttttttttttttttttttttttttttt.github.io/OBLTrainer/))
* **Notes:** `good thumb/bunny` is the one where `F` move leads to `good pairs`; `good axe/axe` are same `axe/axe`.
* **Logic:** Uses random walk for scramble generation.
