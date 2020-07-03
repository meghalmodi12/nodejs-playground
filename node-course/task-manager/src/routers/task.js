const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const query = {
            owner: req.user._id
        };
        const options = {};

        if (req.query.completed) {
            query.completed = req.query.completed === 'true' ? true : false;
        }
        if (req.query.limit) {
            options.limit = parseInt(req.query.limit);
        }
        if (req.query.skip) {
            options.skip = parseInt(req.query.skip);
        }

        const tasks = await Task.find(query, null, options);
        if (!tasks) {
            return res.status(404).send();
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(key => allowedUpdates.indexOf(key) !== -1);

    if (!isValid) {
        return res.status(400).send({error: "Invalid Operation"});
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id }) ;
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

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id});
        if (!task) {
            return res.status(404).send({message: "Task Not Found!!"});
        } 
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;