"use strict";

export class Timer {
    constructor() {
        this.reset();
    }

    /** Resets all the timer variables.
     */
    reset() {
        this.state = "waiting";
        this.startTime = 0;
        this.elapsed = 0;
    }

    /** Starts counting the elapsed time and background music.
     */
    start() {
        if (!(this.state === "waiting")) {
            return false;
        }

        this.startTime = performance.now();
        this.state = "running";
        return true;
    }

    /** Stops the time counting and background music.
     */
    stop() {
        if (!(this.state === "running")) {
            return;
        }

        this.elapsed = performance.now() - this.startTime;
        this.state = "stopped";
    }

    /** Returns the elapsed time, based on if the game is running.
     */
    getElapsed() {
        if (this.state === "running") {
            return performance.now() - this.startTime;
        }
        return this.elapsed;
    }
}