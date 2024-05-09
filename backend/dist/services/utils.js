"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.generatePassword = exports.generateSalt = exports.generateOTP = exports.generateToken = exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendOTP = (email, otp) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASS,
            },
        });
        let mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP is: ${otp}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message);
                reject(error.message);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            }
        });
    });
};
exports.sendOTP = sendOTP;
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};
exports.generateToken = generateToken;
const generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.generateOTP = generateOTP;
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const generatePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.generatePassword = generatePassword;
const validatePassword = (enteredPassword, salt, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedEnteredPassword = yield bcryptjs_1.default.hash(enteredPassword, salt);
    return hashedEnteredPassword === savedPassword;
});
exports.validatePassword = validatePassword;
