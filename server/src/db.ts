import { OkPacket, Pool, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createPool } from "mysql2";
import { string } from "./utils";

export class DB {
    private static readonly instance_ = new DB();

    public static readonly get = (): Readonly<DB> => this.instance_;

    public static readonly initialize = async () => {
        for (const table of Model["registeredTables"]) {
            await Model["createTable"](table);
        }
    }

    private pool_: Pool;

    constructor() {

        this.pool_ = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }

    public readonly getPool = () => this.pool_;

    public readonly query = (sql: string, values: any[] = []) => new Promise<QueryResult>((res, rej) => {
        this.pool_.getConnection((err, conn) => {
            if (err) {
                return rej(err);
            }

            conn.query(sql, values, (err: any, result: any) => {
                if (err) {
                    conn.release();
                    return rej(err);
                }

                conn.release();
                res(result);
            });
        });
    })
}

export abstract class Model {
    private static readonly registeredTables: TableType[] = [];

    declare public static readonly tableName: string;

    declare public static readonly tableColumns: { [column: string]: ColumInfo };

    public static readonly register = (tableName: string) => (Class: any, ..._rest: any[]) => {
        Class.tableName = tableName;
        Model.registeredTables.push(Class);
    };

    private static readonly createTable = async (Table: TableType) => {
        const columns: string[] = [];

        let foundPrimaryKey: string | null = null;
        let foreignKeys: [string, ForeignKey<any>][] = [];

        for (const columnName in Table.tableColumns) {
            if (!Table.tableColumns[columnName])
                continue;

            const { type, autoIncrement, notNull, primaryKey, foreignKey } = Table.tableColumns[columnName]!;

            let colString: string = "";

            if (foreignKey) {
                const { type, notNull } = foreignKey[0].tableColumns[foreignKey[1]];

                colString = `${string.toSnakeCase(columnName)} ${type}`;

                if (notNull)
                    colString += " NOT NULL";

                foreignKeys.push([columnName, foreignKey]);
            }
            else {
                colString = `${string.toSnakeCase(columnName)} ${type}`;

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
            columns.push(`PRIMARY KEY (${string.toSnakeCase(foundPrimaryKey)})`);

        if (foreignKeys.length > 0)
            columns.push(...foreignKeys.map(([columName, [TableType, ref]]) => `FOREIGN KEY (${string.toSnakeCase(columName)}) REFERENCES ${TableType.tableName}(${string.toSnakeCase(ref.toString())})`));

        await DB.get().query(`CREATE TABLE IF NOT EXISTS ${Table.tableName} (${columns.join(", ")})`);
    }

    private static readonly setColumnInfo = (Class: any, name: string, info: Partial<ColumInfo>) => {
        if (!Class.constructor.tableColumns)
            Class.constructor.tableColumns = {};
        if (!Class.constructor.tableColumns[name])
            Class.constructor.tableColumns[name] = {};
        Class.constructor.tableColumns[name] = { ...Class.constructor.tableColumns[name], ...info };
    }

    public static readonly type = (type: ColumnType) => (Class: any, columnName: string) => {
        Model.setColumnInfo(Class, columnName, { type });
    };

    public static readonly autoIncrement = (Class: any, columnName: string) => {
        Model.setColumnInfo(Class, columnName, { autoIncrement: true });
    };

    public static readonly notNull = (Class: any, columnName: string) => {
        Model.setColumnInfo(Class, columnName, { notNull: true });
    };

    public static readonly primaryKey = (Class: any, columnName: string) => {
        Model.setColumnInfo(Class, columnName, { primaryKey: true });
    };

    public static readonly reference = <T extends TableType>(TableClass: T, column: keyof InstanceType<T>) => (Class: any, columnName: string) => {
        Model.setColumnInfo(Class, columnName, { foreignKey: [TableClass, column.toString()] });
    };

    public static async select<T extends Model, K extends "*" | keyof T | (keyof T)[] = "*">(this: TableClass<T>, what: K = "*" as any, where: Where<T>[] = [], options: SelectOptions<T> = {}): Promise<SelectResult<T, K>> {
        const whatString = Array.isArray(what) ? what.map(k => string.toSnakeCase(k.toString())).join(",") : (what as string);

        const whereValues: any[] = [];
        const whereString = where.map(w => Model.parseWhere(w, whereValues)).join(" OR ");

        let sql = `SELECT ${whatString} FROM ${this.tableName}`;

        if (whereString.length > 0)
            sql += ` WHERE ${whereString}`;

        if (options.order) {
            const [column, order] = options.order.split(" ");
            sql += ` ORDER BY ${string.toSnakeCase(column!)} ${order!}`;
        }

        if (options.limit)
            sql += ` LIMIT ${options.limit}`;

        const rows = await DB.get().query(sql, whereValues) as SelectResult<T, K>;

        return rows.map(row => {
            const newRow: any = {};
            for (const k in row)
                newRow[string.toCamelCase(k)] = row[k as keyof typeof row];
            return newRow;
        }) as SelectResult<T, K>;
    };

    public static async update<T extends Model>(this: TableClass<T>, what: Partial<T>, ...where: Where<T>[]): Promise<UpdateResult> {

        const whatString = Object.keys(what).map(k => `${string.toSnakeCase(k)} = ?`).join(", ");
        const values = [...Object.values(what), ...Object.values(where)];
        const whereValues: any[] = [];
        const whereString = where.map(w => Model.parseWhere(w, whereValues)).join(" OR ");

        let sql = `UPDATE ${this.tableName} SET ${whatString}`;

        if (whereString.length > 0)
            sql += ` WHERE ${whereString}`;

        return await DB.get().query(sql, values) as UpdateResult;
    };

    public static async insert<T extends Model>(this: TableClass<T>, ...what: Partial<T>[]): Promise<OkPacket> {
        if (what.length === 0)
            return null as any;

        const columns = Object.keys(what[0]!).map(string.toSnakeCase);
        const columnString = `(${columns.join(",")})`;
        const values: any[] = [];

        const rows: string[] = what.map(props => {
            const vals = Object.values(props);
            values.push(...vals);
            return `(${vals.map(_ => "?").join(",")})`;
        });

        const sql = `INSERT INTO ${this.tableName} ${columnString} VALUES ${rows.join(",")}`;

        return await DB.get().query(sql, values) as OkPacket;
    };

    public static async delete<T extends Model>(this: TableClass<T>, ...where: Where<T>[]): Promise<OkPacket> {
        if (Object.keys(where).length === 0)
            throw new Error("Cannot delete with an empty where clause!");

        const whereValues: any[] = [];
        const whereString = where.map(w => Model.parseWhere(w, whereValues)).join(" OR ");

        const sql = `DELETE FROM ${this.tableName} WHERE ${whereString}`;

        return await DB.get().query(sql, whereValues) as OkPacket;
    };

    private static readonly parseWhere = <T extends Model>(where: Where<T>, values: any[]) => {
        return Object.keys(where).map(k => {
            let str: string = "";
            const val = (where as any)[k];
            if (Array.isArray(val)) {
                values.push(val[1]);
                return `${string.toSnakeCase(k)} ${val[0]} ?`
            }
            else {
                values.push(val);
                return `${string.toSnakeCase(k)} = ?`
            }
            return str;
        }).join(" AND ");
    };
}


interface TableClass<T extends Model> {
    new(props: Partial<T>): T;
    readonly tableName: string;
};

type QueryResult =
    | OkPacket
    | ResultSetHeader
    | ResultSetHeader[]
    | RowDataPacket[]
    | RowDataPacket[][]
    | OkPacket[]
    | ProcedureCallPacket;

type SelectResult<T, K extends keyof T | (keyof T)[] | "*"> =
    K extends "*" ? T[] :
    K extends (keyof T)[] ? Pick<T, K[number]>[] :
    K extends keyof T ? Pick<T, K>[] :
    never;

type UpdateResult = {};

interface TableType {
    new(): Model;
    readonly tableName: string;
    readonly tableColumns: { [column: string]: ColumInfo };
}

type SelectOptions<T extends {}, K = keyof T> = {
    order?: SelectOrderType<T, K>;
    limit?: number;
};

type SelectOrderType<T extends {}, K = keyof T> = K extends string ? `${K} DESC` | `${K} ASC` : never;

type ForeignKey<T extends TableType> = [T, keyof InstanceType<T>];

type ColumInfo = {
    type: string;
    notNull?: boolean;
    autoIncrement?: boolean;
    primaryKey?: boolean;
    foreignKey?: ForeignKey<any>;
};

type ColumnType = "int" | "bool" | "bigint" | "float" | "double" | "date" | "time" | "timestamp" | "datetime" | "year" | SizedColumnType;
type SizedColumnType = `varchar(${number})` | `char(${number})` | `text(${number})`;

type Where<T extends Model> = {
    [K in keyof T]?: T[K] | [WhereOperator, T[K]];
};

type WhereOperator = "<" | ">" | "<=" | ">=" | "=" | "!=";
