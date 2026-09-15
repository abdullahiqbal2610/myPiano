# Virtual Web Piano 🎹

A fully interactive, in-browser virtual piano and synthesizer built with HTML, CSS, Javascript, and **Tone.js**. 

This project evolved from a C++ terminal application into a modern Web Application, allowing anyone to play the piano instantly from their browser without needing to download or compile any code.

## 🌟 Features

- **Interactive UI**: A beautiful, dark-themed virtual piano that lights up when you play.
- **DAW Standard Keyboard Mapping**: Uses the industry standard layout to give you two full octaves!
  - **Lower Octave (C4-B4)**: `Z, X, C, V, B, N, M` (White) | `S, D, G, H, J` (Black)
  - **Upper Octave (C5-B5)**: `Q, W, E, R, T, Y, U` (White) | `2, 3, 5, 6, 7` (Black)
- **Photorealistic Audio Engine**: Powered by `Tone.Sampler` loaded with authentic Salamander Grand Piano studio recordings.
- **Global Sheet Music**: Select a melody from the dropdown in **Manual Mode** to view the notes on screen and practice!
- **Automode (Autoplay)**: Sit back and watch the piano play itself! Select from famous melodies like:
  - *Ode to Joy (Beethoven)*
  - *Für Elise*
  - *Kal Ho Naa Ho*
  - *Tum Hi Ho*
  - *Twinkle Twinkle Little Star*

## 🚀 How to Run

Because this is a pure frontend Web Application, there are **no dependencies to install** and **no compilation required**.

1. **Clone or Download** this repository.
2. Open the folder in File Explorer.
3. **Double-click `index.html`** to open it in your default web browser (Chrome, Edge, Firefox, etc.).
4. Start playing!

> *Note: For the audio to work, web browsers require you to interact with the page first. Make sure to click anywhere on the piano or press a key to initialize the audio engine!*

## 📁 Repository Structure

- `index.html`: The main web page and structure.
- `style.css`: The styling, layout, and visual feedback for the piano keys.
- `app.js`: The core logic, audio synthesis (`Tone.js`), and Automode sequencer.
- `SheetMusic/`: A folder containing text-based sheet music for beginners.
- `legacy_cpp/`: An archive of the previous C++ Raylib implementation of this project.
