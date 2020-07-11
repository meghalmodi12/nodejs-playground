const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Test User',
    email: 'test.user@app.com',
    password: 'welcome123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_PRIVATE_KEY)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Test User 2',
    email: 'test.user.2@app.com',
    password: 'TestPwd456',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_PRIVATE_KEY)
    }]
};

const taskOne = {
    _id:  new mongoose.Types.ObjectId(),
    description: 'Test task one',
    completed: false,
    owner: userOneId
};

const taskTwo = {
    _id:  new mongoose.Types.ObjectId(),
    description: 'Test task two',
    completed: true,
    owner: userOneId
};

const taskThree = {
    _id:  new mongoose.Types.ObjectId(),
    description: 'Test task three',
    completed: false,
    owner: userTwoId
};

const setupDatabase = async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
};