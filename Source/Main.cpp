#include "RtAudio.h"
#include <iostream>
#include <cmath>
#include <windows.h>
#include <atomic>
#include <map>
#include <mutex>
#include <vector>

const unsigned int SAMPLE_RATE = 44100;
const double PI = 3.14159265358979323846;

// Simple Sine Oscillator
class Oscillator {
public:
    Oscillator() : phase(0.0), increment(0.0), active(false) {}

    void setFrequency(double freq) {
        increment = (2.0 * PI * freq) / SAMPLE_RATE;
    }

    void noteOn() { active = true; }
    void noteOff() { active = false; }
    bool isActive() const { return active; }

    double process() {
        if (!active) return 0.0;
        double val = std::sin(phase);
        phase += increment;
        if (phase >= 2.0 * PI) phase -= 2.0 * PI;
        return val * 0.2; // 20% volume per note
    }

private:
    double phase;
    double increment;
    std::atomic<bool> active;
};

std::mutex voiceMutex;
std::vector<Oscillator> voices(88);

// The RtAudio callback function
int audioCallback(void* outputBuffer, void* /*inputBuffer*/, unsigned int nBufferFrames,
                  double /*streamTime*/, RtAudioStreamStatus status, void* /*userData*/)
{
    if (status) std::cerr << "Stream underflow detected!" << std::endl;

    float* buffer = (float*)outputBuffer;

    std::lock_guard<std::mutex> lock(voiceMutex);

    for (unsigned int i = 0; i < nBufferFrames; i++) {
        double sample = 0.0;
        for (auto& voice : voices) {
            if (voice.isActive()) {
                sample += voice.process();
            }
        }
        
        // Write to both left and right channels (assuming 2 channels)
        *buffer++ = (float)sample;
        *buffer++ = (float)sample;
    }
    return 0;
}

// Convert MIDI note to frequency
double noteToFreq(int midiNote) {
    return 440.0 * std::pow(2.0, (midiNote - 69) / 12.0);
}

int main()
{
    std::cout << "Starting Lightweight C++ Virtual Piano Engine..." << std::endl;

    RtAudio dac;
    if (dac.getDeviceCount() < 1) {
        std::cerr << "No audio devices found!" << std::endl;
        return 1;
    }

    // Initialize all 88 keys with their frequencies
    for (int i = 0; i < 88; ++i) {
        voices[i].setFrequency(noteToFreq(21 + i)); // A0 is MIDI 21
    }

    RtAudio::StreamParameters parameters;
    parameters.deviceId = dac.getDefaultOutputDevice();
    parameters.nChannels = 2;
    parameters.firstChannel = 0;
    
    unsigned int bufferFrames = 256;

    try {
        dac.openStream(&parameters, NULL, RTAUDIO_FLOAT32,
                       SAMPLE_RATE, &bufferFrames, &audioCallback);
        dac.startStream();
    }
    catch (RtAudioError& e) {
        e.printMessage();
        return 1;
    }

    std::cout << "Audio stream started successfully (Zero Latency)." << std::endl;
    std::cout << "Play keys: A S D F G H J K (White keys) W E T Y U (Black keys)" << std::endl;
    std::cout << "Press ESC to quit." << std::endl;

    // Key mapping (same as original python script)
    // Virtual key codes for A-Z are just 'A', 'B' etc.
    std::map<int, int> keyMap = {
        {'A', 60}, {'W', 61}, {'S', 62}, {'E', 63}, {'D', 64},
        {'F', 65}, {'T', 66}, {'G', 67}, {'Y', 68}, {'H', 69},
        {'U', 70}, {'J', 71}, {'K', 72}
    };

    // Track state to avoid repeatedly triggering Note On
    std::map<int, bool> keyState;
    for (auto const& [key, note] : keyMap) {
        keyState[key] = false;
    }

    while (true) {
        if (GetAsyncKeyState(VK_ESCAPE) & 0x8000) {
            break;
        }

        std::lock_guard<std::mutex> lock(voiceMutex);

        for (auto const& [key, note] : keyMap) {
            bool isPressed = (GetAsyncKeyState(key) & 0x8000) != 0;
            
            if (isPressed && !keyState[key]) {
                // Key just pressed
                keyState[key] = true;
                int voiceIndex = note - 21;
                if (voiceIndex >= 0 && voiceIndex < 88) {
                    voices[voiceIndex].noteOn();
                }
            } else if (!isPressed && keyState[key]) {
                // Key just released
                keyState[key] = false;
                int voiceIndex = note - 21;
                if (voiceIndex >= 0 && voiceIndex < 88) {
                    voices[voiceIndex].noteOff();
                }
            }
        }
        
        Sleep(10); // Sleep for 10ms to reduce CPU usage of this infinite loop
    }

    try {
        dac.stopStream();
        dac.closeStream();
    }
    catch (RtAudioError& e) {
        e.printMessage();
    }

    std::cout << "Engine shut down cleanly." << std::endl;
    return 0;
}
