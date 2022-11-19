var fs = require('fs');

let SignIn = async (request: any, app: any, data: any) => {
    const login = await request(app)
        .post('/signin')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    return login
}

let SignUp = async (request: any, app: any, data: any) => {
    const register = await request(app)
        .post('/signup')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
    return register
}

let RemoveKeysFromObject = (data: any, fields: Array<string>) => {
    let newData = { ...data }
    fields.forEach((f: any) => {
        delete newData[f];
    })
    return newData;
}
let ChangeKeyDataType = (data: any, key: string, type: string) => {
    let newData = { ...data }
    if (type === 'string') {
        newData[key] = "123"
    } else if (type === 'number') {
        newData[key] = 123
    }
    return newData;
}

let getBase64 = (path: string) => {
    return 'data:image/jpg;base64,' + fs.readFileSync(path, 'base64');
}

export { SignIn, SignUp, RemoveKeysFromObject, ChangeKeyDataType, getBase64 }