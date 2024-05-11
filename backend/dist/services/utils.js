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
exports.sendOTP = exports.verifyToken = exports.validatePassword = exports.generatePassword = exports.generateSalt = exports.generateOTP = exports.generateToken = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./database");
// export const sendOTP = (email: string, otp: string): Promise<string> => {
//      return new Promise((resolve, reject) => {
//           let transporter = nodemailer.createTransport({
//                service: 'gmail',
//                auth: {
//                     user: process.env.GMAIL as string,
//                     pass: process.env.PASS as string,
//                },
//           })
//           let mailOptions = {
//                from: 'your-email@gmail.com',
//                to: email,
//                subject: 'Your OTP for Verification',
//                text: `Your OTP is: ${otp}`,
//           }
//           transporter.sendMail(mailOptions, (error, info) => {
//                if (error) {
//                     console.log(error.message)
//                     reject(error.message)
//                } else {
//                     console.log('Email sent: ' + info.response)
//                     resolve(info.response)
//                }
//           })
//      })
// }
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
const verifyToken = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQuery = 'SELECT verify_token, expiry_timestamp FROM users WHERE id = $1';
        const { rows } = yield database_1.pool.query(userQuery, [id]);
        if (rows.length === 0 || !rows[0].verify_token) {
            return false;
        }
        const storedToken = rows[0].verify_token;
        const expirationTimestamp = rows[0].expiry_timestamp;
        if (token !== storedToken) {
            return false;
        }
        const currentTime = new Date();
        if (currentTime > expirationTimestamp) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
});
exports.verifyToken = verifyToken;
const sendOTP = (email, token, userId) => {
    console.log('token', token);
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
            subject: '[YOLO] Verify Your Email Address',
            text: `Dear User,

          Thank you for signing up with YOLO. To complete your registration and verify your email address, please click the link below:

          https://note.sachinms.fyi/verifyemail/${token}/${userId}

          This link will expire in 24 hours.

          If you did not create an account on YOLO, please ignore this email.

          Best Regards,
          Sachin M S`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message);
                reject(error);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            }
        });
    });
};
exports.sendOTP = sendOTP;
