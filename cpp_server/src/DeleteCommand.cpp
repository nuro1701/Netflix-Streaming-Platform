#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include "DeleteCommand.h"
#include "Utils.h"

using namespace std;

string DeleteCommand::execute() {
    string command = lastCommand();

    // Remove extra spaces
    Utils::removeSpaces(command);

    // Invalid command
    if (!isValidDeleteCommand(command)) {
        return "400 Bad Request";
    }

    map<int, set<int>> userToMovies = Utils::GetMovies("../data/movies.txt");

    std::string response = processDeleteCommand(command, userToMovies);

    // Update file  
    writeMoviesToFile(userToMovies, "../data/movies.txt");

    return response;
}


string DeleteCommand::lastCommand() {
    // Get last command from commadsHistory.txt
    ifstream file("../data/commandsHistory.txt");
    if (!file.is_open()) {
        // Print error
        cerr << "Error: Unable to open file 'data/commandsHistory.txt'" << endl;
        return "";
    }

    string line;
    string lastLine;

    // Iterate through the file to find the last line
    while (getline(file, line)) {
        lastLine = line;
    }

    file.close();
    return lastLine;
}

bool DeleteCommand::isValidDeleteCommand(string command) {
    if(Utils::containsTab(command)) return false;
    // The arguments are the command line without the task word (first word)
    string arguments = Utils::trimFirstWord(command);

    // No arguments
    if (arguments.compare("") == 0)
        return false; 
    
    // Valid iff arguments are valid
    return isValidDeleteArguments(arguments);
}

bool DeleteCommand::isValidDeleteArguments(string arguments) {
    vector<string> args = Utils::split(arguments, ' ');
    // Not enough arguments
    if(args.size() < 2) return false;

    // Validate arguments
    for (int i = 0; i < args.size(); i++) {
        std::string word = args[i];
        if(!Utils::is_number(word)) return false;
    }

    return true;
}

std::string DeleteCommand::processDeleteCommand(
    const std::string& command,
    std::map<int, std::set<int>>& userToMovies
) {
    // split words
    std::vector<std::string> tokens = Utils::split(command, ' ');

    // Get userID
    int userId;
    try {
        userId = std::stoi(tokens[1]);
    } catch (...) {
        return "400 Bad Request";
    }

    // Check if user exists
    if (userToMovies.find(userId) == userToMovies.end()) {
        return "404 Not Found";
    }

    // Check if all movies exist in the user's list
    for (size_t i = 2; i < tokens.size(); ++i) {
        int movieId;
        try {
            movieId = std::stoi(tokens[i]);
        } catch (...) {
            return "400 Bad Request";  // If movieId is invalid
        }

        // If the movie doesn't exist in the user's list, return error
        if (userToMovies[userId].find(movieId) == userToMovies[userId].end()) {
            return "400 Bad Request";
        }
    }

    // Delete movies
    for (size_t i = 2; i < tokens.size(); ++i) {
        int movieId;
        try {
            movieId = std::stoi(tokens[i]);
        } catch (...) {
            return "400 Bad Request";
        }

        // Delete movie from user's movies
        userToMovies[userId].erase(movieId);
    }

    return "200 OK";
}

void DeleteCommand::writeMoviesToFile(const std::map<int, std::set<int>>& userToMovies, const std::string& path) {
    std::ofstream file(path, std::ios::trunc);

    if (!file.is_open()) {
        std::cerr << "Error: Unable to open file at " << path << std::endl;
        return;
    }

    for (const auto& [userId, movies] : userToMovies) {
        if(!movies.empty()) {    
            file << userId;
            for (int movie : movies) {
                file << " " << movie;
            }
            file << std::endl;
        }
    }

    file.close();
}

void DeleteCommand::deleteMoviesForUser(
    int userId,
    const std::vector<int>& movieIds,
    std::map<int, std::set<int>>& userToMovies
) {
    for (int movieId : movieIds) {
        userToMovies[userId].erase(movieId);
    }
}
