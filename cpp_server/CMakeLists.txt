cmake_minimum_required(VERSION 3.10)

project(my_project)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(my_library
    src/Utils.cpp
    src/AddMovieCommand.cpp
    src/HelpCommand.cpp
    src/DisplayRecommendedMoviesCommand.cpp
    src/App.cpp
    src/DeleteCommand.cpp
)

target_include_directories(my_library PUBLIC ${CMAKE_SOURCE_DIR}/src)

add_executable(my_executable
    src/ConsoleMenu.cpp
)

if(WIN32)
    target_link_libraries(my_executable my_library ws2_32)
else()
    target_link_libraries(my_executable my_library pthread)
endif()
