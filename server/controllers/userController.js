const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const registerSchema = require("../helpers/registerValidations")


const handleRegisterUser = async (req, res) => {
    try {
        // Validate Input
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { fullName, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const handleLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentails" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentails" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        // Update user document with new token
        user.token = token;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const handleGetAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password field

        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: "Please provide an email" });

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User with this email does not exist" });

        // Generate Reset Token (Valid for 1 Hour)
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Create reset link
        const resetLink = `http://localhost:5000/reset-password/${token}`;

        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        // Email Content
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: `
            <h2>Password Reset Request</h2>
            <p>Hello ${user.fullName},</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br/>Your Team</p>
          `,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
}

const handleResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body

        if (!password) return res.status(500).send({ msg: "Please provide pasword" })

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ email: decode.email })

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashNewPassword = await bcrypt.hash(password, salt);

        user.password = hashNewPassword;
        await user.save()

        res.status(200).json({ msg: "Password reset successfully" });

    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" });
    }
}

module.exports = { handleRegisterUser, handleLoginUser, handleGetAllUsers, handleForgotPassword, handleResetPassword }