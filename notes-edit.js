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


// LocalStorage notes.canvas のデータを表示する処理
if(note.canvas[0]){
    draw(note.canvas[0]['png']);
}

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


// 手書きCanvas関連処理 ================================

var canvas = document.getElementById('canvasArea'),
    ctx = canvas.getContext('2d'),
    moveflg = 0,
    Xpoint,
    Ypoint,
    currentCanvas,
    temp = [];

  
//初期値（サイズ、色、アルファ値）の決定
var defSize = 7,
    defColor = "#555";
  
// PC対応
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);

// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);

function startPoint(e){
  e.preventDefault();
  ctx.beginPath();

  console.log(e.clientX);
  console.log(e.clientY);
  console.log(e.clientY-event.target.getBoundingClientRect().top-8);
  
  // 矢印の先っぽから始まるように調整
  // clientX/Y から　offsetX/Y に変更（レイアウト調整の為）
  Xpoint = e.offsetX-2;
  Ypoint = e.offsetY-2;
    
  ctx.moveTo(Xpoint, Ypoint);
}
  
function movePoint(e){

 if(e.buttons === 1 || e.witch === 1 || e.type == 'touchmove')
  {
  // pageX/Y から　offsetX/Y に変更（レイアウト調整の為）
    Xpoint = e.offsetX-2  ;
  　Ypoint = e.offsetY-2  ;

    moveflg = 1;
      
    ctx.lineTo(Xpoint, Ypoint);
    ctx.lineCap = "round";
    ctx.lineWidth = defSize * 2;
    ctx.strokeStyle = defColor;
    ctx.stroke();
      
  }
}
  
function endPoint(e)
{
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
    var png = canvas.toDataURL();
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
 
    if(temp.length > 0)
    {
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
    var img = new Image();
    img.src = src;

    img.onload = function() {
        ctx.drawImage(img,0,0);
    }
}

