# Virtual Web Piano 🎹

A fully interactive, in-browser virtual piano and synthesizer built with HTML, CSS, Javascript, and **Tone.js**. 

This project was originally a C++ terminal application but has been completely rewritten and transitioned into a modern, pure Web Application. This allows anyone to play the piano instantly from their browser with high-fidelity audio, without needing to download, compile, or install any dependencies.

## 🌟 Features

- **Interactive UI**: A beautiful, dark-themed virtual piano that lights up when you play.
- **DAW Standard Keyboard Mapping**: Uses the industry standard layout to give you two full octaves!
  - **Lower Octave (C4-B4)**: `Z, X, C, V, B, N, M` (White) | `S, D, G, H, J` (Black)
  - **Upper Octave (C5-B5)**: `Q, W, E, R, T, Y, U` (White) | `2, 3, 5, 6, 7` (Black)
- **Photorealistic Audio Engine**: Powered by `Tone.Sampler` loaded with authentic Salamander Grand Piano studio recordings for zero-compromise sound quality.
- **Interactive Sheet Music**: Select a melody from the dropdown in **Manual Mode** to view the notes on screen and practice dynamically!
- **Automode (Autoplay)**: Sit back and watch the piano play itself! Features a built-in library of 30+ famous melodies including:
  - *Ode to Joy (Beethoven)*
  - *Für Elise*
  - *Kal Ho Naa Ho (Title Track)*
  - *Tum Hi Ho (Aashiqui 2)*
  - *Twinkle Twinkle Little Star*
  - *Harry Potter (Hedwig's Theme)*
  - ...and many more!

## 🚀 How to Run

Because this is a pure frontend Web Application, there are **no dependencies to install** and **no compilation required**.

1. **Clone or Download** this repository.
2. Open the folder in File Explorer.
3. **Double-click `index.html`** to open it in your default web browser (Chrome, Edge, Firefox, etc.).
4. Start playing!

> *Note: For the audio to work, web browsers require you to interact with the page first. Make sure to click anywhere on the piano or press a key to initialize the audio engine!*

## 📁 Repository Structure

The codebase has been thoroughly cleaned and streamlined to only include what's necessary for the web app:

- `index.html`: The main web page and structural entry point.
- `style.css`: The styling, layout, dark-mode aesthetics, and visual feedback for the piano keys.
- `app.js`: The core logic, Tone.js audio synthesis, keyboard mapping, and the Automode sequencer (including the JSON library of all melodies).
