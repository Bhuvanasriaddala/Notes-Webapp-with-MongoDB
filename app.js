const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/notesapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/signin');
  }
}

const User = require('./models/user');
const Note = require('./models/notes');

app.get('/', (req, res) => {
  res.redirect('/signup');
});

app.get('/signup', (req, res) => {
  const message = req.session.message || '';
  req.session.message = null;
  res.render('signup', { message });
});

app.get('/signin', (req, res) => {
  const message = req.session.message || '';
  req.session.message = null;
  res.render('signin', { message });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.session.message = "All fields are required";
    return res.redirect('/signup');
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hash
  });

  req.session.message = "Signup successful, please signin";
  res.redirect('/signin');
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.session.message = "Invalid email or password";
    return res.redirect('/signin');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.session.message = "Invalid email or password";
    return res.redirect('/signin');
  }

  req.session.userId = user._id;
  req.session.userName = user.name;

  res.redirect('/index'); 
});

app.get('/index', isAuthenticated, async (req, res) => {
  const notes = await Note.find({ userId: req.session.userId }); 
  res.render('index', { notes, user: req.session.userName });
});

app.get('/read/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.session.userId }); 
    if (note) {
      res.render('display', { note });
    } else {
      res.status(404).send('Note not found');
    }
  } catch {
    res.status(500).send('Server error');
  }
});

app.get('/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.session.userId }); 
  if (!note) return res.status(404).send('Not authorized');
  res.render('edit', { note });
});

app.post('/update/:id', isAuthenticated, async (req, res) => {
  let { title, description } = req.body;
  await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    { title, description },
    { new: true }
  );
  res.redirect('/index');
});

app.get('/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.session.userId }); 
  res.redirect('/index');
});


app.post('/create', isAuthenticated, async (req, res) => {
  let { title, description } = req.body;
  await Note.create({
    title,
    description,
    userId: req.session.userId 
  });
  res.redirect('/index');
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/signin');
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});
