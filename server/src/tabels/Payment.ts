import { Model } from "../db"
import { User } from "./User";

@Model.register("payment")
export class Payment extends Model {
    @Model.primaryKey
    @Model.autoIncrement
    @Model.notNull
    @Model.type("int")
    declare public readonly id: number

    @Model.reference(User, "id")
    declare public readonly userId: number;

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly name: string

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly amount: string

    @Model.notNull
    @Model.type("varchar(255)")
    declare public readonly type: string
}