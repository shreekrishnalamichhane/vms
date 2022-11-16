export type TypeUser = {
    name: String,
    email: String,
    password: String,
    phone: String
}

export type TypeSignup = {
    email: String,
    password: String
}
export type TypeSignin = {
    email: String,
    password: String
}

export type TypeRefreshtoken = {
    token: String,
    expire: Number,
    userId: Number
}
export type TypeJwtPayload = {
    id: Number,
    email: String
}