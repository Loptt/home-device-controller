import time
import threading
import server
import socket
import sys
import custom_date_time as dt
from datetime import datetime
import irrigator
import schedule
import device


class IrrigationSystem:

    current_date = dt.Date()
    current_time = dt.Time()

    serv = server.Server()

    irrigator_1 = device.Device(2)
    irrigator_2 = device.Device(3)

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
        self.current_time = dt.Time(get_hour, get_minute)

        get_day = int(time.strftime("%j"))
        get_month = int(time.strftime("%m"))
        get_year = int(time.strftime("%y"))
        self.current_date = dt.Date(get_year, get_month, get_day)

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
        self.irrigator_1.update_schedule()
        self.irrigator_2.update_schedule()

        self.stop_all = False

        signal_1_sent = False
        signal_2_sent = False   
        signal_stop_sent = False           

        while True:

            currentDT = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            self.get_date_and_time()
            command = self.serv.command

            if command != "":
                self.process_command(command)

            activate_dev_1 = self.irrigator_1.check_schedule(self.current_time, self.stop_all)
            activate_dev_2 = self.irrigator_2.check_schedule(self.current_time, self.stop_all)        

            if activate_irr_1 and not self.stop_all:

                if not signal_1_sent:
                    print("\n" + currentDT + " -> Irrigation 1 start")
                    signal_1_sent = True
                
                self.irr_1_active = True
                signal_stop_sent = False

            else:
                if signal_1_sent:
                    print("\n" + currentDT +" -> Irrigation 1 stopped")

                signal_1_sent = False
                self.irr_1_active = False

            if activate_irr_2 and not self.stop_all:

                if not signal_2_sent:
                    print("\n" + currentDT +" -> Irrigation 2 start")
                    signal_2_sent = True

                self.irr_2_active = True
                signal_stop_sent = False

            else:
                if signal_2_sent:
                    print("\n" + currentDT +" -> Irrigation 2 stopped")

                signal_2_sent = False
                self.irr_2_active = False

            if not activate_irr_1 and not activate_irr_2:

                if not signal_stop_sent:
                    print("\n" + currentDT +" -> No irrigation active")
                    signal_stop_sent = True