import socket

def main():
    server_address = '127.0.0.1'  # Server IP address
    server_port = 5555            # Server port

    try:
        # Create socket and connect to the server
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((server_address, server_port))

        while True:
            # Prompt user for input
            user_input = input("Enter command: ")
            if user_input.lower() == 'exit':
                break

            # Send user input to the server
            client_socket.sendall(user_input.encode())

            # Receive response from the server
            data = client_socket.recv(1024)
            if data:
                print("Received from server:", data.decode())

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        client_socket.close()

if __name__ == "__main__":
    main()