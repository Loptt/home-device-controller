import irrigator
import custom_date_time as dt

class Schedule:
    
    file_path = "./schedule.txt"

    irrigator_1_config = ""
    irrigator_2_config = ""

    irrigator_1 = irrigator.Irrigator()
    irrigator_2 = irrigator.Irrigator()

    def __init__(self):
        pass
    
    def load_from_file(self):
        schedule_file = open(self.file_path, 'r')

        self.irrigator_1_config = schedule_file.readline()
        self.irrigator_1_config = self.irrigator_1_config[:-1]

        self.irrigator_2_config = schedule_file.readline()
        self.irrigator_2_config = self.irrigator_2_config[:-1]

        schedule_file.close()

    def process_string_and_update(self):
        start_hour, start_minute, duration = self.irrigator_1_config.split()
        self.irrigator_1.start_time = dt.Time(start_hour, start_minute)
        self.irrigator_2.duration = duration

        start_hour, start_minute, duration = self.irrigator_2_config.split()
        self.irrigator_2.start_time = dt.Time(start_hour, start_minute)
        self.irrigator_2.duration = duration

    def update_schedule(self):
        self.load_from_file()
        self.process_string_and_update()

        return self.irrigator_1, self.irrigator_2

