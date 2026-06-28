# Use an official Ubuntu image as the base image
FROM ubuntu:20.04 AS build

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    dos2unix \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy project files into the container
COPY . /myserver

# Set the working directory inside the container
WORKDIR /myserver

# Ensure all text files have Unix line endings
RUN find . -type f -exec dos2unix {} \;

# Build the project
RUN cmake . && make

# Use a minimal runtime image
FROM ubuntu:20.04 AS runtime

# Copy the built executable from the build stage
COPY --from=build /myserver/my_executable /usr/local/bin/my_executable

# Expose port 5555
EXPOSE 5555

# Define the command to run the application
CMD ["my_executable"]