#include <iostream>
#include <fstream>
#include "HelpCommand.h"
#include "Utils.h"

using namespace std;

// Implementation of execute method
string HelpCommand::execute() {
    std::string response = "";
    string command = lastCommand();
    if (HelpCommand::isValidHelpCommand(command)) {

        response += "200 OK\n";
        response += "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n";
        response += "GET, arguments: [userid] [movieid]\n";
        response += "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n";
        response += "POST, arguments: [userid] [movieid1] [movieid2] ...\n";
        response += "help\n";
    }
    return response;
}

string HelpCommand::lastCommand() {
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

bool HelpCommand::isValidHelpCommand(string& command){
    if(Utils::containsTab(command)) return false;
    string arguments = Utils::trimFirstWord(command);

    if (!arguments.empty()) {
        return false; // No arguments
    }

    return true;
}