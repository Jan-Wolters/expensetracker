import { Model } from "../db";

@Model.register("users")
export class User extends Model {

    @Model.type("int")
    @Model.autoIncrement
    @Model.primaryKey
    declare public readonly id: number;

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly username: string;

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly password: string;
}

