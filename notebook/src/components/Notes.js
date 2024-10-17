import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/Notes/NotesContext';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import {useNavigate} from 'react-router-dom';

export default function Notes() {
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, fetchNotes, editNote } = context;
  const [note, setNote] = useState({ id: "", title: "", description: "", tag: "" });

  useEffect(() => {
    if(localStorage.getItem('token'))
    {
      console.log("Token is "+localStorage.getItem('token'));
      fetchNotes();
    }
    else{
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, title: currentNote.title, description: currentNote.description, tag: currentNote.tag });
  };

  const handleClick = (e) => {
    e.preventDefault(); // to avoid page reload
    console.log("Updating");
    editNote(note.id, note.title, note.description, note.tag);
    refClose.current.click();
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); // spread operation ... means that the value in it will remain same but the rest of the properties will be added or changed
  }

  return (
    <>
      <AddNote />
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={refClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="title" value={note.title} name='title' minLength={3}  onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="description" value={note.description} minLength={5} name='description' onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="tag" value={note.tag} name='tag' onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled={note.title.length<3 || note.description.length<5} className="btn btn-primary" onClick={handleClick} >Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <h2>Your Notes</h2>
      {notes.length === 0 && "No notes to display"}
      {notes.map((note) => {
        return <NotesItem key={note._id} updateNote={updateNote} note={note} />
      })}
    </>
  );
}
