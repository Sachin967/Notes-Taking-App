"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("dotenv/config");
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use('/users', userRoutes_1.default);
app.use('/notes', notesRoutes_1.default);
app.listen(port, () => {
    console.log(process.env);
    console.log(`server is running on ${port}`);
});
