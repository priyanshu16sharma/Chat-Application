const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const user_route = express();

user_route.use(session({ secret: 'LucifersSecret' }))

// user_route.use('body-parser');

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

const userController = require('../controllers/userController');
const { isLoggedIn, isLoggedOut } = require('../auth/auth');

user_route.get('/register', isLoggedOut, userController.registerLoad);
user_route.post('/register', upload.single('image'), userController.register);
user_route.get('/logIn', isLoggedOut, userController.loginLoad);
user_route.post('/logIn', userController.login);
user_route.get('/logOut', isLoggedIn, userController.logOut);
user_route.get('/dashBoard', isLoggedIn, userController.loadDashboard);
user_route.post('/upload-chat', userController.chatUploader);

module.exports = user_route;