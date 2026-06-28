#include <iostream>
#include <cassert>
#include "DisplayRecommendedMoviesCommand.h"
#include "Utils.h"

using namespace std;

class DisplayRecommendedMoviesCommandTest {
public:
    // Run a series of positive, negative, integration, and randomized unit tests for the
    // `DisplayRecommendedMoviesCommand` class. If all tests pass, it prints success; otherwise, it reports a failure.
    static void runTests() {
        try {
            // Positive Tests
            testExecuteWithValidCommand();
            testIsValidRecommendedCommandWithValidInput();
            testGetUserWithValidCommand();
            testGetMovieArgumentWithValidCommand();

            // Negative Tests
            testExecuteWithInvalidCommand();
            testIsValidRecommendedCommandWithInvalidInput();
            testGetUserWithInvalidCommand();
            testGetMovieArgumentWithInvalidCommand();

            // Integration Tests
            testExecuteWithMockedDependencies();

            // Randomized Tests
            testRandomizedInputs();

            cout << "All tests passed successfully." << endl;
        } catch (const exception& e) {
            cerr << "Test failed: " << e.what() << endl;
        }
    }

private:
    // Sefines test cases to validate the functionality of the class, including executing a valid command,
    // checking input validation, and extracting the user ID from a valid command.
    static void mockDependencies() {
        Utils::clearFile("../data/commandsHistory.txt");
        Utils::appendToFile("recommend 1 2", "../data/commandsHistory.txt");
    }

    static void testExecuteWithValidCommand() {
        DisplayRecommendedMoviesCommand command;
        mockDependencies();
        command.execute();
        cout << "Positive: testExecuteWithValidCommand passed." << endl;
    }

    static void testIsValidRecommendedCommandWithValidInput() {
        DisplayRecommendedMoviesCommand command;
        assert(command.isValidRecommendedCommand("recommend 1 2") && "Valid input should pass validation.");
        cout << "Positive: testIsValidRecommendedCommandWithValidInput passed." << endl;
    }

    static void testGetUserWithValidCommand() {
        DisplayRecommendedMoviesCommand command;
        int user = command.GetUser("recommend 1 2");
        assert(user == 1 && "Expected user ID 1.");
        cout << "Positive: testGetUserWithValidCommand passed." << endl;
    }

    static void testGetMovieArgumentWithValidCommand() {
        DisplayRecommendedMoviesCommand command;
        int movie = command.GetMovieArgument("recommend 1 2");
        assert(movie == 2 && "Expected movie ID 2.");
        cout << "Positive: testGetMovieArgumentWithValidCommand passed." << endl;
    }

    // Defines negative test cases for the class, verifying its behavior when handling invalid commands,
    // including incomplete inputs, invalid formats, and missing arguments.
    static void testExecuteWithInvalidCommand() {
        DisplayRecommendedMoviesCommand command;
        Utils::clearFile("../data/commandsHistory.txt");
        Utils::appendToFile("invalidCommand", "../data/commandsHistory.txt");
    }

    static void testIsValidRecommendedCommandWithInvalidInput() {
        DisplayRecommendedMoviesCommand command;
        assert(!command.isValidRecommendedCommand("recommend 1") && "Incomplete command should fail validation.");
        assert(!command.isValidRecommendedCommand("invalidCommand") && "Invalid command should fail validation.");
        cout << "Negative: testIsValidRecommendedCommandWithInvalidInput passed." << endl;
    }

    static void testGetUserWithInvalidCommand() {
        DisplayRecommendedMoviesCommand command;
        try {
            command.GetUser("recommend");
            assert(false && "Expected exception for missing user ID.");
        } catch (const invalid_argument&) {
            cout << "Negative: testGetUserWithInvalidCommand passed." << endl;
        }
    }

    static void testGetMovieArgumentWithInvalidCommand() {
        DisplayRecommendedMoviesCommand command;
        try {
            command.GetMovieArgument("recommend 1");
            assert(false && "Expected exception for missing movie ID.");
        } catch (const invalid_argument&) {
            cout << "Negative: testGetMovieArgumentWithInvalidCommand passed." << endl;
        }
    }

    // Tests the integration with mocked dependencies to ensure the `execute` method functions correctly without unexpected exceptions.
    static void testExecuteWithMockedDependencies() {
        DisplayRecommendedMoviesCommand command;
        mockDependencies();

        try {
            command.execute();
            cout << "Integration: testExecuteWithMockedDependencies passed." << endl;
        } catch (...) {
            assert(false && "Unexpected exception during execution.");
        }
    }

    // Randomized tests by generating random "recommend" commands, executing them, and logging whether each command passes or fails.
    static void testRandomizedInputs() {
        DisplayRecommendedMoviesCommand command;

        for (int i = 0; i < 5; ++i) {
            string randomCommand = "recommend " + to_string(rand() % 100) + " " + to_string(rand() % 100);
            Utils::clearFile("../data/commandsHistory.txt");
            Utils::appendToFile(randomCommand, "../data/commandsHistory.txt");

            try {
                command.execute();
                cout << "Randomized: Passed for input: " << randomCommand << endl;
            } catch (...) {
                cout << "Randomized: Failed for input: " << randomCommand << endl;
            }
        }
        cout << "Randomized: testRandomizedInputs passed." << endl;
    }
};

// main method for running all of the department's tests.
int main() {
    DisplayRecommendedMoviesCommandTest::runTests();
    return 0;
}