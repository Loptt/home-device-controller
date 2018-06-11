import socket
import sys
import threading

class Server:
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	connections = []

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

	def get_message(self):

		message = self.command
		self.command = ""

		return message

	def handle_connection(self, conn, conn_address):
		conn.send(str.encode("Connected to Raspberry PI\n"))

		while True:

			data = conn.recv(1024).decode()   

			if not data:
				print(str(conn_address[0]) + ":" + str(conn_address[1]) + " dissconnected")
				conn.close()
				self.connections.remove(conn)
				break

			self.command = data.decode()

	def send_message(self):

		while True:

			print("Input message to clients:")

			try:
				message = ("Server says: " + input()).encode()
			except:
				print("Data input error")

			for connection in self.connections:
				connection.sendall(message)


	def run(self):
		print("Initializing server...")
		print("Waiting for connections...\n")

		while True:
			conn, conn_address = self.s.accept()
			thread = threading.Thread(target=self.handle_connection, args=(conn,conn_address))
			thread.daemon = True
			thread.start()

			self.connections.append(conn)

			print(str(conn_address[0]) + ":" + str(conn_address[1]) + " connected")
