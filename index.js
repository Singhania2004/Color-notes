var currentIndex = 0;
$(".theme-toggle").hide();
$(".radio-toggle").hide();
$("#theme1").attr( 'checked', true );

//TOGGLING SIDE NAVBAR ITEMS
$(".theme").click(function(){
    $(".theme-toggle").toggle();
});

$(".design").click(function(){
    $(".radio-toggle").toggle();
});

$(".slider").click(function(){
    $("body").toggleClass("lightmode");
    if($('#dark_light').is(":checked")){
        localStorage.setItem("mode", "lightmode");
    }
    else{
        localStorage.setItem("mode", "");
    }
});

//DESIGN RADIO FUNCTIONALITY
$(".radio-btn").click(function(){
    $(".note-pg").css("background-image", "url(./images/"+this.id+".jpg)")
    localStorage.setItem("radio", this.id);
})

//ONLOAD
$(document).ready(function() {
    if(localStorage.getItem("radio")){
        let toCheck = localStorage.getItem("radio");
        $('#'+toCheck).attr( 'checked', true );
        $(".note-pg").css("background-image", "url(./images/"+toCheck+".jpg)")
    }
    let mode = localStorage.getItem("mode");
    if(mode == "lightmode"){
        $("body").addClass("lightmode");
        $('#dark_light').attr( 'checked', false );
    }
    else{
        $("body").removeClass("lightmode");
        $('#dark_light').attr( 'checked', true );
    }
    UI.displayNotes();
});

class ColorNote {
    constructor(heading, content, bgcolor) {  
      this.heading = heading;
      this.content = content;
      this.bgcolor = bgcolor;
    }
}

$(".add").click(function(){
    const notes = Storage.getNotes();
    currentIndex = notes.length;
    $(".note-fill").show(); 
    UI.clear();
});

//MAKE NEW NOTE
$("#save").click(function(){
    let heading = $("#heading").val();
    let content = $("#content").val();
    let bg;
    if($('body').hasClass('lightmode')){
        bg = "#9559cd"
    }
    else{ bg = "blueviolet"}
    
    if(heading === '' || content === ''){
        UI.alertUnfilled("#dc3545","Please fill in all fields");
    }
    else{
        const notes = Storage.getNotes();
        const index = notes.length;
        
        if(currentIndex < index ){
            //UPDATE IN DISPLAY
            $(".note[data-index='" + currentIndex +"'] h2").text(heading);
            $(".note[data-index='" + currentIndex +"'] p").text(content);

            //UPDATE IN LOCAL STORAGE
            notes[currentIndex].heading = heading;
            notes[currentIndex].content = content;
            localStorage.setItem('notes', JSON.stringify(notes));
        }
        else{
            var note = new ColorNote(heading,content,bg);
            Storage.addNotes(note);
            UI.addNotesToGrid(note, index);
        }

        UI.alertUnfilled("#198754","Note saved");
    }
})

$(document).on('click','.note',function(){
    const number = Number(this.dataset.index);
    currentIndex = number;
    $(".note-fill").show(); 
    UI.openNotes(number);
    this.style.transform = 'scale(0.94)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 140);
});

$(".bin").click(function(){
    Storage.removeNotes();
    document.querySelectorAll(".note").forEach((note,index) => {
        if(currentIndex === index){
            note.remove();
        }
    });
    document.querySelectorAll(".note").forEach((note,index) => {
        $(note).attr("data-index", index);
    });
    UI.clear();
});

$("#note-search").keyup(function(){
    let search_input = $("#note-search").val();
    let search = search_input.toUpperCase();
    let note =document.querySelectorAll(".note");
    note.forEach((element, index) => {
        let head = $(element).children('h2').text();
        if(head.toUpperCase().indexOf(search) > -1){
            element.style.display = '';
        }
        else{
            element.style.display = "none";
        }
    });
});

$(".color-select").click(function(){
    let bg = $(this).css("background");
    document.querySelectorAll(".note").forEach((note,index) => {
        if(currentIndex === index){
            $(note).css("background", bg);
            $(".features .color").css("background", bg)
        }
    });
    const notes = Storage.getNotes();
    notes[currentIndex].bgcolor = bg;
    localStorage.setItem("notes", JSON.stringify(notes));
    
});

class UI{
    static displayNotes(){
        const notes = Storage.getNotes();
        notes.forEach((note, index) => {
            UI.addNotesToGrid(note, index);
        });
    }

    static addNotesToGrid(note, index){
        var newNote = $("<div>").addClass("note");
        newNote.html("<h2>"+note.heading+"</h2><p>"+note.content+"</p>")    
        newNote.attr("data-index", index).css("background", note.bgcolor);
        $(".notesDisplay").append(newNote);
    }

    static clear(){
        $("#heading").val('');
        $("#content").val('');  
    }

    static alertUnfilled(color, message){
        var alert = $("<div>").addClass("alert-fill").css("background-color", color);
        alert.text(message);
        $(".note-fill").append(alert);

        setTimeout(() => {
            $(".alert-fill").remove();
        }, 3000);
    }

    static openNotes(number){
        const notes = Storage.getNotes();
        $("#heading").val(notes[number].heading);
        $("#content").val(notes[number].content);
        $(".features .color").css("background", notes[number].bgcolor) 
    }
}

class Storage{
    static getNotes(){
        let notes;
        if(localStorage.getItem("notes") === null){
            notes = [];
        }
        else{
            notes = JSON.parse(localStorage.getItem('notes'));
        }
        return notes;
    }

    static addNotes(note){
        const notes = Storage.getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static removeNotes(){
        const notes = Storage.getNotes();
        notes.forEach((note,index) => {
            if(index === currentIndex){
                notes.splice(index,1);
            }
        });
        localStorage.setItem("notes", JSON.stringify(notes));
    }
}