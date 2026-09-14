cmake_minimum_required(VERSION 3.20)
project(VirtualPiano VERSION 1.0.0 LANGUAGES CXX)

include(FetchContent)

# Fetch RtAudio
FetchContent_Declare(
  rtaudio
  GIT_REPOSITORY https://github.com/thestk/rtaudio.git
  GIT_TAG 6.0.1
)
# RtAudio settings
set(RTAUDIO_API_WASAPI ON CACHE BOOL "" FORCE)
set(RTAUDIO_API_DS ON CACHE BOOL "" FORCE)
set(RTAUDIO_BUILD_TESTING OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(rtaudio)

# Fetch RtMidi
# Temporarily removed to prevent "uninstall" target collision with RtAudio.
# We are currently using GetAsyncKeyState for keyboard input.

add_executable(VirtualPiano Source/Main.cpp)

target_compile_features(VirtualPiano PRIVATE cxx_std_17)

target_link_libraries(VirtualPiano PRIVATE 
    rtaudio
)
