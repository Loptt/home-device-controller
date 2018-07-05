import raspberry_control
import schedule
import custom_date_time as dt

class Device:

    d_schedule = schedule.Schedule()
    control = raspberry_control.RaspberryControl(0)
    device_id = 0

    def __init__(self, device_id, pin):
        self.control = raspberry_control.RaspberryControl(pin)
        self.device_id = device_id

        self.d_schedule = schedule.Schedule(device_id)

    def update_schedule(self):
        self.d_schedule.update_schedule()

    def check_schedule(self, current_time, stop):
        
        if current_time >= self.d_schedule.start_time and current_time < self.d_schedule.start_time + self.d_schedule.duration and not stop:
            self.control.turn_on()
            return True
        
        else:
            self.control.turn_off()
            return False
        


    

