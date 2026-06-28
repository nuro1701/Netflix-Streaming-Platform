#ifndef UTILS_H
#define UTILS_H

#include <vector>
#include <string>
#include <vector>
#include <set>
#include <map>

// Utility functions for string handling and other helpers
namespace Utils {

    using namespace std;

    // This method designed to process a given string (str) and remove
    // unwanted spaces and ensuring correct placement of punctuation.
    void removeSpaces(std::string &str);

    bool is_number(const std::string& s);

    bool containsTab(const std::string& str);

    // split method - to divide a string (str) into smaller substrings
    // (or "tokens") based on a specified delimiter character (delimiter).
    std::vector<std::string> split(const std::string& str, char delimiter);

    // Get two sets of string and returns the size of the intersection between them.
    size_t intersectionSize(const std::set<int>& set1, const std::set<int>& set2);

    // first word - method to extract and return the portion of a string (str)
    // after its first word, effectively removing the first word (and the 
    // following space, if present) from a given input string str. If the string
    // contains no spaces, it returns an empty string.
    std::string trimFirstWord(const std::string& str);

    // Get first word in word
    std::string getFirstWord(const std::string& command);

    // Convert vector to string
    std::string convertVectorToString(const std::vector<std::pair<int, size_t>>& sortedVec, size_t N);

    // fileExists method - checks whether a file exists at a specified path.
    bool fileExists(const std::string& path);

    // Append line to end of file in new line
    bool appendToFile(const std::string& line, const std::string& path);

    // Get viewers of each movie
    std::map<int, std::set<int>> GetViewers(const std::string& path);

    // Get movies of each user
    std::map<int, std::set<int>> GetMovies(const std::string& path);

    // Get number of common movies between two users
    /* map is map of:
    key - user ID
    value - set of movies*/
    size_t GetCommonMoviesSize(const std::map<int, std::set<int>>& userToMovies, int user1, int user2);

    // This method gets user ID and user to movies map, and returns the similiarity grade of each user to the given user
    // If user does not exist, return an empty map
    std::map<int, size_t> GetSimiliarityGrade(int user, const std::map<int, std::set<int>>& userToMovies);

    /*This method gets movie ID and map of movie to users, and returns 
    set of users that watched the movie*/
    std::set<int> watchedInMovie(int movie, const std::map<int, std::set<int>>& movieToUsers);

    /*This method gets 2 parameters:
    1. map of movie to set of its viewers(users).
    2. map of user to set of its movies
    and returns relevance grade of each movie*/
    std::map<int, size_t> GetRelevanceGrades(
    int user, int movie,
    const std::map<int, std::set<int>>& movieToUsers,
    const std::map<int, std::set<int>>& userToMovies);
    
    bool cmpPairByFirstValueForAcsendingSort(pair<int, size_t>& p1, pair<int, size_t>& p2);
    bool cmpPairBySecondValueForDescendingSort(pair<int, size_t>& p1, pair<int, size_t>& p2);

    std::vector<std::pair<int, size_t>> sortMapByValue(const std::map<int, size_t>& inputMap);    

    // Prints the first N keys of sorted-by-value map
    void printFirstNKeys(map<string, int>& M, int N);

    void clearFile(const std::string& path);
}

#endif // UTILS_H
