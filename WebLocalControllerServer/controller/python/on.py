import RPi.GPIO as GPIO
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

if len(sys.argv) < 2:
    print("No pin provided")
else:
    pin = int(sys.argv[1])
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, 0)
    