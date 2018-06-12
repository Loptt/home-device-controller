import socket
import sys
import threading
import time


class Server:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    host = ""
    port = 5000
    server_address = (host, port)
    command = ""

    def __init__(self):
        try:
            self.s.bind(self.server_address)
            self.s.listen(1)

        except socket.error as e:
            print(str(e))
            time.sleep(1)

    def handle_connection(self, conn, conn_address):
        conn.send(str.encode("Connected to Raspberry PI\n"))

        while True:

            data = conn.recv(1024)

            if not data:
                print(str(conn_address[0]) + ":" +
                      str(conn_address[1]) + " dissconnected")
                conn.close()
                break

            self.command = data.decode()
            print("From server class: ", self.command)

    def send_message(self, message):

        encoded = message.encode()

        try:
            self.connection.sendall(encoded)
        except:
            pass

    def run(self):
        print("Initializing server on thread...")
        print("Waiting for connections...\n")

        conn, conn_address = self.s.accept()
        conn.send(str.encode("Connected to Raspberry PI\n"))

        self.connection = conn
        
        print(str(conn_address[0]) + ":" + str(conn_address[1]) + " connected")

        while True:

            data = conn.recv(1024)

            if not data:
                print(str(conn_address[0]) + ":" +
                      str(conn_address[1]) + " dissconnected")
                conn.close()
                break

            self.command = data.decode()
            print("From server class: ", self.command)
