import RPi.GPIO as GPIO
import time
import threading
import server
import socket
import sys

PIN_1 = 2
PIN_2 = 3

GPIO.setmode(GPIO.BOARD)
GPIO.setup(PIN_1, GPIO.OUT)
GPIO.setup(PIN_2, GPIO.OUT)

class Date:

    year = 0
    month = 0
    day = 0

    def __init__(self, year=0, month=0, day=0):
        self.day = day
        self.month = month
        self.year = year


class Time:

    hours = 0
    minutes = 0

    def __init__(self, hours=0, minutes=0):
        self.hours = hours
        self.minutes = minutes


class IrrigationSystem:

    current_date = Date()
    current_time = Time()

    serv = server.Server()

    stop_all = False
    irr_1_active = False
    irr_2_active = False

    def __init__(self):
        print("Initializing controller...")
        
        print("Initializing server on controller...")

        server_thread = threading.Thread(target=self.serv.run)
        server_thread.daemon = True

        print("Switching server to thread...")
        server_thread.start()

    def get_date_and_time(self):
        get_hour = int(time.strftime("%H"))
        get_minute = int(time.strftime("%M"))
        self.current_time = Time(get_hour, get_minute)

        get_day = int(time.strftime("%j"))
        get_month = int(time.strftime("%m"))
        get_year = int(time.strftime("%y"))
        self.current_date = Date(get_year, get_month, get_day)

    def process_command(self, command):

        if command == "stop":

            if self.stop_all:
                self.serv.send_message("Irrigation already in halt mode\n")
            
            else:
                self.stop_all = True
                self.serv.send_message("Irrigation has been halted until resume command is issued\n")
                
        elif command == "resume":

            if not self.stop_all:
                self.serv.send_message("Irrigation already in normal mode\n")

            else:
                self.stop_all  = False
                self.serv.send_message("Irrigation has been resumed\n")

        elif command == "status":

            if not self.stop_all:
                self.serv.send_message("Irrigation in normal mode\n")

                if self.irr_1_active:
                    self.serv.send_message("System 1 is currently running\n")

                if self.irr_2_active:
                    self.serv.send_message("System 2 is currently running\n")
            else:
                self.serv.send_message("WARNING: Irrigation halted\n")
                
        elif command == "help":
            self.serv.send_message("------List of avaliable commands--------\n")
            self.serv.send_message("status: prints the current status of the system\n")
            self.serv.send_message("stop: stops all irrigation\n")
            self.serv.send_message("resume: continue normal irrigation operations\n")
            self.serv.send_message("help: displays a list of available commands\n")
            self.serv.send_message("exit: exits current client session\n")

        elif command == "exit":
            pass

        else:
            self.serv.send_message("Command " + command + " not found. Type help for a list of commands.\n")

        self.serv.command = ""      

    def run(self):

        print("Starting controller...")

        self.stop_all = False        

        while True:

            self.get_date_and_time()
            command = self.serv.command

            if command != "":
                self.process_command(command)          

            if self.current_time.hours == 22 and self.current_time.minutes == 30 and not stop_all:
                # turn ON first irrigation
                # turn OFF second irrigation
                self.irr_1_active = True
                self.irr_2_active = False

                GPIO.output(PIN_1, 1)
                GPIO.output(PIN_2, 0)

                print("Inicio riego 1")

            elif self.current_time.hours == 22 and self.current_time.minutes == 40 and not stop_all:
                # turn OFF first irrigation
                # turn ON second irrigation
                self.irr_1_active = False
                self.irr_2_active = True

                GPIO.output(PIN_1, 0)
                GPIO.output(PIN_2, 1)

                print("Inicio riego 2")
                pass

            else:
                # turn OFF fist irrigation
                # turn OFF second irrigation
                #print("Todo apagado")
                self.irr_1_active = False
                self.irr_2_active = False

                GPIO.output(PIN_1, 0)
                GPIO.output(PIN_2, 0)

                pass

print("Instantiating system...")
irrigation_system = IrrigationSystem()
print("Initializing run on controller...")
irrigation_system.run()
