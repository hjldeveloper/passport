const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const User = require('./models/users.modle');
const passport = require('passport');
const app = express();

app.use(passport.initialize);
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // frontend에서 backend로 전달하는 데이터를 받기 위해 필요

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose
  .connect(
    `mongodb+srv://hjlim:qwer1234@express-cluster.kl8uz8p.mongodb.net/?retryWrites=true&w=majority&appName=express-cluster`
  )
  .then(() => {
    console.log('mongodb connected');
  })
  .catch(err => {
    console.log(`[ERROR]:${err}`);
  });

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // passport.js에서 done return 시 실행
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ msg: info });
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

app.post('/signup', async (req, res) => {
  // user 객체 생성
  const user = new User(req.body);
  try {
    // user collection에 유저 저장
    await user.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
