var jobFunctions = {};

jobFunctions.saveJobs = require("./saveJobs");
jobFunctions.saveIndJob = require("./saveIndJob");
jobFunctions.cancelJobs = require("./cancelJobs");
jobFunctions.initializePins = require("./initializePins");

module.exports = jobFunctions;