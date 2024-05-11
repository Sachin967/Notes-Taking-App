import React, { useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import { useDisclosure } from '@chakra-ui/react'
import AddEditNotesModal from '../components/AddEditNotesModal'
import { notes } from '../axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import EmptyCard from '../components/EmptyCard'
import img from '../assets/nocard.svg'

interface Note {
     id: number
     title: string
     content: string
     createdat: string // Assuming createdat is a string representing date
}

const Home: React.FC = () => {
     const { isOpen, onOpen, onClose } = useDisclosure()
     const [allNotes, setAllNotes] = useState<Note[]>([])
     const [editAddModal, setEditAddModal] = useState<{ type: 'add' | 'edit'; data: any | null }>({
          type: 'add',
          data: null,
     })

     const handleEdit = (noteDetails: Note) => {
          onOpen()
          setEditAddModal({ data: noteDetails, type: 'edit' })
     }

     const handleDelete = async (data: Note) => {
          const id = data.id
          try {
               const response = await notes.delete(`/${id}`)
               if (response.data) {
                    getAllNotes()
                    onClose()
                    toast.success('Note deleted successfully')
               }
          } catch (error: any) {
               console.error(error.message) // Changed to console.error for error messages
               toast.error(error.message)
          }
     }

     const onSearch=async(query:string)=>{
          try {
               const response = await notes.get(`/search-notes/${query}`)
               if(response.data){
                    setAllNotes(response.data)
               }
          } catch (error) {
               console.log(error)
          }
     }

     const getAllNotes = async () => {
          try {
               const response = await notes.get('/')
               if (response.data) {
                    setAllNotes(response.data)
               }
          } catch (error: any) {
               console.error(error.message) // Changed to console.error for error messages
               toast.error(error.message)
          }
     }

     useEffect(() => {
          getAllNotes()
     }, [])

     return (
          <>
               <Navbar onSearch={onSearch} />
               <div className="container mx-auto">
                    {allNotes.length > 0 ? (
                         <div className="grid grid-cols-3 gap-4 mt-8">
                              {allNotes.map((item) => (
                                   <NoteCard
                                        key={item.id}
                                        title={item.title}
                                        content={item.content}
                                        date={moment(item.createdat).format('Do MMM YYYY')}
                                        onDelete={() => {
                                             handleDelete(item)
                                        }}
                                        onEdit={() => {
                                             handleEdit(item)
                                        }}
                                   />
                              ))}
                         </div>
                    ) : (
                         <EmptyCard
                              img={img}
                              message={'Start creating your first note by clicking the Create button below'}
                         />
                    )}
               </div>
               <button
                    style={{ bottom: allNotes.length > 0 ? '-460px' : '-250px' }}
                    className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10"
                    onClick={() => {
                         onOpen()
                         setEditAddModal({ type: 'add', data: {} })
                    }}
               >
                    <MdAdd className="text-[32px] text-white" />
               </button>
               <AddEditNotesModal
                    type={editAddModal.type}
                    noteData={editAddModal.data}
                    isOpen={isOpen}
                    onClose={onClose}
                    getAllNotes={getAllNotes}
               />
          </>
     )
}

export default Home
