require("babel-polyfill");
const csp = require("js-csp");
const _ = require("lodash");

let channels = {};

module.exports = {
    createChannels: function(worker) {
        let uid = _.uniqueId("channel_");
        let res = {
            intervalChannel: csp.chan(),
            dataChannel: csp.chan()
        };
        worker.postMessage({
            type: "createChannels",
            uid: uid
        });
        worker.addEventListener(function(e) {
            if (e.data.type === "data" && e.data.uid === uid) {
                let dataChan = res.dataChannel;
                csp.putAsync(dataChan, e.data.data);
            }
        });
        csp.go(function*() {
            let interval;
            while((interval = yield csp.take(res.intervalChannel)) !== csp.CLOSED) {
                worker.postMessage({
                    type: "interval",
                    interval: interval,
                    uid: uid
                });
            }
        });
        channels[uid] = res;
        return res;
    }
};
