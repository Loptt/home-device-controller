import irrigator
import custom_date_time as dt

class Schedule:
    
    file_path = "./schedule.txt"

    start_time = dt.Time()
    duration = 0

    device_config = ""

    def __init__(self):
        pass
    
    def load_from_file(self):
        schedule_file = open(self.file_path, 'r')

        self.device_config = schedule_file.readline()
        self.device_config = self.device_config[:-1]

        schedule_file.close()

    def process_string_and_update(self):
        start_hour, start_minute, duration = self.irrigator_1_config.split()
        self.start_time = dt.Time(int(start_hour), int(start_minute))
        self.duration = int(duration)

    def update_schedule(self):
        self.load_from_file()
        self.process_string_and_update()


