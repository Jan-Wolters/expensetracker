"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = void 0;
var string;
(function (string) {
    string.toSnakeCase = (str) => str.split("").map((c, i) => {
        if (i === 0)
            return c;
        return c === c.toUpperCase() ? `_${c}` : c;
    }).join("").toLowerCase();
    string.toCamelCase = (str) => {
        while (str[0] === "_")
            str = str.substring(1, str.length);
        return str.split("").map((c, i) => {
            if (c === '_')
                return "";
            if (i === 0)
                return c.toLowerCase();
            if (str[i - 1] === '_')
                return c.toUpperCase();
            return c.toLowerCase();
        }).join("");
    };
})(string || (exports.string = string = {}));
