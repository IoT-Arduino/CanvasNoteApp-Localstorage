
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
    const button = document.createElement('div')
    const dateEl = document.createElement('div')

    // setup notelist and remove button
    noteEl.classList.add('list-item')
    noteEl.classList.add('container')
    button.classList.add('list-item__button')
    textEl.classList.add('list-item__title')
    button.innerHTML =`<span class="material-icons">
    delete_forever
    </span>`
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

    textEl.setAttribute('href',`edit.html#${note.id}`)
    noteEl.appendChild(textEl)
    noteEl.appendChild(button)

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


// ==== Canvas Functions ======================


function startPoint(e){
    e.preventDefault();
    ctx.beginPath();
  
    if(e.changedTouches){
          e = e.changedTouches[0]
          Xpoint = e.clientX-event.target.getBoundingClientRect().left-2;
          Ypoint = e.clientY-event.target.getBoundingClientRect().top-2;
     } else {
          Xpoint = e.offsetX-2;
          Ypoint = e.offsetY-2;
     }
  
  　// ポインタ先端の位置調整
    Xpoint = e.offsetX-2;
    Ypoint = e.offsetY-2;
      
    ctx.moveTo(Xpoint, Ypoint);
  }
  
    
  function movePoint(e){
   if(e.buttons === 1 || e.witch === 1 || e.type == 'touchmove'){
  
      if(e.changedTouches){
          e = e.changedTouches[0]
          Xpoint = e.clientX-event.target.getBoundingClientRect().left-2;
          Ypoint = e.clientY-event.target.getBoundingClientRect().top-2;
     } else {
          Xpoint = e.offsetX-2;
          Ypoint = e.offsetY-2;
     }
  
      moveflg = 1;
        
      ctx.lineTo(Xpoint, Ypoint);
      ctx.lineCap = "round";
      ctx.lineWidth = defSize * 2;
      ctx.strokeStyle = defColor;
      ctx.stroke();
    }
  }
    
  function endPoint(e){
      if(moveflg === 0)
      {
         ctx.lineTo(Xpoint-1, Ypoint-1);
         ctx.lineCap = "round";
         ctx.lineWidth = defSize * 2;
         ctx.strokeStyle = defColor;
         ctx.stroke();
  
      }
      moveflg = 0;
      setLocalStoreage();
  }
   
  
  function resetCanvas() {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  }
   
  
  function setLocalStoreage(){
      const png = canvas.toDataURL();
  　　const canvasItems = note.canvas
  
      setTimeout(function(){
          canvasItems.unshift({png});
          note.canvas = canvasItems
          note.updatedAt  = moment().valueOf()
          dateElement.innerText = generateLastEdited(note.updatedAt)
          saveNotes(notes)
   
          currentCanvas = 0;
          temp = [];
   
      }, 0);
  }
   
  function prevCanvas(){
  　　const canvasItems = note.canvas
      if(canvasItems.length > 0) {
          temp.unshift(canvasItems.shift());
          setTimeout(function(){
              note.canvas = canvasItems
              note.updatedAt  = moment().valueOf()
              dateElement.innerText = generateLastEdited(note.updatedAt)
              saveNotes(notes)
              resetCanvas();
              if(canvasItems[0]){
                  draw(canvasItems[0]['png']);
              }
          }, 0);
      }
  
  }
   
  function nextCanvas(){
      const canvasItems = note.canvas
      if(temp.length > 0){
          canvasItems.unshift(temp.shift());
           setTimeout(function(){
              note.canvas = canvasItems
              note.updatedAt  = moment().valueOf()
              dateElement.innerText = generateLastEdited(note.updatedAt)
              saveNotes(notes)
              resetCanvas();
              draw(canvasItems[0]['png']);
           }, 0);
      }
  }
   
  
  function draw(src) {
      const img = new Image();
      img.src = src;
  
      img.onload = function() {
          ctx.drawImage(img,0,0);
      }
  }
