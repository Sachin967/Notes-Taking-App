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
exports.logOut = exports.authUser = exports.verifyTokenExpirationAndUpdateUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
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
        const token = crypto_1.default.randomBytes(20).toString('hex');
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);
        const insertUserQuery = `
            INSERT INTO users (name, email, password, otp, salt,verify_token,expiry_timestamp)
            VALUES ($1, $2, $3, $4, $5,$6,$7)
            RETURNING id`;
        const insertUserValues = [name, email, userPassword, otp, salt, token, expirationTime];
        const userResult = yield database_1.pool.query(insertUserQuery, insertUserValues);
        const userId = userResult.rows[0].id;
        const otpResponse = yield (0, utils_1.sendOTP)(email, token, userId);
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
const verifyTokenExpirationAndUpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    try {
        const tokenNotExpired = yield (0, utils_1.verifyToken)(id, token);
        if (!tokenNotExpired) {
            res.status(400).json({ status: false, message: 'Token is expired' });
            return;
        }
        const fetchUserQuery = 'SELECT * FROM users WHERE id = $1';
        const fetchUserValues = [id];
        const fetchUserResult = yield database_1.pool.query(fetchUserQuery, fetchUserValues);
        const user = fetchUserResult.rows[0];
        if (!user) {
            res.status(404).json({ status: false, message: 'User not found' });
            return;
        }
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
            verified: updatedUser.verified,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.verifyTokenExpirationAndUpdateUser = verifyTokenExpirationAndUpdateUser;
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
