import { Request, Response } from 'express'
import { pool } from '../services/database'
import { CustomRequest } from '../services/middleware'

const getAllNotes = async (req: CustomRequest, res: Response): Promise<void> => {
     try {
          const { id } = req.user
          const result = await pool.query('SELECT * FROM notes WHERE userid = $1', [id])
          res.status(200).json(result.rows)
     } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
     }
}

const createNote = async (req: CustomRequest, res: Response): Promise<void> => {
     const { id } = req.user
     const { title, content } = req.body
     try {
          const insertNotesQuery = `
      INSERT INTO notes (userid, title, content)
      VALUES ($1, $2, $3)
      RETURNING id`
          const insertNotesValues = [id, title, content]
          await pool.query(insertNotesQuery, insertNotesValues)
          res.status(201).json({ message: 'Note created' })
     } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
     }
}

const getNote = async (req: Request, res: Response): Promise<void> => {
     const { id } = req.params
     try {
          const notesExistQuery = 'SELECT * FROM notes WHERE id = $1'
          const notesExistsResult = await pool.query(notesExistQuery, [id])
          if (notesExistsResult.rows.length === 0) {
               res.status(404).json({ message: `Note doesn't exist` })
          } else {
               res.status(200).json(notesExistsResult.rows[0])
          }
     } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
     }
}

const updateNote = async (req: Request, res: Response): Promise<void> => {
     const { id } = req.params
     const { title, content } = req.body
     try {
          const updateNoteQuery = `
      UPDATE notes
      SET title = $1, content = $2
      WHERE id = $3`
          const updateNoteValues = [title, content, id]
          const result = await pool.query(updateNoteQuery, updateNoteValues)
          if (result.rowCount === 0) {
               res.status(404).json({ message: `Note not found` })
          } else {
               res.status(200).json({ message: `Note updated successfully` })
          }
     } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
     }
}

const deleteNote = async (req: Request, res: Response): Promise<void> => {
     const { id } = req.params
     try {
          const deleteNoteQuery = `
      DELETE FROM notes
      WHERE id = $1`
          const result = await pool.query(deleteNoteQuery, [id])
          if (result.rowCount === 0) {
               res.status(404).json({ message: `Note not found` })
          } else {
               res.status(200).json({ message: `Note deleted successfully` })
          }
     } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
     }
}

const searchNotes = async (req: Request, res: Response): Promise<void> => {
     try {
          const { query } = req.params
          if (!query) {
               res.status(400).json({ error: 'Query parameter is missing' })
               return
          }

          const searchQuery = `
            SELECT * 
            FROM notes 
            WHERE title ILIKE $1 OR content ILIKE $1`
          const searchValue = [`%${query}%`]
          const searchResult = await pool.query(searchQuery, searchValue)

          res.json(searchResult.rows)
     } catch (error) {
          console.error('Error searching notes:', error)
          res.status(500).json({ error: 'Internal server error' })
     }
}

export { getAllNotes, createNote, getNote, updateNote, deleteNote, searchNotes }
