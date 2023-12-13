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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telefoon = void 0;
const Service_1 = require("./Service");
const tabels_1 = require("../tabels");
{ }
const node_fetch_1 = __importDefault(require("node-fetch")); // Assuming you're using Node.js environment for this code
class Telefoon extends Service_1.Service {
    constructor() {
        super(...arguments);
        this.getDataFromDB = () => __awaiter(this, void 0, void 0, function* () {
            const rows = yield tabels_1.TelefoonCentraal.select(['companyId', 'host']);
            if (rows.length === 0)
                return [];
            return rows.map(row => ({
                companyId: row.companyId,
                host: row.host,
            }));
        });
        this.execute = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('start ping');
                const dataList = yield this.getDataFromDB();
                //console.log('Data fetched from the database:', dataList);
                for (const { host } of dataList) {
                    const alive = yield this.isAlive(host);
                    if (!alive)
                        console.log(`${host} is offline!`);
                }
            }
            catch (error) {
                console.error('Error during ping:', error);
            }
        });
        this.isAlive = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, node_fetch_1.default)(url);
                //console.log(`Status for ${url}: ${response.status}`);
                return response.status === 200;
            }
            catch (error) {
                console.error(`Error while checking status for ${url}:`, error);
                return false;
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute();
            setInterval(this.execute, 15000);
        });
    }
}
exports.Telefoon = Telefoon;
