"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notesController_1 = require("../controllers/notesController");
const notesRouter = express_1.default.Router();
notesRouter.get('/', notesController_1.getAllNotes);
notesRouter.get('/:id', notesController_1.getNote);
notesRouter.post('/', notesController_1.createNote);
notesRouter.put('/:id', notesController_1.updateNote);
notesRouter.delete('/:id', notesController_1.deleteNote);
notesRouter.get('/search-notes/:query', notesController_1.searchNotes);
exports.default = notesRouter;
