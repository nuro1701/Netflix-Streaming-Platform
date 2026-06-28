#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <set>
#include "AddMovieCommand.h"
#include "Utils.h"

using namespace std;

static string response = "400 Bad Request";

// Implementation of execute method
string AddMovieCommand::execute() {
    response = "400 Bad Request";
    string command = lastCommand();

    // Remove extra spaces
    Utils::removeSpaces(command);

    // If valid command 
    if (isValidAddCommand(command)) {
        // Add arguments
        string arguments = Utils::trimFirstWord(command);
        string commandType = Utils::getFirstWord(command);
        
        // Define the correct response
        if (commandType == "POST") {
            response = "201 Created";  // New user added successfully
        } else {
            response = "204 No Content";  // Existing user updated
        }

        string path = "../data/movies.txt";
        Utils::appendToFile(arguments, path);
    }

    return response;
}

string AddMovieCommand::lastCommand() {
    ifstream file("../data/commandsHistory.txt");
    if (!file.is_open()) {
        // cerr << "Error: Unable to open file 'data/commandsHistory.txt'" << endl;
        return "";
    }

    string line;
    string lastLine;
    while (getline(file, line)) {
        lastLine = line;
    }

    file.close();
    return lastLine;
}

bool AddMovieCommand::isValidAddCommand(string command) {
    if (Utils::containsTab(command)) return false;

    string arguments = Utils::trimFirstWord(command);
    string commandType = Utils::getFirstWord(command);

    // No arguments
    if (arguments.compare("") == 0)
        return false;

    // Valid if arguments are valid
    if (!isValidAddArguments(arguments))
        return false;

    // Load existing users and movies
    map<int, set<int>> userToMovies = Utils::GetMovies("../data/movies.txt");

    int userId = GetUser(command);

    // Check if user exists in POST command
    if (commandType == "POST" && userToMovies.find(userId) != userToMovies.end()) {
        response = "400 Bad Request";  // User already exists, cannot POST
        return false;
    }

    // Check if user does not exist in PATCH command
    if (commandType == "PATCH" && userToMovies.find(userId) == userToMovies.end()) {
        response = "404 Not Found";  // User does not exist, cannot PATCH
        return false;
    }

    return true;
}

bool AddMovieCommand::isValidAddArguments(string arguments) {
    vector<string> args = Utils::split(arguments, ' ');
    // Not enough arguments
    if (args.size() < 2) return false;

    // Validate arguments
    for (int i = 0; i < args.size(); i++) {
        std::string word = args[i];
        if (!Utils::is_number(word)) return false;
    }

    return true;
}

int AddMovieCommand::GetUser(const string& command) {
    std::vector<std::string> commandWords = Utils::split(command, ' ');
    if (commandWords.size() < 2) {
        throw invalid_argument("Command must contain a user ID.");
    }
    return std::stoi(commandWords[1]);
}