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

/*
    GET /tasks?completed=true
    GET /tasks?limit=1&skip=1
    GET /tasks?sortBy=createdAt:desc
*/
router.get('/tasks', auth, async (req, res) => {
    try {
        const queryObj = {};
        const projectionObj = {};
        const optionnObj = {};

        // Required query params
        queryObj.owner = req.user._id;

        // Oplional query params
        if (req.query.completed) {
            queryObj.completed = req.query.completed === 'true' ? true : false;
        }
        if (req.query.limit) {
            optionnObj.limit = parseInt(req.query.limit);
        }
        if (req.query.skip) {
            optionnObj.skip = parseInt(req.query.skip);
        }
        if (req.query.sortBy) {
            const arrSort = [];
            const tempSort = req.query.sortBy.split(',');
            tempSort.forEach(elem => {
                const sortParts = elem.split(':');
                arrSort.push({ [sortParts[0]]: sortParts[1] === 'asc'? 1 : -1 });
            });
            optionnObj.sort = arrSort;
        }

        const tasks = await Task.find(queryObj, projectionObj, optionnObj);
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