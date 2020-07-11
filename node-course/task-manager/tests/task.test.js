const request = require('supertest');
const app = require('../src/app');
const { userOne, userOneId, taskThree, setupDatabase } = require('./fixtures/db');
const Task = require('../src/models/task');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Run all the tests'
        })
        .expect(201);
    const task = await Task.findById(response.body._id);

    // Assert task is not null
    expect(task).not.toBeNull();

    // Assert task is not completed
    expect(task.completed).toEqual(false);
});

test('Shoud fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert count of returned tasks
    expect(response.body.length).toEqual(2);
});

test(`Should not delete other user's tasks`, async () => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404);
    const task = await Task.findById(taskThree._id);

    // Assert task is not null
    expect(task).not.toBeNull();
})