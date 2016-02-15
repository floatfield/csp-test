require("babel-polyfill");
const csp = require("js-csp");
const comLayer = require("./communication-layer.js");

const channels = comLayer.createChannels();
