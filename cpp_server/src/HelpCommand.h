#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H

#include "ICommand.h"
#include <string>
#include <iostream>

using namespace std;

class HelpCommand : public ICommand {
public:
    string execute() override;
private:
    bool isValidHelpCommand(string& command);
    string lastCommand();
};

#endif // HELPCOMMAND_H