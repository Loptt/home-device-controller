import RPi.GPIO as GPIO


class RaspberryControl:

    #Electrical configuration demands the on status to be a logical 0
    ON_STATUS = 0
    #Electrical configuration demands the off status to be a logical 1
    OFF_STATUS = 1

    pin = 0

    def __init__(self, set_pin):
        self.pin = set_pin

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)

        GPIO.output(self.pin, self.OFF_STATUS)

    def turn_on(self):
        GPIO.output(self.pin, self.ON_STATUS)

    def turn_off(self):
        GPIO.output(self.pin, self.OFF_STATUS)

    
