import request from "supertest"
import { v4 as uuidv4 } from "uuid"
import { SignUp as Register, SignIn as Login, RemoveKeysFromObject, ChangeKeyDataType, getBase64 } from "./_helpers"
import app from "../index"



let TEST_EMAIL = uuidv4() + '@gmail.com',
    TEST_PASSWORD = "password",
    TEST_VACCINE_UPDATE_ID: any,
    TEST_NAME = "Test Name",
    TEST_PHONE = "9876543456",

    TEST_VACCINE = {
        "name": "Test Vaccine Name",
        "description": "Test Vaccine Description",
        "image": getBase64(__dirname + '/assets/1.jpg'),
        "numberOfDoses": 10,
        "manufacturer": "Test Manufacturer",
        "developedYear": 2022,
        "ageGroup": "Test Group",
        "sideEffects": "Test Side Effect",
        "mandatory": [true, false][Math.floor(Math.random() * 2)]
    },
    TEST_VACCINE_UPDATE = {
        "name": "Test Vaccine Name Update",
        "description": "Test Vaccine Description Update",
        "image": getBase64(__dirname + '/assets/2.jpg'),
        "numberOfDoses": 15,
        "manufacturer": "Test Manufacturer Update",
        "developedYear": 2024,
        "ageGroup": "Test Group Update",
        "sideEffects": "Test Side Effect Update",
        "mandatory": [true, false][Math.floor(Math.random() * 2)]
    }

let ACCESS_TOKEN: String, REFRESH_TOKEN: String,
    ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME

jest.setTimeout(60000)

// Creating a brand new user
describe('POST /signup & POST /signin', () => {
    it('Signup - Creating a new user - 201', async () => {
        let data = {
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD,
            'name': TEST_NAME,
            'phone': TEST_PHONE
        }
        await Register(request, app, data)
        let login = await Login(request, app, data)

        ACCESS_TOKEN = login.body.data.accessToken
        REFRESH_TOKEN = login.body.data.refreshToken
    });
});

describe('GET /vaccine', () => {
    it('FETCH: All Vaccines Without Auth Tokens - 401', (done) => {
        request(app)
            .get('/vaccine')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });

    it('FETCH: All Vaccines With Auth Tokens - 200', (done) => {
        request(app)
            .get('/vaccine')
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(Array.isArray(res.body.data)).toBe(true)
            })
        return done()
    });
})

describe('POST /vaccine', () => {
    it('STORE: New Vaccine Without Auth Tokens - 401', (done) => {
        request(app)
            .post('/vaccine')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });

    it('STORE: New Vaccine With Auth Tokens - 200', async () => {
        let store = await request(app)
            .post('/vaccine')
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .send(TEST_VACCINE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)

        TEST_VACCINE_UPDATE_ID = store.body.data.id
    });

    ['name', 'description', 'image'].forEach(d => {
        it('STORE: New Vaccine - Field Missing : ' + d + ' - 422', (done) => {
            request(app)
                .post('/vaccine')
                .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
                .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
                .send(RemoveKeysFromObject(TEST_VACCINE, [d]))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422, done)
        })
    });

    ['numberOfDoses', 'manufacturer', 'developedYear',
        'ageGroup', 'sideEffects'].forEach(d => {
            it('STORE: New Vaccine - Field Missing : ' + d + ' - 200', (done) => {
                request(app)
                    .post('/vaccine')
                    .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
                    .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
                    .send(RemoveKeysFromObject(TEST_VACCINE, [d]))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200, done)
            })
        });

    let types =
        [{ name: 'number' },
        { description: 'number' },
        { image: 'number' },
        { numberOfDoses: 'string' },
        { manufacturer: 'number' },
        { developedYear: 'string' },
        { ageGroup: 'number' },
        ];

    types.forEach((d: any) => {

        let testData = ChangeKeyDataType(TEST_VACCINE, Object.keys(d)[0], d[Object.keys(d)[0]])

        it('STORE: New Vaccine - Wrong Type  : ' + Object.keys(d)[0] + " => " + d[Object.keys(d)[0]] + ' - 422', (done) => {
            request(app)
                .post('/vaccine')
                .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
                .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
                .send(testData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422, done)
        })
    });
})

describe('PUT /vaccine', () => {
    it('UPDATE: Existing Vaccine Without Auth Tokens - 401', (done) => {
        request(app)
            .put('/vaccine/' + TEST_VACCINE_UPDATE_ID)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });

    it('UPDATE: Existing Vaccine With Auth Tokens - 200', async () => {
        request(app)
            .put('/vaccine/' + TEST_VACCINE_UPDATE_ID)
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .send(TEST_VACCINE_UPDATE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    ['name', 'description'].forEach(d => {
        it('UPDATE: Existing Vaccine - Field Missing : ' + d + ' - 422', (done) => {
            request(app)
                .put('/vaccine/' + TEST_VACCINE_UPDATE_ID)
                .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
                .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
                .send(RemoveKeysFromObject(TEST_VACCINE_UPDATE, [d]))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422, done)
        })
    });


    ['image', 'numberOfDoses', 'manufacturer', 'developedYear',
        'ageGroup', 'sideEffects'].forEach(d => {
            it('UPDATE: Existing Vaccine - Field Missing : ' + d + ' - 200', async () => {
                request(app)
                    .put('/vaccine/' + TEST_VACCINE_UPDATE_ID)
                    .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
                    .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
                    .send(RemoveKeysFromObject(TEST_VACCINE_UPDATE, [d]))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
            })
        })
})

describe('DELETE /vaccine', () => {
    it('DELETE: Existing Vaccine Without Auth Tokens - 401', (done) => {
        request(app)
            .delete('/vaccine/' + TEST_VACCINE_UPDATE_ID)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });

    it('DELETE: Existing Vaccine With Auth Tokens - 200', async () => {
        request(app)
            .delete('/vaccine/' + TEST_VACCINE_UPDATE_ID)
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
})


