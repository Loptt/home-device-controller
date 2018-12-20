var jobFunctions = {};

jobFunctions.saveJobs = require("./saveJobs");
jobFunctions.saveIndJob = require("./saveIndJob");
jobFunctions.cancelJobs = require("./cancelJobs");

module.exports = jobFunctions;