import time
import server
import threading


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

    def __init__(self):
        server_thread = threading.Thread(target=self.serv.run())
        server_thread.daemon = True
        server_thread.start()

    def get_date_and_time(self):
        get_hour = int(time.strftime("%H"))
        get_minute = int(time.strftime("%M"))
        self.current_time = Time(get_hour, get_minute)

        get_day = int(time.strftime("%j"))
        get_month = int(time.strftime("%m"))
        get_year = int(time.strftime("%y"))
        self.current_date = Date(get_year, get_month, get_day)

    def run(self):

        while True:

            self.get_date_and_time()
            command = self.serv.get_message()

            if command != "":
                print("Command", command)

            if self.current_time.hours == 22 and self.current_time.minutes == 30:
                # turn ON first irrigation
                # turn OFF second irrigation
                print("Inicio riego 1")

            elif self.current_time.hours == 22 and self.current_time.minutes == 40:
                # turn OFF first irrigation
                # turn ON second irrigation
                pass

            else:
                # turn OFF fist irrigation
                # turn OFF second irrigation
                #print("Todo apagado")
                pass


irrigation_system = IrrigationSystem()
irrigation_system.run()
