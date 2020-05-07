const titleElement = document.querySelector('#note-title')
const bodyElement = document.querySelector('#note-body')
const removeElement = document.querySelector('#remove-note')
const dateElement = document.querySelector('#last-edited')

const noteId = location.hash.substring(1);

let notes = getSavedNotes()
note = notes.find((note) => {
    return note.id === noteId
})

if(note === undefined){
    location.assign('index.html')
}

titleElement.value = note.title
bodyElement.value = note.body
dateElement.innerText = generateLastEdited(note.updatedAt)


titleElement.addEventListener('input',(e) => {
    note.title = e.target.value
    note.updatedAt  = moment().valueOf()
    dateElement.innerText = generateLastEdited(note.updatedAt)
    saveNotes(notes)
})

bodyElement.addEventListener('input',(e) => {
    note.body = e.target.value
    note.updatedAt  = moment().valueOf()
    dateElement.innerText = generateLastEdited(note.updatedAt)
    saveNotes(notes)
})

removeElement.addEventListener('click',(e)=>{
    removeNote(note.id)
    saveNotes(notes)
    location.assign(`index.html`)
})

window.addEventListener('storage',(e)=>{
    if(e.key === 'notes'){
        notes = JSON.parse(e.newValue)

        note = notes.find((note)=> note.id === noteId)

        if(note === undefined){
            location.assign('index.html')
        }

        titleElement.value = note.title
        bodyElement.value = note.body
        dateElement.innerText = generateLastEdited(note.updatedAt)

    }
})


// ===== 手書きCanvas関連処理 ================================

const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let moveflg = 0;
let Xpoint;
let Ypoint;
let currentCanvas;
let temp = [];

  
//ペンの初期値（サイズ、色）
const defSize = 7;
const defColor = "#555";
  
// PC対応
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);

// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);

// LocalStorage notes.canvas のデータを表示する処理
if(note.canvas[0]){
    draw(note.canvas[0]['png']);
}


