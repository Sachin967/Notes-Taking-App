import express, { Router } from 'express'
import { createNote, deleteNote, getAllNotes, getNote, searchNotes, updateNote } from '../controllers/notesController'

const notesRouter: Router = express.Router()


notesRouter.get('/',getAllNotes)
notesRouter.get('/:id',getNote)
notesRouter.post('/',createNote)
notesRouter.put('/:id',updateNote)
notesRouter.delete('/:id',deleteNote)
notesRouter.get('/search-notes/:query',searchNotes)

export default notesRouter