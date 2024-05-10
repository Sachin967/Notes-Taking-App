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
exports.searchNotes = exports.deleteNote = exports.updateNote = exports.getNote = exports.createNote = exports.getAllNotes = void 0;
const database_1 = require("../services/database");
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query('SELECT * FROM notes');
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.getAllNotes = getAllNotes;
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { title, content } = req.body;
    try {
        const insertNotesQuery = `
      INSERT INTO notes (userid, title, content)
      VALUES ($1, $2, $3)
      RETURNING id`;
        const insertNotesValues = [userId, title, content];
        yield database_1.pool.query(insertNotesQuery, insertNotesValues);
        res.status(201).json({ message: 'Note created' });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.createNote = createNote;
const getNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const notesExistQuery = 'SELECT * FROM notes WHERE id = $1';
        const notesExistsResult = yield database_1.pool.query(notesExistQuery, [id]);
        if (notesExistsResult.rows.length === 0) {
            res.status(404).json({ message: `Note doesn't exist` });
        }
        else {
            res.status(200).json(notesExistsResult.rows[0]);
        }
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.getNote = getNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updateNoteQuery = `
      UPDATE notes
      SET title = $1, content = $2
      WHERE id = $3`;
        const updateNoteValues = [title, content, id];
        const result = yield database_1.pool.query(updateNoteQuery, updateNoteValues);
        if (result.rowCount === 0) {
            res.status(404).json({ message: `Note with id ${id} not found` });
        }
        else {
            res.status(200).json({ message: `Note with id ${id} updated successfully` });
        }
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteNoteQuery = `
      DELETE FROM notes
      WHERE id = $1`;
        const result = yield database_1.pool.query(deleteNoteQuery, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: `Note with id ${id} not found` });
        }
        else {
            res.status(200).json({ message: `Note with id ${id} deleted successfully` });
        }
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.deleteNote = deleteNote;
const searchNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const { query } = req.params;
        if (!query) {
            res.status(400).json({ error: 'Query parameter is missing' });
            return;
        }
        const searchQuery = `
            SELECT * 
            FROM notes 
            WHERE title ILIKE $1 OR content ILIKE $1`;
        const searchValue = [`%${query}%`];
        const searchResult = yield database_1.pool.query(searchQuery, searchValue);
        res.json(searchResult.rows);
    }
    catch (error) {
        console.error('Error searching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchNotes = searchNotes;
