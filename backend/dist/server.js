"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("dotenv/config");
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const middleware_1 = require("./services/middleware");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: ['https://note.sachinms.fyi', 'http://localhost:5173'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/users', userRoutes_1.default);
app.use('/notes', middleware_1.protect, notesRoutes_1.default);
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
