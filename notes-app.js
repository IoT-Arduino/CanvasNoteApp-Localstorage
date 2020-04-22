
let notes = getSavedNotes()

const filters = {
    searchText:'',
    sortBy: 'byEdited'
}

renderNotes(notes,filters)

document.querySelector('#createNote').addEventListener('click',(e) => {
    const id = uuidv4()
    const timestamp = moment().valueOf()
    notes.push({
        id:id,
        title:'',
        body:'',
        // edit canvas
        canvas: [],
        createdAt: timestamp,
        updatedAt: timestamp
    })
    saveNotes(notes)
    location.assign(`edit.html#${id}`)
})

document.querySelector('#searchText').addEventListener('input',(e) => {
    filters.searchText = e.target.value
    renderNotes(notes,filters)
})

document.querySelector('#filterBy').addEventListener('change',(e) => {
    filters.sortBy = e.target.value
    renderNotes(notes, filters)
})

window.addEventListener('storage',(e) => {
    if(e.key === 'notes'){
        notes = JSON.parse(e.newValue)
        renderNotes(notes,filters)
    }
})




