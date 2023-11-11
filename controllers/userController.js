const { count } = require('console');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');

const registerLoad = (req, res) => {
    res.render("register")
}

const register = async (req, res) => {
    const hashKey = "luciferTheProtector"

    const password = await bcrypt.hash(req.body.password, 10);

    const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        image: 'images/' + req.file.filename,
        password: password
    })

    await userObj.save();

    res.render('register', { message: "Form Submitted Succesfully" });
}

const loginLoad = (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
        const match = await bcrypt.compare(password, userData.password);
        //console.log(match + " " + userData);
        if (match) {
            req.session.userData = userData;
            res.redirect('/dashBoard')
        } else {
            res.render('login', { message: "Incorrect Credentials" });
        }
    } else {
        res.render('login', { message: "Incorrect Credentials" });
    }
}

const logOut = (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/logIn');
    });


}

const loadDashboard = async (req, res) => {
    if (req.session.userData) {
        const data = await User.find({
            _id: { $ne: req.session.userData._id }
        });
        //console.log(data);

        res.render('dashboard', { message: req.session.userData.name, users: data, sender: req.session.userData._id })

    }
}


const chatUploader = async (req, res) => {
    try {
        //console.log(req.body);
        const newChat = new Chat({
            sender_id: req.body.userID,
            receiver_id: req.body.receiverId,
            message: `${req.body.message}`
        });

        await newChat.save()
        console.log("The event in usercontroller.js chatuploader section got fired to save the chat havin data : \n" + newChat);
    }
    catch (e) {
        console.log("Error " + e);
    }
}



module.exports = { registerLoad, register, loginLoad, login, logOut, loadDashboard, chatUploader };