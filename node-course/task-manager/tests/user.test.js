const request = require('supertest');
const app = require('../src/app');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');
const User = require('../src/models/user');

/*
  Before running each test case
    1. Wipe out users before running the 'Should signup a new user' test
    2. Create a dummy user to test features like 
*/
beforeEach(setupDatabase);

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
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert token
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'fakepwd@1234'
        })
        .expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
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
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert empty user collection
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert image buffer
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Test User 2'
        })
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert modified user fields are
    expect(user.name).toBe('Test User 2');
});

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Edison'
        })
        .expect(400);
});