const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./routes/user-router')
const session = require('express-session');
const server = express();

const sessionConfig = {
  name: 'ladygaga',
  secret: 'make it a little long and keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 60, // you need it if the cookie is to survive !!
    secure: false, // with secure, the cookie only gets set when https !!
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.use('/api/', userRouter);



// function restricted(req, res, next) {
//   const { username, password } = req.headers;

//   Users.findBy({ username: username }).first()
//     .then(user => {
//       if(user && bcrypt.compareSync(password, user.password)){
//         next();
//       } else {
//         res.status(401).json({ message: 'invalid credentials ' })
//       }
//     }).catch(err => {
//       res.status(401).json({ message: err.message })
//     })
// }


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
