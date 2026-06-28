#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include <map>
#include <string>
#include "ICommand.h"

class App {
public:
    App(IMenu* menu, std::map<std::string, ICommand*> commands);  // Constructor declaration
    void run();  // Run method declaration
private:
    IMenu* menu;
    std::map<std::string, ICommand*> commands;
};

#endif // APP_H