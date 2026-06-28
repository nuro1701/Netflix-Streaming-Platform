#ifndef ADDMOVIECOMMAND_H
#define ADDMOVIECOMMAND_H

#include "ICommand.h"
#include <iostream>
#include <string>

using namespace std;

class AddMovieCommand : public ICommand {
public:
    string execute() override;
    string lastCommand();
    bool isValidAddCommand(string command);
    bool isValidAddArguments(string arguments);
private:
    int GetUser(const string& command);
};

#endif // ADDMOVIECOMMAND_H