cmake_minimum_required(VERSION 3.20)
project(VirtualPiano VERSION 1.0.0)

# Add JUCE Submodule
add_subdirectory(JUCE)

# Create a JUCE standalone application
juce_add_gui_app(VirtualPiano
    PRODUCT_NAME "Virtual Piano"
    VERSION 1.0.0)

# Add source files
target_sources(VirtualPiano PRIVATE
    Source/Main.cpp
)

# Link against JUCE modules
target_link_libraries(VirtualPiano PRIVATE
    juce::juce_core
    juce::juce_data_structures
    juce::juce_events
    juce::juce_graphics
    juce::juce_gui_basics
    juce::juce_gui_extra
    juce::juce_audio_basics
    juce::juce_audio_devices
    juce::juce_audio_formats
    juce::juce_audio_processors
    juce::juce_audio_utils
)

# Standard C++ settings
juce_generate_juce_header(VirtualPiano)
target_compile_features(VirtualPiano PRIVATE cxx_std_20)
