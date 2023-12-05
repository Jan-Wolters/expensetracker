"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const db_1 = require("../db");
const User_1 = require("./User");
let Payment = class Payment extends db_1.Model {
};
exports.Payment = Payment;
__decorate([
    db_1.Model.primaryKey,
    db_1.Model.autoIncrement,
    db_1.Model.notNull,
    db_1.Model.type("int")
], Payment.prototype, "id", void 0);
__decorate([
    db_1.Model.reference(User_1.User, "id")
], Payment.prototype, "userId", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], Payment.prototype, "name", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], Payment.prototype, "amount", void 0);
__decorate([
    db_1.Model.notNull,
    db_1.Model.type("varchar(255)")
], Payment.prototype, "type", void 0);
exports.Payment = Payment = __decorate([
    db_1.Model.register("payment")
], Payment);
