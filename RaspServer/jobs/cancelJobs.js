
function cancelJobs(jobs) {
    console.log(jobs)
    jobs.forEach((job) => {
        job.cancel();
    });
}

module.exports = cancelJobs;