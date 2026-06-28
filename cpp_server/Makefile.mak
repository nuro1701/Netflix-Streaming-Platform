# Define the compiler
CXX = g++

# Define the compiler flags
CXXFLAGS = -c

# Define the linker flags
LDFLAGS = -lws2_32

# Define the source files
SOURCES = src/ConsoleMenu.cpp \
          src/DisplayRecommendedMoviesCommand.cpp \
          src/AddMovieCommand.cpp \
          src/HelpCommand.cpp \
          src/DeleteCommand.cpp \
          src/Utils.cpp

# Define the object files
OBJECTS = $(SOURCES:.cpp=.o)

# Define the executable name
EXECUTABLE = output.exe

# Default target
all: $(EXECUTABLE)

# Rule to build the executable
$(EXECUTABLE): $(OBJECTS)
    $(CXX) $(OBJECTS) -o $@ $(LDFLAGS)

# Rule to build object files
%.o: %.cpp
    $(CXX) $(CXXFLAGS) $< -o $@

# Clean up the build files
clean:
    rm -f $(OBJECTS) $(EXECUTABLE)