import React, { useState } from "react";
import noteContent from "./NotesContext";

const NoteState = (props) => {
    const host ='http://localhost:5000'
    let [notes, setNotes] = useState([])
    // Fetch API
    const fetchNotes = async () => {
        try {
          const response = await fetch(`${host}/notes/`, {
            method: 'GET',
            headers: {
              'auth_token': localStorage.getItem('token')
            }
          });
          const json = await response.json();
          setNotes(json);  // 
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };
        
    const addNote = async (title, description, tag) => {
        // eslint-disable-next-line
        const response = await fetch(`${host}/notes/createNotes`,{
            method: 'POST',
            headers: {
                'Content-Type' : "application/json",
                'auth_token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });
        const note = await response.json()
        setNotes(notes.concat(note));

    }
    //Delete Note
    const deleteNote = async (id) => {
        // eslint-disable-next-line
        const response = await fetch(`${host}/notes/deletenote/${id}`,{
            method: 'Delete',
            headers: {
                'Content-Type' : "application/json",
                'auth_token': localStorage.getItem('token')
            },
        });

        // We are doing this because we don't want to reload the whole website to get the updated form of data from the database in which that object is not present 
        const newNotes = notes.filter((note) => { return note._id !== id }) //filter method creates a new array with all elements that pass the test implemented by the provided function.
        // The filter method returns a new array newNotes that contains all the notes for which the callback function returned true. In other words, it includes all notes except the one with the _id equal to the id provided.
        setNotes(newNotes)
    }
    //Upadte Note
    const editNote = async (id, title, description, tag) => {
        try {
            // eslint-disable-next-line
            const response = await fetch(`${host}/notes/updatenotes/${id}`, {
                method: 'PUT', // Ensure this matches the correct method for your backend
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
            fetchNotes();
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    
    return (
        <noteContent.Provider value={{ notes, deleteNote, addNote, editNote,fetchNotes }}>
            {props.children}
        </noteContent.Provider>
    )
}

export default NoteState;