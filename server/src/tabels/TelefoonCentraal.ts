import { Model } from "../db";
import { User } from "./User";

@Model.register("telefooncentraal")
export class TelefoonCentraal extends Model {
    @Model.primaryKey
    @Model.autoIncrement
    @Model.type("int")
    declare public readonly id: number;

    @Model.reference(User, "id")
    declare public readonly companyId: number;

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly host: string;
}