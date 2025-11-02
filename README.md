# Upgraded OBL Trainer

OBL TRAINER forked from the one made by @this_is_not_matt

## New Architecture Features

- This project was recently refactored to follow Clean Code and SOLID principles, moving away from a single "god file" (cube.js) to a modular, maintainable structure.
- Single Responsibility Principle (SRP): The monolithic cube.js file was splitted, each with a single, clear responsibility and then deleted.

## New Project Structure

- All JavaScript has been moved into a dedicated `/JavaScript/` directory.
- The Index.html structure was refactored to be more semantic and flexible.
- The scramble bar (.top-bar) was moved out to span the full width of the main view.
- The main content area (.main-columns) is now a CSS Flexbox container, allowing for a cleaner and more robust layout.

## New QOL Features

- Solve Persistence: All solves are now automatically saved to the browser's localStorage. This means your times are saved even if you close the tab or restart your computer.
- Per-Case Tracking: Times are saved and associated with the specific OBL case you solved (e.g. cadj/cadj).
- An average is displayed for each case.

### Dynamic Solves List

- A new "Solves" panel has been added, creating a 3-column layout (Cases | Timer | Solves).
- This list dynamically updates after every solve, showing your complete history.
- It displays the total solve count and a running average (avg) for each case.

### Visual Feedback

- To provide instant feedback, the list now highlights your best solve in gold and your worst solve in red for each case.
- The main timer column is now wider than the two sidebars to give it visual priority.

### Data Management

- A `(clear)` Button was added to the "Solves" panel, allowing you to easily and safely wipe all solve data from localStorage and start fresh.

---

> If you find a bug or have a suggestion, contact me on discord (@realxones)

---

### START OLD README

Creator Discord: @this_is_not_matt
Access at : https://mattttttttttttttttttttttttttttttt.github.io/OBLTrainer/

**good thumb/bunny** is the one that F move to good pairs; **good axe/axe** are same axe/axe

This trainer uses random walk to generate scrambles.

**END OLD README**
