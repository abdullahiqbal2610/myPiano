// 1. Initialize High-Quality Acoustic Piano Sampler
const synth = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3"
    },
    release: 1.5,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

// 2. Keyboard mapping (Standard DAW Layout: 2 Octaves)
const keyMapping = [
    // Octave 4 (Lower)
    { note: "C4", type: "white", compKey: "z", label: "Z" },
    { note: "C#4", type: "black", compKey: "s", label: "S" },
    { note: "D4", type: "white", compKey: "x", label: "X" },
    { note: "D#4", type: "black", compKey: "d", label: "D" },
    { note: "E4", type: "white", compKey: "c", label: "C" },
    { note: "F4", type: "white", compKey: "v", label: "V" },
    { note: "F#4", type: "black", compKey: "g", label: "G" },
    { note: "G4", type: "white", compKey: "b", label: "B" },
    { note: "G#4", type: "black", compKey: "h", label: "H" },
    { note: "A4", type: "white", compKey: "n", label: "N" },
    { note: "A#4", type: "black", compKey: "j", label: "J" },
    { note: "B4", type: "white", compKey: "m", label: "M" },

    // Octave 5 (Upper)
    { note: "C5", type: "white", compKey: "q", label: "Q" },
    { note: "C#5", type: "black", compKey: "2", label: "2" },
    { note: "D5", type: "white", compKey: "w", label: "W" },
    { note: "D#5", type: "black", compKey: "3", label: "3" },
    { note: "E5", type: "white", compKey: "e", label: "E" },
    { note: "F5", type: "white", compKey: "r", label: "R" },
    { note: "F#5", type: "black", compKey: "5", label: "5" },
    { note: "G5", type: "white", compKey: "t", label: "T" },
    { note: "G#5", type: "black", compKey: "6", label: "6" },
    { note: "A5", type: "white", compKey: "y", label: "Y" },
    { note: "A#5", type: "black", compKey: "7", label: "7" },
    { note: "B5", type: "white", compKey: "u", label: "U" }
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
        name: "Ode to Joy",
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
    kal_ho_naa_ho: {
        name: "Kal Ho Naa Ho",
        notes: [
            { note: "E4", duration: 400 }, { note: "G4", duration: 400 }, { note: "B4", duration: 400 }, { note: "A4", duration: 1000 },
            { note: "comma" },
            { note: "G4", duration: 400 }, { note: "F#4", duration: 400 }, { note: "E4", duration: 1000 },
            { note: "comma" },
            { note: "E4", duration: 400 }, { note: "G4", duration: 400 }, { note: "B4", duration: 400 }, { note: "D5", duration: 800 },
            { note: "C5", duration: 800 }
        ]
    },
    star_wars: {
        name: "Star Wars Theme",
        notes: [
            { note: "D4", duration: 300 }, { note: "D4", duration: 300 }, { note: "D4", duration: 300 },
            { note: "G4", duration: 1200 }, { note: "D5", duration: 1200 },
            { note: "comma" },
            { note: "C5", duration: 300 }, { note: "B4", duration: 300 }, { note: "A4", duration: 300 },
            { note: "G5", duration: 1200 }, { note: "D5", duration: 800 },
            { note: "comma" },
            { note: "C5", duration: 300 }, { note: "B4", duration: 300 }, { note: "A4", duration: 300 },
            { note: "G5", duration: 1200 }, { note: "D5", duration: 800 }
        ]
    },
    harry_potter: {
        name: "Harry Potter (Hedwig's Theme)",
        notes: [
            { note: "B4", duration: 500 }, 
            { note: "E5", duration: 800 }, { note: "G5", duration: 300 }, { note: "F#5", duration: 500 },
            { note: "E5", duration: 1000 }, { note: "B5", duration: 500 },
            { note: "comma" },
            { note: "A5", duration: 1200 }, { note: "F#5", duration: 1000 },
            { note: "comma" },
            { note: "E5", duration: 800 }, { note: "G5", duration: 300 }, { note: "F#5", duration: 500 },
            { note: "D#5", duration: 1000 }, { note: "F5", duration: 500 }, { note: "B4", duration: 1500 }
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

    // 2. Build Computer Keyboard Visuals (2 Octaves)
    compKeyboardContainer.innerHTML = "";
    const rows = [
        ['2', '3', '5', '6', '7'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u'],
        ['s', 'd', 'g', 'h', 'j'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    rows.forEach((row, index) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";
        if (index === 0) rowEl.style.marginLeft = "-60px"; // offset numbers
        if (index === 2) rowEl.style.marginLeft = "30px"; // offset S-D row
        if (index === 3) rowEl.style.marginLeft = "60px"; // offset Z-X row

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
    if (melodyKey === "none") {
        sheetMusicContainer.style.display = "none";
        return;
    }
    
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
                noteBlock.innerText = keyData.label; 
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
    } else {
        autoControls.style.display = "none";
        stopAutoPlay();
    }
});

// Melody selection is now independent of the mode
melodySelect.addEventListener("change", (e) => {
    renderSheetMusic(e.target.value);
    stopAutoPlay();
});

// Autoplay logic
playBtn.addEventListener("click", async () => {
    if (melodySelect.value === "none") return;
    
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
