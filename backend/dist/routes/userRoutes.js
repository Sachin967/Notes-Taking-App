"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
userRouter.post('/register', userController_1.registerUser);
userRouter.post('/login', userController_1.authUser);
userRouter.post('/verify', userController_1.VerifyOtp);
userRouter.post('/signout', userController_1.logOut);
userRouter.post('/resendotp', userController_1.resendOtp);
exports.default = userRouter;
