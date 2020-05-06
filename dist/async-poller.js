"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * How to repeatedly call an async function until get a desired result.
 *
 * Inspired by the following gist:
 * https://gist.github.com/twmbx/2321921670c7e95f6fad164fbdf3170e#gistcomment-3053587
 * https://davidwalsh.name/javascript-polling
 *
 * Usage:
    asyncPoll(
        async (): Promise<AsyncData<any>> => {
            try {
                const result = await getYourAsyncResult();
                if (result.isWhatYouWant) {
                    return Promise.resolve({
                        done: true,
                        data: result,
                    });
                } else {
                    return Promise.resolve({
                        done: false
                    });
                }
            } catch (err) {
                return Promise.reject(err);
            }
        },
        500,    // interval
        15000,  // timeout
    );
 */
function asyncPoll(
/**
 * Function to call periodically until it resolves or rejects.
 *
 * It should resolve as soon as possible indicating if it found
 * what it was looking for or not. If not then it will be reinvoked
 * after the `pollInterval` if we haven't timed out.
 *
 * Rejections will stop the polling and be propagated.
 */
fn, 
/**
 * Milliseconds to wait before attempting to resolve the promise again.
 * The promise won't be called concurrently. This is the wait period
 * after the promise has resolved/rejected before trying again for a
 * successful resolve so long as we haven't timed out.
 *
 * Default 5 seconds.
 */
pollInterval = 5 * 1000, 
/**
 * Max time to keep polling to receive a successful resolved response.
 * If the promise never resolves before the timeout then this method
 * rejects with a timeout error.
 *
 * Default 30 seconds.
 */
pollTimeout = 30 * 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        const endTime = new Date().getTime() + pollTimeout;
        const checkCondition = (resolve, reject) => {
            Promise.resolve(fn())
                .then((result) => {
                const now = new Date().getTime();
                if (result.done) {
                    resolve(result.data);
                }
                else if (now < endTime) {
                    setTimeout(checkCondition, pollInterval, resolve, reject);
                }
                else {
                    reject(new Error("AsyncPoller: reached timeout"));
                }
            })
                .catch((err) => {
                reject(err);
            });
        };
        return new Promise(checkCondition);
    });
}
exports.asyncPoll = asyncPoll;
