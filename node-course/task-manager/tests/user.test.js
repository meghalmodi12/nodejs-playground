const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const User = require('../src/models/user');

const userTestId = new mongoose.Types.ObjectId();
const userTest = {
    _id: userTestId,
    name: 'Test User',
    email: 'test.user@app.com',
    password: 'welcome123',
    tokens: [{
        token: jwt.sign({ _id: userTestId }, process.env.JWT_PRIVATE_KEY)
    }]
};

/*
  Before running each test case
    1. Wipe out users before running the 'Should signup a new user' test
    2. Create a dummy user to test features like 
*/
beforeEach(async () => {
    await User.deleteMany({});
    await new User(userTest).save();
});

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Meghal Modi',
            email: 'meghalmodi12@gmail.com',
            password: 'Scorpio@990'
        })
        .expect(201);

    // Assert that user was added to the database correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Meghal Modi',
            email: 'meghalmodi12@gmail.com'
        },
        token: user.tokens[0].token
    });

    // Assert user password
    expect(user.password).not.toBe('Scorpio@990');
});

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userTest.email,
            password: userTest.password
        })
        .expect(200);
    const user = await User.findById(userTestId);

    // Assert token
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userTest.email,
            password: 'fakepwd@1234'
        })
        .expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userTestId);

    // Assert empty user collection
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});