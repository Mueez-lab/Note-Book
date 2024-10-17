import React, { useContext, useState } from 'react'
import noteContent from '../context/Notes/NotesContext'

export default function AddNote() {
  const context = useContext(noteContent);
  const {addNote} = context;
  const [note,setNote] = useState({title:"",description:"",tag:""})

  const handleClick = (e)=>{
    e.preventDefault(); // to avoid page reload
    addNote(note.title,note.description,note.tag)
    setNote({title:"",description:"",tag:""})
  }

  const onchange=(e)=>{
    setNote({...note,[e.target.name]: e.target.value}) // spread operation ...  means that the value in it will remain same but the rest of the properties will be added or changed
  }

  return (
    <div className='container my-3'>
      <h1>Add Notes</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title"value={note.title}  name='title' minLength={3}  required onChange={onchange}/>
            </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description"name='description' value={note.description} minLength={5} required onChange={onchange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="tag"name='tag' value={note.tag} onChange={onchange}/>
        </div>
        <button type="submit" disabled={note.title.length<3 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Submit</button>
      </form>
    </div>
  )
}
