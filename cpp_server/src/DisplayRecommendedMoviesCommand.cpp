#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include "DisplayRecommendedMoviesCommand.h"
#include "Utils.h"

using namespace std;
static string response = "400 Bad Request";

string DisplayRecommendedMoviesCommand::execute() {
    response = "400 Bad Request";
    size_t N = 10;
    string command = lastCommand();

    // Remove extra spaces
    Utils::removeSpaces(command);

    if (isValidRecommendedCommand(command)) {
        map<int, set<int>> movieToUsers = Utils::GetViewers("../data/movies.txt");
        map<int, set<int>> userToMovies = Utils::GetMovies("../data/movies.txt");

        int user = GetUser(command);
        int movie = GetMovieArgument(command);
        // Both user and movie exists
        if ( userToMovies.find(user) != userToMovies.end() && movieToUsers.find(movie) != movieToUsers.end() ) {
            map<int, size_t> movieRelevanceGrades = Utils::GetRelevanceGrades(user, movie, movieToUsers, userToMovies);

           // Initialize the boolean variable
            bool allGradesAreZero = true;

            // Iterate over the map
            for (const auto& pair : movieRelevanceGrades) {
                // Check if the value is greater than 0
                if (pair.second > 0) {
                    allGradesAreZero = false;
                    break; // No need to continue the loop if we found a non-zero value
                }
            }

            if (allGradesAreZero) {
                response = "400 bad request";
            }
            else {
                // Print movie relevance grades in sorted order
                // Sort map
                std::vector<std::pair<int, size_t>> sortedVec = Utils::sortMapByValue(movieRelevanceGrades);
                
                // N does not get over the number of elements
                N = std::min(N, sortedVec.size());  

                string output = Utils::convertVectorToString(sortedVec, N);

                // Valid request
                response = "200 OK\n\n" + output;
            } 
        }
        else
            // Unlogic request
            response = "404 Not Found";
    }
    return response;
}

string DisplayRecommendedMoviesCommand::lastCommand() {
    ifstream file("../data/commandsHistory.txt");
    if (!file.is_open()) {
        cerr << "Error: Unable to open file '../data/commandsHistory.txt'" << endl;
        return "";
    }

    string line, lastLine;
    while (getline(file, line)) {
        lastLine = line;
    }

    file.close();
    return lastLine;
}

bool DisplayRecommendedMoviesCommand::isValidRecommendedCommand(const string& command) {
    if(Utils::containsTab(command)) return false;
    string arguments = Utils::trimFirstWord(command);

    if (arguments.empty()) {
        return false; // No arguments
    }

    return isValidRecommendedArguments(arguments);
}

bool DisplayRecommendedMoviesCommand::isValidRecommendedArguments(const string& arguments) {
    vector<string> args = Utils::split(arguments, ' ');
     // Ensure at there are exactly user ID and movie ID
    if (args.size() != 2) return false;
    for (int i = 0; i < args.size(); i++) {
        std::string word = args[i];
        if(!Utils::is_number(word)) return false;
    }

    return true;
}

int DisplayRecommendedMoviesCommand::GetUser(const string& command) {
    std::vector<std::string> commandWords = Utils::split(command, ' ');
    if (commandWords.size() < 2) {
        throw invalid_argument("Command must contain a user ID.");
    }
    return (std::stoi(commandWords[1]));
}

int DisplayRecommendedMoviesCommand::GetMovieArgument(const string& command) {
    std::vector<std::string> commandWords = Utils::split(command, ' ');
    if (commandWords.size() < 3) {
        throw invalid_argument("Command must contain a movie ID.");
    }
    return stoi(commandWords[2]);
}