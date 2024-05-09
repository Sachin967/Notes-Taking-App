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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.authUser = exports.VerifyOtp = exports.registerUser = void 0;
const database_1 = require("../services/database");
const utils_1 = require("../services/utils");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const salt = yield (0, utils_1.generateSalt)();
        const userPassword = yield (0, utils_1.generatePassword)(password, salt);
        const otp = (0, utils_1.generateOTP)();
        const emailExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const emailExistsResult = yield database_1.pool.query(emailExistsQuery, [email]);
        if (emailExistsResult.rows.length > 0) {
            res.status(400);
            throw new Error('User already exists');
        }
        const insertUserQuery = `
            INSERT INTO users (name, email, password, otp, salt)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`;
        const insertUserValues = [name, email, userPassword, otp, salt];
        const userResult = yield database_1.pool.query(insertUserQuery, insertUserValues);
        const userId = userResult.rows[0].id;
        const otpResponse = yield (0, utils_1.sendOTP)(email, otp);
        yield (0, utils_1.generateToken)(res, userId);
        const response = {
            Id: userId,
            otpResponse: otpResponse,
        };
        res.json(response);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.registerUser = registerUser;
const VerifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, id } = req.body;
    try {
        const fetchUserQuery = 'SELECT * FROM users WHERE id = $1';
        const fetchUserValues = [id];
        const fetchUserResult = yield database_1.pool.query(fetchUserQuery, fetchUserValues);
        const user = fetchUserResult.rows[0];
        if (!user) {
            res.status(404).json({ status: false, message: 'User not found' });
            return;
        }
        if (otp === user.otp) {
            const updateQuery = 'UPDATE users SET verified = $1 WHERE id = $2 RETURNING *';
            const updateValues = [true, id];
            const updateResult = yield database_1.pool.query(updateQuery, updateValues);
            const updatedUser = updateResult.rows[0];
            if (!updatedUser) {
                res.status(500).json({ status: false, message: 'Failed to update user' });
                return;
            }
            res.json({
                name: updatedUser.name,
                email: updatedUser.email,
            });
        }
        else {
            res.status(400).json({ status: false, message: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.VerifyOtp = VerifyOtp;
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const fetchUserQuery = 'SELECT * FROM users WHERE email = $1';
        const fetchUserValues = [email];
        const fetchUserResult = yield database_1.pool.query(fetchUserQuery, fetchUserValues);
        const user = fetchUserResult.rows[0];
        if (!user) {
            res.status(401).json('Invalid email or password');
            return;
        }
        if (!user.verified) {
            res.status(403).json('You are not verified');
            return;
        }
        const validPassword = yield (0, utils_1.validatePassword)(password, user.salt, user.password);
        if (!validPassword) {
            res.status(401).json('Invalid email or password');
            return;
        }
        yield (0, utils_1.generateToken)(res, user.id);
        res.json({
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.authUser = authUser;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ status: true, message: 'Logged out' });
        return;
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
});
exports.logOut = logOut;
