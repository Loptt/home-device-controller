import socket
import threading


class Client:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    message = ""
    server_address = 0

    def welcome(self):
        print("Welcome, please enter the address of the connection you want to reach")

        try:
            address = input("Address: ")
            port = input("Port: ")
            print("Connecting to "+address+":"+port+"...")

            return (address, int(port))
        except:
            return ("0.0.0.0", 0)

    def send_command(self):

        while True:
            self.message = input("Command: ")
            self.s.sendall(self.message.encode())

            if self.message == "quit":
                break

    def __init__(self):
        self.server_address = self.welcome()

    def connect(self):
        try:
            self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.s.connect(self.server_address)
        except:
            print("An error has ocurred")

        thread = threading.Thread(target=self.send_command)
        thread.daemon = True
        thread.start()

        while True:
            server_message = self.s.recv(2048)

            if not server_message:
                break

            print(server_message.decode())

            if self.message == "quit":
                break

        self.s.close()


client = Client()
client.connect()
