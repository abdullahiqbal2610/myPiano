# Virtual Web Piano 🎹

A fully interactive, in-browser virtual piano and synthesizer built with HTML, CSS, Javascript, and **Tone.js**. 

This project evolved from a C++ terminal application into a modern Web Application, allowing anyone to play the piano instantly from their browser without needing to download or compile any code.

## 🌟 Features

- **Interactive UI**: A beautiful, dark-themed virtual piano that lights up when you play.
- **Two-Octave Keyboard Mapping**: Play directly using your computer keyboard.
  - **Lower Octave**: `Z` to `M` (White Keys) | `S`, `D`, `G`, `H`, `J` (Black Keys)
  - **Upper Octave**: `Q` to `U` (White Keys) | `2`, `3`, `5`, `6`, `7` (Black Keys)
- **Polyphonic Audio Engine**: Powered by `Tone.js`, allowing you to play multiple complex chords simultaneously with zero latency.
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
