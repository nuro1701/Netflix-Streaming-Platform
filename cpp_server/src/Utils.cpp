#include "Utils.h"
#include <algorithm>
#include <iostream>
#include <sstream>
#include <fstream>
#include <cctype>
#include <string>
#include <stdexcept>
#include <iterator>
#include <filesystem>
#include <vector>
#include <set>
#include <map>
#include <functional>

namespace Utils {

    // Removes extra spaces from a string, ensuring only single spaces remain 
    //between words and no leading or trailing spaces are present.
    void removeSpaces(std::string& str) {
        int n = str.length();
        int i = 0, j = -1;
        bool spaceFound = false;

        while (++j < n && str[j] == ' ');

        while (j < n) {
            if (str[j] != ' ') {
                if ((str[j] == '.' || str[j] == ',' || str[j] == '?') && i - 1 >= 0 && str[i - 1] == ' ')
                    str[i - 1] = str[j++];
                else
                    str[i++] = str[j++];
                spaceFound = false;
            } else if (str[j++] == ' ') {
                if (!spaceFound) {
                    str[i++] = ' ';
                    spaceFound = true;
                }
            }
        }

        if (i > 0 && str[i - 1] == ' ') 
            --i;

        str.resize(i);
    }

    bool is_number(const std::string& s) {
        return !s.empty() && std::find_if(s.begin(), 
            s.end(), [](unsigned char c) { return !std::isdigit(c); }) == s.end();
    }

    bool containsTab(const std::string& str) {
        return str.find('\t') != std::string::npos;
}   

    // Splits a string into tokens using a specified delimiter.
    std::vector<std::string> split(const std::string& str, char delimiter) {
        std::vector<std::string> tokens;
        std::string token;
        std::stringstream ss(str);
        while (std::getline(ss, token, delimiter)) {
            tokens.push_back(token);
        }
        return tokens;
    }

// computes the size of the intersection of two std::set<int> containers by 
// storing the common elements in a temporary set and returning its size.
size_t intersectionSize(const std::set<int>& set1, const std::set<int>& set2) {
    // Create a temporary container to store the intersection
    std::set<int> intersection;

    // Compute the intersection
    std::set_intersection(
        set1.begin(), set1.end(),
        set2.begin(), set2.end(),
        std::inserter(intersection, intersection.begin())
    );

    // Return the size of the intersection
    return intersection.size();
}

// Returns the string after its first word.
std::string trimFirstWord(const std::string& str) {
    size_t res = str.find(" ");
    if (res != std::string::npos)
        return str.substr(res + 1);

    return "";
}

std::string getFirstWord(const std::string& command) {
    // Find the first space in the string
    size_t spacePosition = command.find(' ');

    // If no space is found, return the entire string
    if (spacePosition == std::string::npos) {
        return command;
    }

    // Otherwise, return the substring up to the first space
    return command.substr(0, spacePosition);
}

std::string convertVectorToString(const std::vector<std::pair<int, size_t>>& sortedVec, size_t N) {
    // N does not get over the number of elements
    N = std::min(N, sortedVec.size());

    // Use std::ostringstream to build the string
    std::ostringstream oss;

    for (size_t i = 0; i < N - 1; ++i) {
        oss << sortedVec[i].first << " ";
    }

    // Add the last element without an extra space
    if (N > 0) {
        oss << sortedVec[N - 1].first;
    }

    // Return the built string
    return oss.str();
}

// Checks if a file exists at the specified path and if it is a regular file, returning true if so and false otherwise.
    bool fileExists(const std::string& path) {
        try {
            return std::filesystem::exists(path) && std::filesystem::is_regular_file(path);
        } catch (const std::filesystem::filesystem_error& e) {
            std::cerr << "Error checking file existence: " << e.what() << std::endl;
            return false;
        }
    }

    // Appends a given line of text to a file at the specified path, creating the file if it doesn't exist,
    // and returns whether the operation was successful.
    bool appendToFile(const std::string& line, const std::string& path) {
        try {
            std::ofstream file(path, std::ios_base::app);
            if (!file.is_open()) {
                std::cerr << "Error: Unable to open file '" << path << "'" << std::endl;
                return false;
            }
            file << line << std::endl;
            file.close();
            return true;
        } catch (const std::exception& e) {
            std::cerr << "Exception occurred: " << e.what() << std::endl;
            return false;
        }
    }

    // Maps movies to their viewers (users) -  - reads a file containing user IDs and their associated movie IDs, mapping
    // each movie to the set of users who have watched it. Returns a map<int, set<int>> representing the data.
    std::map<int, std::set<int>> GetViewers(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) {
            std::cerr << "Error: Unable to open file at " << path << std::endl;
            return {};
        }

        std::string line;
        std::map<int, std::set<int>> movieToUsers;

        while (std::getline(file, line)) {
            // Split the line into tokens based on space delimiter
            std::vector<std::string> tokens = Utils::split(line, ' ');

            // Skip empty lines
            if (tokens.empty()) continue;

            try {
                // Convert the first token to userID
                int userID = std::stoi(tokens[0]);

                // Convert the rest of the tokens to movie IDs
                for (size_t i = 1; i < tokens.size(); ++i) {
                    int movieID = std::stoi(tokens[i]);
                    movieToUsers[movieID].insert(userID); // Insert userID into the set for this movieID
                }
            } catch (const std::invalid_argument& e) {
                std::cerr << "Error: Invalid data in file. Unable to convert to integer: " << e.what() << std::endl;
            } catch (const std::out_of_range& e) {
                std::cerr << "Error: Integer value out of range: " << e.what() << std::endl;
            }
        }

        file.close();
        return movieToUsers;
    }


    // Maps users to the movies they watched - reads a file containing user IDs and their associated movie IDs, mapping
    // each user to a set of movies they have watched. Returns a map<int, set<int>> representing the data.
    std::map<int, std::set<int>> GetMovies(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) {
            std::cerr << "Error: Unable to open file at " << path << std::endl;
            return {};
        }

        std::string line;
        std::map<int, std::set<int>> userToMovies;

        while (std::getline(file, line)) {
            // Split the line into tokens based on space delimiter
            std::vector<std::string> tokens = Utils::split(line, ' ');

            // Skip empty lines
            if (tokens.empty()) continue;

            try {
                // Convert the first token to userID
                int userID = std::stoi(tokens[0]);

                // Convert the rest of the tokens to movie IDs
                for (size_t i = 1; i < tokens.size(); ++i) {
                    int movieID = std::stoi(tokens[i]);
                    userToMovies[userID].insert(movieID); // Insert movieID into the set for this userID
                }
            } catch (const std::invalid_argument& e) {
                std::cerr << "Error: Invalid data in file. Unable to convert to integer: " << e.what() << std::endl;
            } catch (const std::out_of_range& e) {
                std::cerr << "Error: Integer value out of range: " << e.what() << std::endl;
            }
        }

        file.close();
        return userToMovies;
    }

    // computes the number of common movie IDs between two users by finding the intersection of their
    // movie sets from a map. If either user doesn't exist in the map, it returns 0.
    size_t GetCommonMoviesSize(const std::map<int, std::set<int>>& userToMovies, int user1, int user2) {
        // Ensure both users exist in the map
        auto it1 = userToMovies.find(user1);
        auto it2 = userToMovies.find(user2);
        
        if (it1 == userToMovies.end() || it2 == userToMovies.end()) {
            // If any user is not found, return 0 as no common movies
            return 0;
        }

        // Compute the intersection of the movie sets
        std::set<int> commonMovies;
        std::set_intersection(it1->second.begin(), it1->second.end(),
                              it2->second.begin(), it2->second.end(),
                              std::inserter(commonMovies, commonMovies.begin()));
        
        return commonMovies.size();
    }

    // Calculates a similarity grade for a given user by comparing their watched movies with those of other
    // users in a map. The similarity grade is the size of the intersection of their movie sets.
     std::map<int, size_t> GetSimiliarityGrade(int user, const std::map<int, std::set<int>>& userToMovies) {
        std::map<int, size_t> similarity;

        // Find the movies watched by the given user
        auto it = userToMovies.find(user);
        if (it == userToMovies.end()) {
            // Return empty map if the user does not exist
            return {};
        }

        const std::set<int>& userMoviesSet = it->second;

        // Compare the given user with all other users
        for (const auto& [otherUser, otherMovies] : userToMovies) {
            if (user == otherUser) continue; // Skip the given user

            // Calculate similarity grade as the size of the intersection
            similarity[otherUser] = intersectionSize(userMoviesSet, otherMovies);
        }

        return similarity;
    }

    // Retrieves the set of users who have watched a specific movie from a map that links movies
    // to sets of users. If the movie is not found, it returns an empty set.
    std::set<int> watchedInMovie(int movie, const std::map<int, std::set<int>>& movieToUsers) {
        auto it = movieToUsers.find(movie);
        if (it != movieToUsers.end()) {
            return it->second;
        }
        return std::set<int>();  // Return empty set if movie not found
    }

   // Calculates relevance grades for movies based on the similarity between the given user and other users who watched
// a specified movie. It assigns a grade to each movie by summing the similarity grades of users who watched 
// both the given movie and other movies. It returns a map of movies and their relevance grades.
std::map<int, size_t> GetRelevanceGrades(
    int user, int movie,
    const std::map<int, std::set<int>>& movieToUsers,
    const std::map<int, std::set<int>>& userToMovies
) {
    // Get users who watched the given movie
    std::set<int> usersWatched = watchedInMovie(movie, movieToUsers);

    // Get similarity grades for the given user
    std::map<int, size_t> similiarityGradeUserMap = GetSimiliarityGrade(user, userToMovies);

    // Map to store the relevance grade for each movie
    std::map<int, size_t> movieRelevanceGrade;

    // Calculate relevance grades
    for (const auto& [movieID, userSet] : movieToUsers) {
        // Not already watched
        if(movieID != movie && userToMovies.at(user).find(movieID) == userToMovies.at(user).end()) {
            size_t grade = 0;

            for (int userID : userSet) {
                // If the user watched the given movie
                if (usersWatched.find(userID) != usersWatched.end() && userID != user) {
                    // Add the similarity grade of the user
                    grade += similiarityGradeUserMap[userID];
                }
            }
            
            if(grade > 0) {
                movieRelevanceGrade[movieID] = grade;
            }
        }
        
    }

    return movieRelevanceGrade;
}

   // bool cmpPairByFirstValueForAcsendingSort(pair<int, size_t>& p1, pair<int, size_t>& p2) {
    //     return (p1.first < p2.first) ? true : false;
    // }

    // bool cmpPairBySecondValueForDescendingSort(pair<int, size_t>& p1, pair<int, size_t>& p2) {
    //     return (p1.second > p2.second) ? true : false;
    // }

    std::vector<std::pair<int, size_t>> sortMapByValue(const std::map<int, size_t>& inputMap) {
        // Copy map elements into a vector of pairs
        std::vector<std::pair<int, size_t>> sortedVector(inputMap.begin(), inputMap.end());

        // Sort the vector of pairs by the first value of each pair (ascending order)
        std::stable_sort(sortedVector.begin(), sortedVector.end(), [](const std::pair<int, size_t>& a, const std::pair<int, size_t>& b) {
            return a.first < b.first;  // Sort by the key (first element of the pair)
        });

        // Sort the vector of pairs by the second value of each pair (descending order)
        std::stable_sort(sortedVector.begin(), sortedVector.end(), [](const std::pair<int, size_t>& a, const std::pair<int, size_t>& b) {
            return a.second > b.second;  // Sort by the value (second element of the pair)
        });

        return sortedVector;
    }

    // Clears the contents of the specified file by opening it in truncation mode.
    void clearFile(const std::string& path) {
        try {
            // Open the file in truncation mode to clear its contents
            std::ofstream file(path, std::ios::trunc);

            // Check if the file was successfully opened
            if (!file.is_open()) {
                throw std::ios_base::failure("Unable to open file at " + path);
            }

        } catch (const std::exception& e) {
            // Log any errors encountered
            std::cerr << "Error: " << e.what() << std::endl;
        }
    }  
}