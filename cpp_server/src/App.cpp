#include "App.h"
#include "ICommand.h"
#include "IMenu.h"
#include <iostream>

using namespace std;

// Constructor definition
App::App(IMenu* menu, std::map<std::string, ICommand*> commands) {
    this->menu = menu;
    this->commands = commands;
}



// Run method definition
void App::run() {
    while (true) {
        string task = menu->nextCommand();

        if (commands.find(task) != commands.end()) {
            commands[task]->execute();
        }
    }
}