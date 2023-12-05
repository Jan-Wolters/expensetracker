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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.DB = void 0;
const mysql2_1 = require("mysql2");
const utils_1 = require("./utils");
class DB {
    constructor() {
        this.getPool = () => this.pool_;
        this.query = (sql, values = []) => new Promise((res, rej) => {
            this.pool_.getConnection((err, conn) => {
                if (err) {
                    return rej(err);
                }
                conn.query(sql, values, (err, result) => {
                    if (err) {
                        conn.release();
                        return rej(err);
                    }
                    conn.release();
                    res(result);
                });
            });
        });
        this.pool_ = (0, mysql2_1.createPool)({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
}
exports.DB = DB;
_a = DB;
DB.instance_ = new _a();
DB.get = () => _a.instance_;
DB.initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const table of Model["registeredTables"]) {
        yield Model["createTable"](table);
    }
});
class Model {
    static select(what = "*", where = [], options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const whatString = Array.isArray(what) ? what.map(k => utils_1.string.toSnakeCase(k.toString())).join(",") : what;
            const whereValues = [];
            const whereString = where.map(w => _b.parseWhere(w, whereValues)).join(" OR ");
            let sql = `SELECT ${whatString} FROM ${this.tableName}`;
            if (whereString.length > 0)
                sql += ` WHERE ${whereString}`;
            if (options.order) {
                const [column, order] = options.order.split(" ");
                sql += ` ORDER BY ${utils_1.string.toSnakeCase(column)} ${order}`;
            }
            if (options.limit)
                sql += ` LIMIT ${options.limit}`;
            const rows = yield DB.get().query(sql, whereValues);
            return rows.map(row => {
                const newRow = {};
                for (const k in row)
                    newRow[utils_1.string.toCamelCase(k)] = row[k];
                return newRow;
            });
        });
    }
    ;
    static update(what, ...where) {
        return __awaiter(this, void 0, void 0, function* () {
            const whatString = Object.keys(what).map(k => `${utils_1.string.toSnakeCase(k)} = ?`).join(", ");
            const values = [...Object.values(what), ...Object.values(where)];
            const whereValues = [];
            const whereString = where.map(w => _b.parseWhere(w, whereValues)).join(" OR ");
            let sql = `UPDATE ${this.tableName} SET ${whatString}`;
            if (whereString.length > 0)
                sql += ` WHERE ${whereString}`;
            return yield DB.get().query(sql, values);
        });
    }
    ;
    static insert(...what) {
        return __awaiter(this, void 0, void 0, function* () {
            if (what.length === 0)
                return null;
            const columns = Object.keys(what[0]).map(utils_1.string.toSnakeCase);
            const columnString = `(${columns.join(",")})`;
            const values = [];
            const rows = what.map(props => {
                const vals = Object.values(props);
                values.push(...vals);
                return `(${vals.map(_ => "?").join(",")})`;
            });
            const sql = `INSERT INTO ${this.tableName} ${columnString} VALUES ${rows.join(",")}`;
            return yield DB.get().query(sql, values);
        });
    }
    ;
    static delete(...where) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(where).length === 0)
                throw new Error("Cannot delete with an empty where clause!");
            const whereValues = [];
            const whereString = where.map(w => _b.parseWhere(w, whereValues)).join(" OR ");
            const sql = `DELETE FROM ${this.tableName} WHERE ${whereString}`;
            return yield DB.get().query(sql, whereValues);
        });
    }
    ;
}
exports.Model = Model;
_b = Model;
Model.registeredTables = [];
Model.register = (tableName) => (Class, ..._rest) => {
    Class.tableName = tableName;
    _b.registeredTables.push(Class);
};
Model.createTable = (Table) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = [];
    let foundPrimaryKey = null;
    let foreignKeys = [];
    for (const columnName in Table.tableColumns) {
        if (!Table.tableColumns[columnName])
            continue;
        const { type, autoIncrement, notNull, primaryKey, foreignKey } = Table.tableColumns[columnName];
        let colString = "";
        if (foreignKey) {
            const { type, notNull } = foreignKey[0].tableColumns[foreignKey[1]];
            colString = `${utils_1.string.toSnakeCase(columnName)} ${type}`;
            if (notNull)
                colString += " NOT NULL";
            foreignKeys.push([columnName, foreignKey]);
        }
        else {
            colString = `${utils_1.string.toSnakeCase(columnName)} ${type}`;
            if (autoIncrement)
                colString += " NOT NULL AUTO_INCREMENT";
            else if (notNull)
                colString += " NOT NULL";
            if (primaryKey) {
                if (foundPrimaryKey)
                    throw new Error("There already exists a primary key!");
                foundPrimaryKey = columnName;
            }
            else if (foreignKey) {
                foreignKeys.push([columnName, foreignKey]);
            }
        }
        columns.push(colString);
    }
    if (foundPrimaryKey)
        columns.push(`PRIMARY KEY (${utils_1.string.toSnakeCase(foundPrimaryKey)})`);
    if (foreignKeys.length > 0)
        columns.push(...foreignKeys.map(([columName, [TableType, ref]]) => `FOREIGN KEY (${utils_1.string.toSnakeCase(columName)}) REFERENCES ${TableType.tableName}(${utils_1.string.toSnakeCase(ref.toString())})`));
    yield DB.get().query(`CREATE TABLE IF NOT EXISTS ${Table.tableName} (${columns.join(", ")})`);
});
Model.setColumnInfo = (Class, name, info) => {
    if (!Class.constructor.tableColumns)
        Class.constructor.tableColumns = {};
    if (!Class.constructor.tableColumns[name])
        Class.constructor.tableColumns[name] = {};
    Class.constructor.tableColumns[name] = Object.assign(Object.assign({}, Class.constructor.tableColumns[name]), info);
};
Model.type = (type) => (Class, columnName) => {
    _b.setColumnInfo(Class, columnName, { type });
};
Model.autoIncrement = (Class, columnName) => {
    _b.setColumnInfo(Class, columnName, { autoIncrement: true });
};
Model.notNull = (Class, columnName) => {
    _b.setColumnInfo(Class, columnName, { notNull: true });
};
Model.primaryKey = (Class, columnName) => {
    _b.setColumnInfo(Class, columnName, { primaryKey: true });
};
Model.reference = (TableClass, column) => (Class, columnName) => {
    _b.setColumnInfo(Class, columnName, { foreignKey: [TableClass, column.toString()] });
};
Model.parseWhere = (where, values) => {
    return Object.keys(where).map(k => {
        let str = "";
        const val = where[k];
        if (Array.isArray(val)) {
            values.push(val[1]);
            return `${utils_1.string.toSnakeCase(k)} ${val[0]} ?`;
        }
        else {
            values.push(val);
            return `${utils_1.string.toSnakeCase(k)} = ?`;
        }
        return str;
    }).join(" AND ");
};
;
