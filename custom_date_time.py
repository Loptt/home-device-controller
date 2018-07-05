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

    def __eq__(self, time_2):

        return self.hours == time_2.hours and self.minutes == time_2.minutes

    def __add__(self, time_2):
        
        if self.hours + time_2.hours < 24:
            hours = self.hours + time_2.hours

        else:
            hours = self.hours + time_2.hours - 24

        if self.minutes + time_2.minutes < 60:
            minutes = self.minutes + time_2.minutes

        else:
            hours = hours + 1
            minutes = self.minutes + time_2.minutes - 60

        time = Time(hours, minutes)

        return time

    def __add__(self, minutes):

        hours = self.hours

        if self.minutes + minutes < 60:
            final_minutes = self.minutes + minutes
        
        else:
            hours = hours + 1
            final_minutes = self.minutes + minutes - 60

        time = Time(hours, final_minutes)

        return time

    def __gt__(self, time_2):
        
        if self.hours < time_2.hours:
            return False
        
        elif self.hours == time_2.hours:
            return self.minutes > time_2.minutes
        
        return True

    def __ge__(self, time_2):

        return self == time_2 or self > time_2

    def __lt__(self, time_2):

        return not self >= time_2
    
    def __le__(self, time_2):

        return self < time_2 or self == time_2

