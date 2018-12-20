
function cancelJobs(jobs) {
    jobs.forEach((job) => {
        job.cancel();
    });
}

module.exports = cancelJobs;