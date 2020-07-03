const multer = require('multer');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const user = req.user;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every(key => allowedUpdates.indexOf(key) !== -1);

    if (!isValid) {
        return res.status(400).send({error: "Invalid Operation"});
    }

    try {
        updates.forEach(key => user[key] = req.body[key]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (req, res) => {
   try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Multer configuration for avatar upload route
const uploadAvatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image.'))
        }
        callback(undefined, true);
    }
});

router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.status(200).send({ message: 'Avatar upload successfully' });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User profile not found' });
        }
        if (!user.avatar) {
            return res.status(404).send({ error: 'User avatar not found' });
        }
        res.set('Content-Type', 'image/png');
        res.status(200).send(user.avatar);
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    } 
});

module.exports = router;