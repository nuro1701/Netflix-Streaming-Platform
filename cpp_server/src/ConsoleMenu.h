#ifndef CONSOLE_MENU_H
#define CONSOLE_MENU_H

#include "IMenu.h"
#include <string>

class ConsoleMenu : public IMenu {
private:
    int client_sock;
public:
    // Constructor
    explicit ConsoleMenu(int clientSock); 
    std::string nextCommand() override; 
    void displayError(const std::string& error) override;
};

#endif // CONSOLE_MENU_H