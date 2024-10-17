import React, { useContext } from 'react';
import NoteContext from '../context/Notes/NotesContext'; 

export default function NotesItem(props) {
  const context = useContext(NoteContext);
  const {deleteNote} = context;
  const {note,updateNote} = props
    
  return (
    <div>
        <h4>
        {note.title}
        </h4>
        <p>
        {note.description}
        </p>
        <p>
        {note.tag}
        </p>
        <button type='button' onClick={()=>{deleteNote(note._id)}}>Delete</button> &nbsp;
        <button type='submit' onClick={()=>{updateNote(note)}}>Update</button>
        <br/>
    </div>
  )
}
