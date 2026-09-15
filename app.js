// 1. Initialize High-Quality Acoustic Piano Sampler
const synth = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3"
    },
    release: 1.5,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

// 2. Reverted to Original Key Mapping (Muscle Memory Saved!)
const keyMapping = [
    { note: "C4", type: "white", compKey: "a", label: "A" },
    { note: "C#4", type: "black", compKey: "w", label: "W" },
    { note: "D4", type: "white", compKey: "s", label: "S" },
    { note: "D#4", type: "black", compKey: "e", label: "E" },
    { note: "E4", type: "white", compKey: "d", label: "D" },
    { note: "F4", type: "white", compKey: "f", label: "F" },
    { note: "F#4", type: "black", compKey: "t", label: "T" },
    { note: "G4", type: "white", compKey: "g", label: "G" },
    { note: "G#4", type: "black", compKey: "y", label: "Y" },
    { note: "A4", type: "white", compKey: "h", label: "H" },
    { note: "A#4", type: "black", compKey: "u", label: "U" },
    { note: "B4", type: "white", compKey: "j", label: "J" },
    { note: "C5", type: "white", compKey: "k", label: "K" }
];

const pressedKeys = new Set();
let isAutoPlaying = false;
let autoPlayTimeouts = [];

// DOM Elements
const pianoContainer = document.getElementById("piano-container");
const compKeyboardContainer = document.getElementById("computer-keyboard-container");
const modeSelect = document.getElementById("mode-select");
const autoControls = document.querySelector(".auto-controls");
const playBtn = document.getElementById("play-btn");
const stopBtn = document.getElementById("stop-btn");
const melodySelect = document.getElementById("melody-select");
const sheetMusicContainer = document.getElementById("sheet-music-container");
const sheetMusicDisplay = document.getElementById("sheet-music-display");
const currentMelodyName = document.getElementById("current-melody-name");

// Expanded Melodies
const melodies = {
    ode_to_joy: {
        name: "Ode to Joy (Beethoven)",
        notes: [
            { note: "E4", duration: 500 }, { note: "E4", duration: 500 }, { note: "F4", duration: 500 }, { note: "G4", duration: 500 },
            { note: "comma" },
            { note: "G4", duration: 500 }, { note: "F4", duration: 500 }, { note: "E4", duration: 500 }, { note: "D4", duration: 500 },
            { note: "comma" },
            { note: "C4", duration: 500 }, { note: "C4", duration: 500 }, { note: "D4", duration: 500 }, { note: "E4", duration: 500 },
            { note: "comma" },
            { note: "E4", duration: 750 }, { note: "D4", duration: 250 }, { note: "D4", duration: 1000 }
        ]
    },
    twinkle: {
        name: "Twinkle Twinkle Little Star",
        notes: [
            { note: "C4", duration: 500 }, { note: "C4", duration: 500 }, { note: "G4", duration: 500 }, { note: "G4", duration: 500 },
            { note: "A4", duration: 500 }, { note: "A4", duration: 500 }, { note: "G4", duration: 1000 },
            { note: "comma" },
            { note: "F4", duration: 500 }, { note: "F4", duration: 500 }, { note: "E4", duration: 500 }, { note: "E4", duration: 500 },
            { note: "D4", duration: 500 }, { note: "D4", duration: 500 }, { note: "C4", duration: 1000 }
        ]
    },
    happy_birthday: {
        name: "Happy Birthday",
        notes: [
            { note: "C4", duration: 400 }, { note: "C4", duration: 200 }, { note: "D4", duration: 600 }, { note: "C4", duration: 600 },
            { note: "F4", duration: 600 }, { note: "E4", duration: 1200 },
            { note: "comma" },
            { note: "C4", duration: 400 }, { note: "C4", duration: 200 }, { note: "D4", duration: 600 }, { note: "C4", duration: 600 },
            { note: "G4", duration: 600 }, { note: "F4", duration: 1200 },
            { note: "comma" },
            { note: "C4", duration: 400 }, { note: "C4", duration: 200 }, { note: "C5", duration: 600 }, { note: "A4", duration: 600 },
            { note: "F4", duration: 600 }, { note: "E4", duration: 600 }, { note: "D4", duration: 1200 }
        ]
    },
    jingle_bells: {
        name: "Jingle Bells",
        notes: [
            { note: "E4", duration: 300 }, { note: "E4", duration: 300 }, { note: "E4", duration: 600 },
            { note: "comma" },
            { note: "E4", duration: 300 }, { note: "E4", duration: 300 }, { note: "E4", duration: 600 },
            { note: "comma" },
            { note: "E4", duration: 300 }, { note: "G4", duration: 300 }, { note: "C4", duration: 400 }, { note: "D4", duration: 200 }, { note: "E4", duration: 800 }
        ]
    }
};

// Build UI
function initUI() {
    // 1. Build Piano
    pianoContainer.innerHTML = "";
    keyMapping.forEach(key => {
        const keyEl = document.createElement("div");
        keyEl.className = `piano-key ${key.type}`;
        keyEl.dataset.note = key.note;
        keyEl.dataset.comp = key.compKey;
        keyEl.id = `piano-${key.compKey}`;

        keyEl.innerText = key.label;

        keyEl.addEventListener("mousedown", () => triggerNoteOn(key.compKey));
        keyEl.addEventListener("mouseup", () => triggerNoteOff(key.compKey));
        keyEl.addEventListener("mouseleave", () => triggerNoteOff(key.compKey));

        pianoContainer.appendChild(keyEl);
    });

    // 2. Build Computer Keyboard (Original A-K mapping)
    compKeyboardContainer.innerHTML = "";
    const rows = [
        ['w', 'e', 't', 'y', 'u'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k']
    ];

    rows.forEach((row, index) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";
        if (index === 0) rowEl.style.marginLeft = "30px"; // offset W-E row to align like piano

        row.forEach(key => {
            const keyData = keyMapping.find(k => k.compKey === key);

            const keyEl = document.createElement("div");
            keyEl.className = "comp-key";
            keyEl.id = `comp-${key}`;
            keyEl.innerText = key.toUpperCase();

            if (keyData) {
                const noteSpan = document.createElement("span");
                noteSpan.innerText = keyData.note;
                keyEl.appendChild(noteSpan);
            }

            rowEl.appendChild(keyEl);
        });
        compKeyboardContainer.appendChild(rowEl);
    });
}

function renderSheetMusic(melodyKey) {
    sheetMusicContainer.style.display = "block";
    sheetMusicDisplay.innerHTML = "";
    
    const melody = melodies[melodyKey];
    currentMelodyName.innerText = melody.name;

    melody.notes.forEach((item, idx) => {
        if (item.note === "comma") {
            const comma = document.createElement("div");
            comma.className = "sheet-comma";
            comma.innerText = ",";
            sheetMusicDisplay.appendChild(comma);
        } else {
            const keyData = keyMapping.find(k => k.note === item.note);
            if (keyData) {
                const noteBlock = document.createElement("div");
                noteBlock.className = "sheet-note";
                noteBlock.id = `sheet-note-${idx}`;
                noteBlock.innerText = keyData.label; // E.g., 'A', 'S', etc.
                sheetMusicDisplay.appendChild(noteBlock);
            }
        }
    });
}

// Audio & Visual Triggers
async function triggerNoteOn(compKey, sheetNoteId = null) {
    if (pressedKeys.has(compKey)) return;

    const keyData = keyMapping.find(k => k.compKey === compKey);
    if (!keyData) return;

    await Tone.start();

    pressedKeys.add(compKey);
    // Ensure the sampler has loaded before triggering to avoid warnings
    if (synth.loaded) {
        synth.triggerAttack(keyData.note);
    }

    // Visuals
    const pKey = document.getElementById(`piano-${compKey}`);
    const cKey = document.getElementById(`comp-${compKey}`);
    if (pKey) pKey.classList.add("active");
    if (cKey) cKey.classList.add("active");

    if (sheetNoteId) {
        const sNote = document.getElementById(sheetNoteId);
        if (sNote) sNote.classList.add("playing");
    }
}

function triggerNoteOff(compKey, sheetNoteId = null) {
    if (!pressedKeys.has(compKey)) return;

    const keyData = keyMapping.find(k => k.compKey === compKey);
    if (!keyData) return;

    pressedKeys.delete(compKey);
    if (synth.loaded) {
        synth.triggerRelease(keyData.note);
    }

    // Visuals
    const pKey = document.getElementById(`piano-${compKey}`);
    const cKey = document.getElementById(`comp-${compKey}`);
    if (pKey) pKey.classList.remove("active");
    if (cKey) cKey.classList.remove("active");

    if (sheetNoteId) {
        const sNote = document.getElementById(sheetNoteId);
        if (sNote) sNote.classList.remove("playing");
    }
}

// Global Keyboard Events
window.addEventListener("keydown", (e) => {
    if (isAutoPlaying || e.repeat) return;
    const key = e.key.toLowerCase();
    triggerNoteOn(key);
});

window.addEventListener("keyup", (e) => {
    if (isAutoPlaying) return;
    const key = e.key.toLowerCase();
    triggerNoteOff(key);
});

// Mode switching
modeSelect.addEventListener("change", (e) => {
    if (e.target.value === "auto") {
        autoControls.style.display = "flex";
        // Show sheet music for the currently selected melody
        renderSheetMusic(melodySelect.value);
    } else {
        autoControls.style.display = "none";
        sheetMusicContainer.style.display = "none";
        stopAutoPlay();
    }
});

melodySelect.addEventListener("change", (e) => {
    if (modeSelect.value === "auto") {
        renderSheetMusic(e.target.value);
    }
});

// Autoplay logic
playBtn.addEventListener("click", async () => {
    await Tone.start();
    stopAutoPlay();
    isAutoPlaying = true;

    const melody = melodies[melodySelect.value];
    let currentTime = 0;

    melody.notes.forEach((item, idx) => {
        if (item.note === "comma") {
            currentTime += 200; // Small pause
            return;
        }

        const keyData = keyMapping.find(k => k.note === item.note);
        if (!keyData) return;

        const sheetNoteId = `sheet-note-${idx}`;

        // Schedule Note On
        const t1 = setTimeout(() => {
            triggerNoteOn(keyData.compKey, sheetNoteId);
        }, currentTime);

        // Schedule Note Off
        const t2 = setTimeout(() => {
            triggerNoteOff(keyData.compKey, sheetNoteId);
        }, currentTime + item.duration - 50);

        autoPlayTimeouts.push(t1, t2);
        currentTime += item.duration;
    });

    // Reset when done
    autoPlayTimeouts.push(setTimeout(() => {
        isAutoPlaying = false;
    }, currentTime));
});

stopBtn.addEventListener("click", stopAutoPlay);

function stopAutoPlay() {
    isAutoPlaying = false;
    autoPlayTimeouts.forEach(clearTimeout);
    autoPlayTimeouts = [];

    // Release all notes and clear highlighting
    pressedKeys.forEach(compKey => triggerNoteOff(compKey));
    document.querySelectorAll(".sheet-note.playing").forEach(el => el.classList.remove("playing"));
}

// Init
initUI();
