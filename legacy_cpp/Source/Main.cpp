#define TSF_IMPLEMENTATION
#include "tsf.h"
#include "RtAudio.h"
#include "raylib.h"
#include <iostream>
#include <vector>
#include <map>
#include <mutex>
#include <string>

const unsigned int SAMPLE_RATE = 44100;
tsf* g_TinySoundFont = nullptr;
std::mutex g_Mutex;

// RtAudio callback
int audioCallback(void* outputBuffer, void* /*inputBuffer*/, unsigned int nBufferFrames,
                  double /*streamTime*/, RtAudioStreamStatus status, void* /*userData*/)
{
    float* buffer = (float*)outputBuffer;
    std::lock_guard<std::mutex> lock(g_Mutex);
    
    if (g_TinySoundFont) {
        tsf_render_float(g_TinySoundFont, buffer, nBufferFrames, 0);
    } else {
        for (unsigned int i = 0; i < nBufferFrames * 2; ++i) {
            buffer[i] = 0.0f;
        }
    }
    return 0;
}

// Structure for a Piano Key
struct PianoKey {
    int midiNote;
    int keyboardKey;
    bool isBlack;
    Rectangle rect;
    bool isPressed;
    std::string label;
};

// Automode Melody Structure
struct MelodyNote {
    int midiNote;
    float startTime; // in seconds
    float duration;  // in seconds
    bool played;
    bool offTriggered;
};

int main()
{
    std::cout << "Starting GUI Virtual Piano..." << std::endl;

    // 1. Init Sound
    g_TinySoundFont = tsf_load_filename("TimGM6mb.sf2");
    if (!g_TinySoundFont) {
        std::cerr << "Could not load TimGM6mb.sf2! Please ensure it is in the same directory." << std::endl;
        return 1;
    }
    tsf_set_output(g_TinySoundFont, TSF_STEREO_INTERLEAVED, SAMPLE_RATE, 0);
    
    RtAudio dac;
    if (dac.getDeviceCount() < 1) return 1;

    RtAudio::StreamParameters parameters;
    parameters.deviceId = dac.getDefaultOutputDevice();
    parameters.nChannels = 2;
    parameters.firstChannel = 0;
    unsigned int bufferFrames = 256;

    if (dac.openStream(&parameters, NULL, RTAUDIO_FLOAT32, SAMPLE_RATE, &bufferFrames, &audioCallback)) return 1;
    if (dac.startStream()) return 1;

    // 2. Init Window (Raylib)
    const int screenWidth = 800;
    const int screenHeight = 450;
    SetConfigFlags(FLAG_MSAA_4X_HINT);
    InitWindow(screenWidth, screenHeight, "C++ Virtual Piano");
    SetTargetFPS(60);

    // Setup Piano Keys
    std::vector<PianoKey> keys;
    
    // White keys
    int whiteKeyNotes[] = {60, 62, 64, 65, 67, 69, 71, 72}; // C D E F G A B C
    int whiteKeyCodes[] = {KEY_A, KEY_S, KEY_D, KEY_F, KEY_G, KEY_H, KEY_J, KEY_K};
    std::string whiteLabels[] = {"A", "S", "D", "F", "G", "H", "J", "K"};
    
    float keyWidth = screenWidth / 8.0f;
    for (int i = 0; i < 8; ++i) {
        keys.push_back({whiteKeyNotes[i], whiteKeyCodes[i], false, {i * keyWidth, 150, keyWidth, 300}, false, whiteLabels[i]});
    }

    // Black keys
    int blackKeyNotes[] = {61, 63, -1, 66, 68, 70, -1};
    int blackKeyCodes[] = {KEY_W, KEY_E, 0, KEY_T, KEY_Y, KEY_U, 0};
    std::string blackLabels[] = {"W", "E", "", "T", "Y", "U", ""};
    
    float bWidth = keyWidth * 0.6f;
    for (int i = 0; i < 7; ++i) {
        if (blackKeyNotes[i] != -1) {
            keys.push_back({blackKeyNotes[i], blackKeyCodes[i], true, {i * keyWidth + keyWidth - (bWidth/2.0f), 150, bWidth, 180}, false, blackLabels[i]});
        }
    }

    // Automode Setup (Ode to Joy)
    bool isAutoMode = false;
    float autoTime = 0.0f;
    int melodyNotes[] = {64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62};
    std::vector<MelodyNote> melody;
    float t = 0.0f;
    for (int i = 0; i < 15; ++i) {
        float dur = 0.45f;
        if (i == 13) dur = 0.7f;
        if (i == 14) dur = 0.9f;
        melody.push_back({melodyNotes[i], t, dur, false, false});
        t += (i == 13) ? 0.75f : 0.5f;
    }

    // Main Loop
    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        // Mode Toggle
        if (IsKeyPressed(KEY_SPACE)) {
            isAutoMode = !isAutoMode;
            autoTime = 0.0f;
            
            // Turn off all notes cleanly
            std::lock_guard<std::mutex> lock(g_Mutex);
            tsf_note_off_all(g_TinySoundFont);
            for(auto& k : keys) k.isPressed = false;
            for(auto& m : melody) { m.played = false; m.offTriggered = false; }
        }

        std::lock_guard<std::mutex> lock(g_Mutex);

        if (!isAutoMode) {
            // Manual Mode
            for (auto& key : keys) {
                if (IsKeyPressed(key.keyboardKey)) {
                    key.isPressed = true;
                    tsf_note_on(g_TinySoundFont, 0, key.midiNote, 1.0f);
                }
                if (IsKeyReleased(key.keyboardKey)) {
                    key.isPressed = false;
                    tsf_note_off(g_TinySoundFont, 0, key.midiNote);
                }
            }
        } else {
            // Auto Mode
            autoTime += dt;
            
            // Reset visual states
            for(auto& k : keys) k.isPressed = false;

            for (auto& m : melody) {
                if (!m.played && autoTime >= m.startTime) {
                    m.played = true;
                    tsf_note_on(g_TinySoundFont, 0, m.midiNote, 1.0f);
                }
                
                // Keep visually pressed if within duration
                if (autoTime >= m.startTime && autoTime <= m.startTime + m.duration) {
                    for(auto& k : keys) {
                        if (k.midiNote == m.midiNote) k.isPressed = true;
                    }
                }
                
                // Turn note off at end of duration
                if (m.played && !m.offTriggered && autoTime >= m.startTime + m.duration) {
                    tsf_note_off(g_TinySoundFont, 0, m.midiNote);
                    m.offTriggered = true; 
                }
            }
            
            // Loop melody
            if (autoTime > t + 1.0f) {
                autoTime = 0.0f;
                for (auto& m : melody) {
                    m.played = false;
                    m.offTriggered = false;
                }
            }
        }

        // Draw
        BeginDrawing();
        ClearBackground({30, 30, 40, 255}); // Dark theme background

        DrawText("C++ Virtual Piano", 30, 20, 40, WHITE);
        
        if (isAutoMode) {
            DrawText("Mode: AUTO-PLAY", 30, 70, 25, SKYBLUE);
            DrawText("Now Playing: Ode to Joy", 30, 100, 20, LIGHTGRAY);
        } else {
            DrawText("Mode: MANUAL", 30, 70, 25, GREEN);
            DrawText("Play using A-K and W-U keys", 30, 100, 20, LIGHTGRAY);
        }
        
        DrawText("Press SPACE to toggle modes.", screenWidth - 300, 30, 18, GRAY);

        // Draw white keys
        for (const auto& key : keys) {
            if (!key.isBlack) {
                Color c = key.isPressed ? LIGHTGRAY : WHITE;
                if (key.isPressed && isAutoMode) c = SKYBLUE;
                
                DrawRectangleRec(key.rect, c);
                DrawRectangleLinesEx(key.rect, 2, BLACK);
                
                // Key label
                DrawText(key.label.c_str(), key.rect.x + key.rect.width/2 - 5, key.rect.y + key.rect.height - 40, 20, DARKGRAY);
            }
        }

        // Draw black keys
        for (const auto& key : keys) {
            if (key.isBlack) {
                Color c = key.isPressed ? DARKGRAY : BLACK;
                if (key.isPressed && isAutoMode) c = BLUE;
                
                DrawRectangleRec(key.rect, c);
                DrawRectangleLinesEx(key.rect, 2, BLACK);
                
                // Key label
                DrawText(key.label.c_str(), key.rect.x + key.rect.width/2 - 5, key.rect.y + key.rect.height - 30, 18, WHITE);
            }
        }

        EndDrawing();
    }

    // Cleanup
    if (dac.isStreamRunning()) dac.stopStream();
    if (dac.isStreamOpen()) dac.closeStream();
    tsf_close(g_TinySoundFont);
    CloseWindow();
    
    return 0;
}
