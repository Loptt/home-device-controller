const { exec } = require("child_process");

controller = {}

controller.turnOn = function (pin) {
    exec("python3 ./controller/python/on.py " + Number(pin), (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

controller.turnOff = function (pin) {
    exec("python3 ./controller/python/off.py " + Number(pin), (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

module.exports = controller