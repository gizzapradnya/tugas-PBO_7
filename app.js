const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

// sett EJS sebagai template engine
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// middleware to check login status
app.use((req, res, next) => {
    if (!req.session.user && req.path  !== '/auth/login' && req.path !== '/auth/register') {
        // if the user is not logged in and trying to acces any other page except login/register
        return res.redirect('/auth/login');
    } else if (req.session.user && req.path === '/') {
        // if user is loged in and tries to acces the root route, redirect to profile
        return res.redirect('/auth/profile');                   
    }
    next();
});

// routes
app.use('/auth', authRoutes);

// Root Route: Redirect to /auth/login or /auth/profile based on session 
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/auth/profile');
        } else {
            return res.redirect('/auth/login');
        }
    });

// Menjalankan server
app.listen (3000, () => {
    console.log('server running on port 3000');
});
