
// Read exsisting note from localStorage
const getSavedNotes =  () => {
    const notesJSON = localStorage.getItem('notes')

    if(notesJSON !== null) {
        return JSON.parse(notesJSON)
    } else {
        return []
    }
}

// Save the notes to localStorage
const saveNotes = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes))
}


// remove note from the list
const removeNote = (id) => {
    const noteIndex = notes.findIndex( note => note.id === id )
    if(noteIndex > -1){
        notes.splice(noteIndex,1)
    }

}

// Generate the DOM structure for a note
const generateNoteDOM = (note) => {
    const noteEl = document.createElement('div')
    const textEl = document.createElement('a')
    const button = document.createElement('button')
    const dateEl = document.createElement('div')

    // setup notelist and remove button
    noteEl.classList.add('list-item')
    noteEl.classList.add('container')
    button.classList.add('list-item__button')
    button.textContent = 'x'
    textEl.classList.add('list-item__title')
    dateEl.classList.add('list-item__date')
    dateEl.textContent = generateLastEditedTop(note.updatedAt)

    button.addEventListener('click',() => {
        removeNote(note.id)
        saveNotes(notes)
        renderNotes(notes, filters)
    })

    // setup the note title text
    if(note.title.length > 0) {
        textEl.textContent = note.title
    } else {
        textEl.textContent = 'Unnamed note'
    }

    noteEl.appendChild(button)
    textEl.setAttribute('href',`edit.html#${note.id}`)
    noteEl.appendChild(textEl)
    // noteEl.appendChild(dateEl)

    return noteEl
}

// sort
const sortNotes = (notes, sortBy) => {
    if(sortBy === 'byEdited'){
        return notes.sort( (a, b) => {
            if(a.updatedAt > b.updatedAt){
                return -1
            } else if(a.updatedAt < b.updatedAt){
                return 1
            } else {
                return 0
            }
        })
    } else if(sortBy === 'byCreated'){
        return notes.sort((a, b) =>{
            if(a.createdAt > b.createdAt){
                return -1
            } else if(a.createdAt < b.createdAt){
                return 1
            } else {
                return 0
            }
        })
    } else if(sortBy === 'alphabetical'){
        return notes.sort( (a, b) => {
            if(a.title.toLowerCase() < b.title.toLowerCase() ){
                return -1  // a comes first
            } else if(a.title.toLowerCase() > b.title.toLowerCase() ){
                return 1 // b comes first
            } else {
                return 0
            }
        })
    } else {
        return notes
    }
}



// Render application notes
const renderNotes =  (notes,filters) => {
    notes = sortNotes(notes, filters.sortBy)
    const filteredNotes = notes.filter((note) => {
        return note.title.toLowerCase().includes(filters.searchText.toLowerCase())
    })

    document.querySelector("#notes").innerHTML = ''

    filteredNotes.forEach((note) => {
        const noteEl =  generateNoteDOM(note)       
        document.querySelector('#notes').appendChild(noteEl)
    })

}

// generate last edited msg
const generateLastEdited = (timestamp) => {
    return `Last edited ${moment(timestamp).fromNow()}`
}

const generateLastEditedTop = (timestamp) => {
    return `${moment(timestamp).fromNow()}`
}