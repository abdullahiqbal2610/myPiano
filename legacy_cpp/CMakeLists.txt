cmake_minimum_required(VERSION 3.28)
project(VirtualPiano VERSION 1.0.0 LANGUAGES CXX C)

# Allow duplicate custom targets like "uninstall" between dependencies
if(POLICY CMP0002)
  cmake_policy(SET CMP0002 OLD)
endif()

include(FetchContent)

# Fetch Raylib for GUI
FetchContent_Declare(
  raylib
  GIT_REPOSITORY https://github.com/raysan5/raylib.git
  GIT_TAG master
)
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(raylib)

# Fetch RtAudio for sound
FetchContent_Declare(
  rtaudio
  GIT_REPOSITORY https://github.com/thestk/rtaudio.git
  GIT_TAG 6.0.1
)
set(RTAUDIO_BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
set(RTAUDIO_BUILD_STATIC_LIBS ON CACHE BOOL "" FORCE)
set(RTAUDIO_API_WASAPI ON CACHE BOOL "" FORCE)
set(RTAUDIO_API_DS ON CACHE BOOL "" FORCE)
set(RTAUDIO_BUILD_TESTING OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(rtaudio)

add_executable(VirtualPiano Source/Main.cpp)

target_compile_features(VirtualPiano PRIVATE cxx_std_17)

target_link_libraries(VirtualPiano PRIVATE 
    raylib
    rtaudio
)
