import request from "supertest"
import { v4 as uuidv4 } from "uuid"
import app from "../index"
import { SignIn as Login } from "./_helpers"

let TEST_NAME = uuidv4(),
    TEST_NAME_UPDATE = uuidv4(),
    TEST_EMAIL = uuidv4() + '@gmail.com',
    TEST_PASSWORD = "password",
    TEST_PHONE = "123456789",
    TEST_PHONE_UPDATE = "987654321"

let ACCESS_TOKEN: String, REFRESH_TOKEN: String,
    ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME

jest.setTimeout(60000)

// Creating a brand new user
describe('POST /signup', () => {
    it('SIGNUP : Creating a new user - 201', (done) => {
        request(app)
            .post('/signup')
            .send({ 'email': TEST_EMAIL, 'password': TEST_PASSWORD, 'name': TEST_NAME, 'phone': TEST_PHONE })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201, done)
    });
    it('SIGNUP : Email Already Exists - 409', (done) => {
        request(app)
            .post('/signup')
            .send({ 'email': TEST_EMAIL, 'password': TEST_PASSWORD, 'name': TEST_NAME, 'phone': TEST_PHONE })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
    // Missing email
    it('Signup - Missing Fields : email - 422', (done) => {
        request(app)
            .post('/signup')
            .send({ 'password': TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    // Missing password
    it('SIGNUP : Missing Fields : password - 422', (done) => {
        request(app)
            .post('/signup')
            .send({ 'email': TEST_EMAIL })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    // Missing email and password
    it('SIGNUP : Missing Fields : email,password - 422', (done) => {
        request(app)
            .post('/signup')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});

// Login in user
describe('POST /login', () => {
    // Valid Login
    it('SIGNIN : Login in the user - 200', (done) => {
        request(app)
            .post('/signin')
            .send({ 'email': TEST_EMAIL, 'password': TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });
    // Missing email
    it('SIGNIN : Missing Fields : email - 422', (done) => {
        request(app)
            .post('/signin')
            .send({ 'password': TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    });

    // Missing password
    it('SIGNIN : Missing Fields : password - 422', (done) => {
        request(app)
            .post('/signin')
            .send({ 'email': TEST_EMAIL })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    });
    // Missing email and password
    it('SIGNIN : Missing Fields : email, password - 422', (done) => {
        request(app)
            .post('/signin')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    });
    // Wrong Email
    it('SIGNIN : Wrong Fields : email - 401', (done) => {
        request(app)
            .post('/signin')
            .send({ 'email': "dumby" + TEST_EMAIL, 'password': TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });
    //  Wrong password
    it('SIGNIN : Wrong Fields : password - 401 ', (done) => {
        request(app)
            .post('/signin')
            .send({ 'email': TEST_EMAIL, 'password': "dumby" + TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });
    //  Wrong email and password
    it('SIGNIN : Wrong Fields : email, password - 401 ', (done) => {
        request(app)
            .post('/signin')
            .send({ 'email': "dumby" + TEST_EMAIL, 'password': "dumby" + TEST_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    });
})

describe('GET /me', () => {
    it('SIGNIN : Login the user and store the tokens - 200', async () => {
        let login = await Login(request, app, {
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })
        ACCESS_TOKEN = login.body.data.accessToken
        REFRESH_TOKEN = login.body.data.refreshToken
    })

    it('FETCH : User Details Without Auth Tokens - 401', (done) => {
        request(app)
            .get('/me')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

    it('FETCH : User Details With Auth Tokens - 200', (done) => {
        request(app)
            .get('/me')
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.data.email).toEqual(TEST_EMAIL)
            })
        return done()
    })
})

describe('POST /profile', () => {
    it('UPDATE : User Profile Without Auth Tokens - 401', (done) => {
        request(app)
            .post('/profile')
            .send({ "name": TEST_NAME_UPDATE, "phone": TEST_PHONE_UPDATE })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

    it('UPDATE : User Profile With Auth Tokens - 200', (done) => {
        request(app)
            .post('/profile')
            .send({ "name": TEST_NAME_UPDATE, "phone": TEST_PHONE_UPDATE })
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.data.name).toEqual(TEST_NAME_UPDATE)
                expect(res.body.data.phone).toEqual(TEST_PHONE_UPDATE)
            })
        return done()
    })

    it('UPDATE : User Profile - Missing Fields : name - 422', (done) => {
        request(app)
            .post('/profile')
            .send({ "phone": TEST_PHONE_UPDATE })
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    })

    it('UPDATE : User Profile - Missing Fields : phone - 422', (done) => {
        request(app)
            .post('/profile')
            .send({ "name": TEST_NAME_UPDATE })
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    })

    it('UPDATE : User Profile - Missing Fields : name, phone - 422', (done) => {
        request(app)
            .post('/profile')
            .send({ "name": TEST_NAME_UPDATE })
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done)
    })
})

describe('POST /signout', () => {
    it('SIGNOUT : Signout Without Auth Tokens - 401', (done) => {
        request(app)
            .post('/signout')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

    it('SIGNOUT : Signout With Auth Tokens - 200', (done) => {
        request(app)
            .post('/signout')
            .set('Cookie', [ACCESS_TOKEN_NAME + "=" + ACCESS_TOKEN])
            .set('Cookie', [REFRESH_TOKEN_NAME + "=" + REFRESH_TOKEN])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
})



