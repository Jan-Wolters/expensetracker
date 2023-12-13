"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = require("../db");
let User = class User extends db_1.Model {
};
exports.User = User;
__decorate([
    db_1.Model.type("int"),
    db_1.Model.autoIncrement,
    db_1.Model.primaryKey
], User.prototype, "id", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], User.prototype, "username", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], User.prototype, "password", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], User.prototype, "email", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], User.prototype, "bank", void 0);
exports.User = User = __decorate([
    db_1.Model.register("users")
], User);
