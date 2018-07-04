import custom_date_time as dt

class Schedule:
    
    file_path = "./schedule.txt"

    start_time = dt.Time()
    duration = 0

    device_config = "0 0 0 0"
    device_id = 0

    def __init__(self, device_id = 0):
        self.device_id = device_id
    
    def load_from_file(self):
        schedule_file = open(self.file_path, 'r')

        for lines in schedule_file:
            line_id, s_h, s_m, d = lines.split()
            line_id = int(line_id)

            if line_id == self.device_id:
                self.device_config = lines[:-1]
                break
            else:
                pass

        schedule_file.close()

    def process_string_and_update(self):
        dev_id, start_hour, start_minute, duration = self.device_config.split()
        self.start_time = dt.Time(int(start_hour), int(start_minute))
        self.duration = int(duration)

    def update_schedule(self):
        self.load_from_file()
        self.process_string_and_update()


