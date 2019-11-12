const express = require('express');
const server = require('express').Router();
const bcrypt = require('bcryptjs');
const restricted = require('../middlewares/session-checker');
const db = require('../data/dbConfig');
const Users = require('../users/users-model.js');

server.post('/register', (req, res) => {
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

server.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user &&  bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = server;