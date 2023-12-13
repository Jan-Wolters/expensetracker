"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelefoonCentraal = void 0;
const db_1 = require("../db");
const User_1 = require("./User");
let TelefoonCentraal = class TelefoonCentraal extends db_1.Model {
};
exports.TelefoonCentraal = TelefoonCentraal;
__decorate([
    db_1.Model.primaryKey,
    db_1.Model.autoIncrement,
    db_1.Model.type("int")
], TelefoonCentraal.prototype, "id", void 0);
__decorate([
    db_1.Model.reference(User_1.User, "id")
], TelefoonCentraal.prototype, "companyId", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], TelefoonCentraal.prototype, "host", void 0);
exports.TelefoonCentraal = TelefoonCentraal = __decorate([
    db_1.Model.register("telefooncentraal")
], TelefoonCentraal);
