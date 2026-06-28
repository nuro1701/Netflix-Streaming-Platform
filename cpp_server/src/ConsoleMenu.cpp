#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>
#define SOCKET int
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#define closesocket close
#endif

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <cstring>
#include <thread>
#include <mutex>
#include <queue>
#include <condition_variable>
#include "IMenu.h"
#include "DisplayRecommendedMoviesCommand.h"
#include "AddMovieCommand.h"
#include "HelpCommand.h"
#include "DeleteCommand.h"
#include "ICommand.h"
#include "ConsoleMenu.h"
#include "App.h"
#include "Utils.h"

#define MAX_CLIENTS 3
#define PORT 5555

using namespace std;

class ThreadPool {
public:
    ThreadPool(size_t numThreads);
    ~ThreadPool();
    void addTask(SOCKET clientSocket);

private:
    vector<thread> workers;
    queue<SOCKET> tasks;
    mutex queueMutex;
    condition_variable condition;
    bool stop;

    void workerFunction();
    void handleClient(SOCKET clientSocket);
};

ThreadPool::ThreadPool(size_t numThreads) : stop(false) {
    for (size_t i = 0; i < numThreads; ++i) {
        workers.emplace_back([this]() { workerFunction(); });
    }
}

ThreadPool::~ThreadPool() {
    {
        unique_lock<mutex> lock(queueMutex);
        stop = true;
    }
    condition.notify_all();
    for (thread &worker : workers) {
        worker.join();
    }
}

void ThreadPool::addTask(SOCKET clientSocket) {
    {
        unique_lock<mutex> lock(queueMutex);
        tasks.push(clientSocket);
    }
    condition.notify_one();
}

void ThreadPool::workerFunction() {
    while (true) {
        SOCKET clientSocket;
        {
            unique_lock<mutex> lock(queueMutex);
            condition.wait(lock, [this]() { return stop || !tasks.empty(); });
            if (stop && tasks.empty()) return;

            clientSocket = tasks.front();
            tasks.pop();
        }

        handleClient(clientSocket);
    }
}

void ThreadPool::handleClient(SOCKET clientSocket) {
    char buffer[1024];
    int bytesReceived;

    while (true) {
        bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        if (bytesReceived <= 0) {
            if (bytesReceived == 0) {
                cout << "Client disconnected.\n";
            } else {
                cerr << "Error reading from client socket.\n";
            }
            break;
        }

        buffer[bytesReceived] = '\0';
        string input(buffer);

        Utils::appendToFile(input, "../data/commandsHistory.txt");

        size_t res = input.find(" ");
        string command = (res != string::npos) ? input.substr(0, res) : input;

        map<string, ICommand*> commands;
        commands["POST"] = new AddMovieCommand();
        commands["PATCH"] = new AddMovieCommand();
        commands["GET"] = new DisplayRecommendedMoviesCommand();
        commands["help"] = new HelpCommand();
        commands["DELETE"] = new DeleteCommand();

        string response;
        if (commands.find(command) != commands.end()) {
            response = commands[command]->execute();
        } else {
            response = "404 Not Found";
        }

        send(clientSocket, response.c_str(), response.size(), 0);

        for (auto &cmd : commands) {
            delete cmd.second;
        }
    }

    closesocket(clientSocket);
}

int main() {
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        cerr << "WSAStartup failed\n";
        return 1;
    }
#endif

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (serverSocket == INVALID_SOCKET) {
#ifdef _WIN32
        cerr << "Error at socket(): " << WSAGetLastError() << endl;
        WSACleanup();
#else
        cerr << "Error at socket(): " << errno << endl;
#endif
        return 1;
    }

    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        cerr << "bind failed\n";
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    if (listen(serverSocket, MAX_CLIENTS) == SOCKET_ERROR) {
        cerr << "listen failed\n";
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    cout << "Server is running on port " << PORT << endl;

    ThreadPool threadPool(MAX_CLIENTS);

    sockaddr_in clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);

    while (true) {
        SOCKET clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientAddrLen);
        if (clientSocket == INVALID_SOCKET) {
            cerr << "Accept failed\n";
            continue;
        }

        cout << "New connection: " << inet_ntoa(clientAddr.sin_addr) << ":" << ntohs(clientAddr.sin_port) << endl;

        threadPool.addTask(clientSocket);
    }

    closesocket(serverSocket);
#ifdef _WIN32
    WSACleanup();
#endif
    return 0;
}
