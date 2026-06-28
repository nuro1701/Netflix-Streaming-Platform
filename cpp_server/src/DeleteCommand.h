#ifndef DELETE_COMMAND_H
#define DELETE_COMMAND_H

#include <map>
#include <set>
#include <string>
#include "ICommand.h"

using namespace std;

class DeleteCommand : public ICommand {
public:
    string execute();
    static std::string lastCommand();
    bool isValidDeleteCommand(string command);
    bool isValidDeleteArguments(string arguments);
private:
    std::string processDeleteCommand(
    const std::string& command,
    std::map<int, std::set<int>>& userToMovies);

    void writeMoviesToFile(const std::map<int, std::set<int>>& userToMovies, const std::string& path);

    void deleteMoviesForUser(
    int userId,
    const std::vector<int>& movieIds,
    std::map<int, std::set<int>>& userToMovies);
};

#endif // DELETE_COMMAND_H