const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const restricted = require('../middlewares/session-checker');
const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 11);
  const newUser = {
    username: req.body.username,
    password: hash
  }

  Users.add(newUser)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user &&  bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You Shall Not Pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json('you can not leave, actually')
      } else {
        res.json('goodbye, sad to see you go')
      }
    })
  } else {
    res.end();
  }
})

module.exports = router;