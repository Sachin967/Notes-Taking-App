import React, { useEffect, useState } from 'react'
import {
     Button,
     FormControl,
     FormLabel,
     Input,
     Modal,
     ModalBody,
     ModalCloseButton,
     ModalContent,
     ModalFooter,
     ModalHeader,
     ModalOverlay,
     Textarea,
} from '@chakra-ui/react'
import { notes } from '../axios'
import { toast } from 'react-toastify'

interface Note {
     id: number
     title: string
     content: string
}

interface AddEditNotesModalProps {
     isOpen: boolean
     onClose: () => void
     noteData: Note | null
     type: 'add' | 'edit'
     getAllNotes: () => void
}

const AddEditNotesModal: React.FC<AddEditNotesModalProps> = ({ isOpen, onClose, getAllNotes, noteData, type }) => {
     const [title, setTitle] = useState('')
     const [content, setContent] = useState('')
     const [error, setError] = useState('')

     useEffect(() => {
          if (noteData) {
               setTitle(noteData.title || '')
               setContent(noteData.content || '')
          }
     }, [noteData])

     const handleAddNote = async () => {
          try {
               if (!title) {
                    throw new Error('Please enter the title')
               }
               if (!content) {
                    throw new Error('Please enter the content')
               }

               if (type === 'edit' && noteData) {
                    const response = await notes.put(`/${noteData.id}`, { title, content })
                    toast.success(response.data.message)
               } else {
                    const response = await notes.post('/', { title, content })
                    toast.success(response.data.message)
               }

               getAllNotes()
               onClose()
          } catch (error: any) {
               console.log(error)
               setError(error.message)
          }
     }

     return (
          <>
               <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>{type === 'edit' ? 'Edit Note' : 'Create Note'}</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody pb={6}>
                              <FormControl>
                                   <FormLabel>Title</FormLabel>
                                   <Input
                                        className="text-2xl text-slate-950 outline-none"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                   />
                              </FormControl>
                              <FormControl mt={4}>
                                   <FormLabel>Content</FormLabel>
                                   <Textarea
                                        className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded-md"
                                        rows={10}
                                        placeholder="Content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                   />
                              </FormControl>
                              {error && <p className="text-red-500 text-xs p-3">{error}</p>}
                         </ModalBody>
                         <ModalFooter>
                              <Button colorScheme="blue" mr={3} onClick={handleAddNote}>
                                   {type === 'edit' ? 'Save Changes' : 'Create Note'}
                              </Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default AddEditNotesModal
