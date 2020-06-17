const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        if (!tasks) {
            return res.status(404).send();
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const task = Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(key => allowedUpdates.indexOf(key) !== -1);

    if (!isValid) {
        return res.status(400).send({error: "Invalid Operation"});
    }

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(key => task[key] = req.body[key]);
        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send({message: "Task Not Found!!"});
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;