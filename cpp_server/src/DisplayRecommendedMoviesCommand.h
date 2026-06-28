#ifndef DISPLAY_RECOMMENDED_MOVIES_COMMAND_H
#define DISPLAY_RECOMMENDED_MOVIES_COMMAND_H

#include <map>
#include <set>
#include <string>
#include "ICommand.h"

class DisplayRecommendedMoviesCommand : public ICommand {
public:
    std::string execute();
    static std::string lastCommand();
    static bool isValidRecommendedCommand(const std::string& command);
    static int GetUser(const std::string& command);
    static int GetMovieArgument(const std::string& command);

private:
    static bool isValidRecommendedArguments(const std::string& arguments);
};

#endif // DISPLAY_RECOMMENDED_MOVIES_COMMAND_H