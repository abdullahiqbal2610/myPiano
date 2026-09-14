#include "RtAudio.h"
#include <iostream>
#include <cmath>
#include <windows.h>
#include <atomic>
#include <map>
#include <mutex>
#include <vector>
#include <algorithm>

const unsigned int SAMPLE_RATE = 44100;
const double PI = 3.14159265358979323846;

// Simple ADSR Envelope
class ADSR {
public:
    enum State { IDLE, ATTACK, DECAY, SUSTAIN, RELEASE };

    ADSR() : state(IDLE), level(0.0), attackRate(0.0), decayRate(0.0), sustainLevel(0.0), releaseRate(0.0) {}

    void setParameters(double attackTime, double decayTime, double sustainLvl, double releaseTime) {
        attackRate = 1.0 / (attackTime * SAMPLE_RATE);
        decayRate = 1.0 / (decayTime * SAMPLE_RATE);
        sustainLevel = sustainLvl;
        releaseRate = 1.0 / (releaseTime * SAMPLE_RATE);
    }

    void noteOn() {
        state = ATTACK;
    }

    void noteOff() {
        if (state != IDLE) state = RELEASE;
    }

    double process() {
        switch (state) {
            case IDLE:
                break;
            case ATTACK:
                level += attackRate;
                if (level >= 1.0) {
                    level = 1.0;
                    state = DECAY;
                }
                break;
            case DECAY:
                level -= decayRate;
                if (level <= sustainLevel) {
                    level = sustainLevel;
                    state = SUSTAIN;
                }
                break;
            case SUSTAIN:
                break;
            case RELEASE:
                level -= releaseRate;
                if (level <= 0.0) {
                    level = 0.0;
                    state = IDLE;
                }
                break;
        }
        return level;
    }

    bool isActive() const { return state != IDLE; }

private:
    State state;
    double level;
    double attackRate, decayRate, sustainLevel, releaseRate;
};

// Advanced Synthesizer Voice (Electric Piano style)
class Voice {
public:
    Voice() : phase1(0.0), phase2(0.0), phase3(0.0), increment(0.0) {
        // Fast attack, short decay, medium sustain, medium release for piano feel
        envelope.setParameters(0.01, 0.3, 0.4, 0.5);
    }

    void setFrequency(double freq) {
        increment = (2.0 * PI * freq) / SAMPLE_RATE;
    }

    void noteOn() { envelope.noteOn(); }
    void noteOff() { envelope.noteOff(); }
    bool isActive() const { return envelope.isActive(); }

    double process() {
        if (!envelope.isActive()) return 0.0;

        // Harmonics for Electric Piano feel
        // Fundamental
        double wave1 = std::sin(phase1);
        // 1st Overtone (Octave)
        double wave2 = std::sin(phase2) * 0.5;
        // 2nd Overtone (Octave + Fifth)
        double wave3 = std::sin(phase3) * 0.25;

        phase1 += increment;
        phase2 += increment * 2.0;
        phase3 += increment * 3.0;

        if (phase1 >= 2.0 * PI) phase1 -= 2.0 * PI;
        if (phase2 >= 2.0 * PI) phase2 -= 2.0 * PI;
        if (phase3 >= 2.0 * PI) phase3 -= 2.0 * PI;

        double signal = (wave1 + wave2 + wave3) * 0.3; // Overall volume scaling
        
        return signal * envelope.process();
    }

private:
    double phase1, phase2, phase3;
    double increment;
    ADSR envelope;
};

std::mutex voiceMutex;
std::vector<Voice> voices(88);

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
        
        // Soft clipping to prevent harsh distortion when playing chords
        sample = std::tanh(sample * 1.5);

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
    std::cout << "Starting Synthesized C++ Virtual Piano Engine..." << std::endl;

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

    // Key mapping
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
        
        Sleep(5); // Sleep for 5ms to reduce CPU usage
    }

    if (dac.isStreamRunning()) {
        dac.stopStream();
    }
    if (dac.isStreamOpen()) {
        dac.closeStream();
    }

    std::cout << "Engine shut down cleanly." << std::endl;
    return 0;
}
