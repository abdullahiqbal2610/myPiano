#define TSF_IMPLEMENTATION
#include "tsf.h"
#include "RtAudio.h"
#include <iostream>
#include <windows.h>
#include <map>
#include <mutex>

const unsigned int SAMPLE_RATE = 44100;
tsf* g_TinySoundFont = nullptr;
std::mutex g_Mutex;

// The RtAudio callback function
int audioCallback(void* outputBuffer, void* /*inputBuffer*/, unsigned int nBufferFrames,
                  double /*streamTime*/, RtAudioStreamStatus status, void* /*userData*/)
{
    if (status) std::cerr << "Stream underflow detected!" << std::endl;

    float* buffer = (float*)outputBuffer;

    std::lock_guard<std::mutex> lock(g_Mutex);
    
    // TinySoundFont renders interleaved stereo float out of the box
    if (g_TinySoundFont) {
        tsf_render_float(g_TinySoundFont, buffer, nBufferFrames, 0);
    } else {
        // Output silence if not loaded
        for (unsigned int i = 0; i < nBufferFrames * 2; ++i) {
            buffer[i] = 0.0f;
        }
    }

    return 0;
}

int main()
{
    std::cout << "Starting Sample-Based C++ Virtual Piano Engine..." << std::endl;

    // Load the SoundFont
    g_TinySoundFont = tsf_load_filename("TimGM6mb.sf2");
    if (!g_TinySoundFont) {
        std::cerr << "Could not load TimGM6mb.sf2! Make sure it is in the same directory." << std::endl;
        return 1;
    }

    // Set up TSF output
    tsf_set_output(g_TinySoundFont, TSF_STEREO_INTERLEAVED, SAMPLE_RATE, 0);
    
    RtAudio dac;
    if (dac.getDeviceCount() < 1) {
        std::cerr << "No audio devices found!" << std::endl;
        return 1;
    }

    RtAudio::StreamParameters parameters;
    parameters.deviceId = dac.getDefaultOutputDevice();
    parameters.nChannels = 2;
    parameters.firstChannel = 0;
    
    unsigned int bufferFrames = 256;

    if (dac.openStream(&parameters, NULL, RTAUDIO_FLOAT32,
                       SAMPLE_RATE, &bufferFrames, &audioCallback)) {
        std::cerr << dac.getErrorText() << std::endl;
        return 1;
    }
    if (dac.startStream()) {
        std::cerr << dac.getErrorText() << std::endl;
        return 1;
    }

    std::cout << "Audio stream started successfully (Zero Latency)." << std::endl;
    std::cout << "Play keys: A S D F G H J K (White keys) W E T Y U (Black keys)" << std::endl;
    std::cout << "Press ESC to quit." << std::endl;

    std::map<int, int> keyMap = {
        {'A', 60}, {'W', 61}, {'S', 62}, {'E', 63}, {'D', 64},
        {'F', 65}, {'T', 66}, {'G', 67}, {'Y', 68}, {'H', 69},
        {'U', 70}, {'J', 71}, {'K', 72}
    };

    std::map<int, bool> keyState;
    for (auto const& [key, note] : keyMap) {
        keyState[key] = false;
    }

    while (true) {
        if (GetAsyncKeyState(VK_ESCAPE) & 0x8000) {
            break;
        }

        {
            std::lock_guard<std::mutex> lock(g_Mutex);
            for (auto const& [key, note] : keyMap) {
                bool isPressed = (GetAsyncKeyState(key) & 0x8000) != 0;
                
                if (isPressed && !keyState[key]) {
                    keyState[key] = true;
                    // Trigger note on preset 0 (Piano), at full velocity (1.0f)
                    tsf_note_on(g_TinySoundFont, 0, note, 1.0f);
                } else if (!isPressed && keyState[key]) {
                    keyState[key] = false;
                    // Turn note off
                    tsf_note_off(g_TinySoundFont, 0, note);
                }
            }
        }
        
        Sleep(5); // Sleep for 5ms to reduce CPU usage
    }

    if (dac.isStreamRunning()) {
        dac.stopStream();
    }
    if (dac.isStreamOpen()) {
        dac.closeStream();
    }

    tsf_close(g_TinySoundFont);
    std::cout << "Engine shut down cleanly." << std::endl;
    return 0;
}
