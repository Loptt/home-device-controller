#import RPi.GPIO as GPIO
import time
import threading
import server
import socket
import sys
import custom_date_time as date_time
import irrigator
import schedule


PIN_1 = 2
PIN_2 = 3

#Electrical configuration demands the on status to be a logical 0
ON_STATUS = 0
#Electrical configuration demands the off status to be a logical 1
OFF_STATUS = 1

#GPIO.setmode(GPIO.BCM)
#GPIO.setup(PIN_1, GPIO.OUT)
#GPIO.setup(PIN_2, GPIO.OUT)

#GPIO.output(PIN_1, OFF_STATUS)
#GPIO.output(PIN_2, OFF_STATUS)


class IrrigationSystem:

    current_date = date_time.Date()
    current_time = date_time.Time()

    serv = server.Server()

    schedule = schedule.Schedule()

    irrigator_1 = irrigator.Irrigator()
    irrigator_2 = irrigator.Irrigator()

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
        self.current_time = date_time.Time(get_hour, get_minute)

        get_day = int(time.strftime("%j"))
        get_month = int(time.strftime("%m"))
        get_year = int(time.strftime("%y"))
        self.current_date = date_time.Date(get_year, get_month, get_day)

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

        print("Loading configuration file...")
        self.irrigator_1, self.irrigator_2 = schedule.update_schedule()

        self.stop_all = False        

        while True:

            self.get_date_and_time()
            command = self.serv.command

            if command != "":
                self.process_command(command)          

            if self.current_time == self.irrigator_1.start_time and self.current_time + self.irrigator_1.dura and not self.stop_all:
                
                self.irr_1_active = True
                self.irr_2_active = False

                # turn ON first irrigation
 #               GPIO.output(PIN_1, ON_STATUS)

                # turn OFF second irrigation
 #              GPIO.output(PIN_2, OFF_STATUS)

                print("Inicio riego 1")

            elif self.current_time.hours == 10 and self.current_time.minutes >= 10  and self.current_time.minutes < 14 and not self.stop_all:
                
                self.irr_1_active = False
                self.irr_2_active = True

                # turn OFF first irrigation
  #              GPIO.output(PIN_1, OFF_STATUS)

                # turn ON second irrigation
   #             GPIO.output(PIN_2, ON_STATUS)

                print("Inicio riego 2")

            else:
            
                self.irr_1_active = False
                self.irr_2_active = False

                # turn OFF fist irrigation
    #            GPIO.output(PIN_1, OFF_STATUS)

                # turn OFF second irrigation
     #           GPIO.output(PIN_2, OFF_STATUS)
