if (typeof define === 'function') {
    define(["require", "exports", "./js/virtual-container.js"], function (require, exports, Cyz) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        return Cyz;
    });
} else if (module && module.exports) {
    var Cyz = require("./js/virtual-container.js");
    module.exports = Cyz;
}