////////////////////////////////////////// Objetos /////////////////////////////////////////////////
//variables globales que necesito para manipular obj//
let todoList = []
let buscado = null;
let nodoSeleccionado = null;

//armo clase del objeto//
class Tarea {

    constructor(n, d, s){
    this.nombre = n;
    this.descripcion = d;
    this.status = s;
    }
    mostrar(){
    let todo = document.getElementById("todo");
    let enCurso = document.getElementById("encurso");
    let hecho = document.getElementById("hecho");

    let card = `
            <div class="task relative" id="${this.nombre.split(" ").join("")}" draggable="true" ondragstart="arrastrar(event)">
                <span>${this.nombre}</span>
                <i class="fas fa-edit" onclick="editar(event)"></i>
                <i class="far fa-times-circle" onclick="eliminar(event)">
            </div>`
    
        switch(this.status){
            case "todo":
            todo.innerHTML += card;
            break;
            case "encurso":
            enCurso.innerHTML += card;
            break;
            case "hecho":
            hecho.innerHTML += card;
            break;
        }
    }
    cambioStatus(nuevoValor){
        this.status = nuevoValor;
    }
    cambioDescripcion(nuevoValor){
        this.descripcion = nuevoValor;
    }
    cambioNombre(nuevoValor){
        this.nombre = nuevoValor;
    }
};

//Funciones y manipulacion del dom//
function bienvenida (){
   let usuario = JSON.parse(localStorage.getItem("userLogin"));
   let etiqueta = document.getElementById("storage_userLog");
   let nombre = usuario.nombre.charAt(0)+usuario.nombre.toLowerCase().slice(1);

   etiqueta.innerText += nombre;
   etiqueta.classList.add("capital");
};

function arrastrar(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};
// //asigno la funcion arrastrar al htmlcoleccion//
// let tsk = document.getElementsByClassName("task");
// for(let i=0; i<tsk.length; i++){
//     tsk[i].addEventListener("ondragstart", arrastrar);}

function aceptaMover(ev) {
    ev.preventDefault();
};
function soltar(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text"); // 1 - capturo el nombre del id de lo que estoy moviendo
    let elemento = document.getElementById(data) // 2 - capturo el elemento con ese id
    ev.currentTarget.appendChild(elemento); // 3 - lo pego en el nodo padre

    //busco en el array el id y edito el status.
    buscado = todoList.find(objeto => objeto.nombre == elemento.textContent.trim());
    buscado.cambioStatus(ev.target.id);
};
//asigno las funciones arrastrar y soltar al htmlcoleccion//
// let dr = document.getElementsByClassName("bloque-tab");
// for(let i=0; i<dr.length; i++){
//     dr[i].addEventListener("ondrop", soltar);}

// let adr = document.getElementsByClassName("bloque-tab");
// for(let i=0; i<adr.length; i++){
//     adr[i].addEventListener("ondragover", aceptaMover);}

function crearTarea(){
    let modal = document.getElementById("contenedor-modal");
    //primero miro si ya esta abierta por el boton de cancelar//
    if (modal.style.display == "none" || modal.style.display == "" ) {
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }

    //muestro el boton para guardar y oculto el de editar
    let saveButton = document.getElementById("btn_save");
    let editButton = document.getElementById("btn_edit");       
    if(saveButton.style.display == "none" || saveButton.style.display == "" ) {
        saveButton.style.display = "block";
        editButton.style.display = "none";
    };

    //habilito las opciones
    let op = document.getElementById("contenedor-modal").getElementsByTagName("option");
    for (let i = 0; i < op.length; i++) {
        op[i].disabled = false;
    };
};
//dejo la funcion en el html porque se va cuando uso el innerHTML//
// document.getElementById("btn_add").addEventListener("click", crearTarea);
document.getElementById("btn_cancel").addEventListener("click", ()=>{crearTarea();resetModal()});
document.getElementById("close_modal").addEventListener("click", ()=>{crearTarea();resetModal()});

function resetModal(){
    document.getElementById("form-nueva-tarea").reset();
};

function guardaTarea(){
    let taskName = document.getElementById("task-name").value;
    let taskDescription = document.getElementById("task-description").value;
    let taskStatus = document.getElementById("task-status").value;
  
    if(!taskName){
        let aviso = document.getElementById("task-name");
        aviso.style.border = "0.1rem solid yellow";
        setTimeout(()=> {aviso.style.border = "0.1rem solid red";}, 500);
        setTimeout(()=> {aviso.style.border = "0.1rem solid black";}, 1100);
        //alert("QUEDO VACIO EL NOMBRE DE LA TAREA");
    }else{
        //creo mi objeto de clase y lo meto en el array//
        const tarea = new Tarea(taskName, taskDescription, taskStatus);
        todoList.push(tarea);

        //aca cierro el modal y lo reseteo//
        crearTarea();
        resetModal();

        //agrego la nueva card al dom//
        tarea.mostrar();
    }    
};
document.getElementById("btn_save").addEventListener("click", guardaTarea);

function editar(ev){
    //me llevo el nodo seleccionado en una variable global
    nodoSeleccionado = ev.target.parentElement.childNodes[1];

    //busco el elemento en el array y muestro sus propiedades en el form
    let paraEditar = ev.target.parentElement;
    buscado = todoList.find(objeto => objeto.nombre == paraEditar.textContent.trim());
    document.getElementById("task-name").value = buscado.nombre;
    document.getElementById("task-description").value = buscado.descripcion;
    document.getElementById("task-status").value = buscado.status;

    //abro el modal
    crearTarea();

    //muestro el boton para editar y oculto el de guardar
    let saveButton = document.getElementById("btn_save");
    let editButton = document.getElementById("btn_edit");           
    if(editButton.style.display == "none" || editButton.style.display == "" ) {
        saveButton.style.display = "none";
        editButton.style.display = "block";
    };

    //bloqueo las opciones del status
    let op = document.getElementById("contenedor-modal").getElementsByTagName("option");
    for (let i = 0; i < op.length; i++) {
        op[i].disabled = true;
    };
};

function updateTarea(){
    let taskName = document.getElementById("task-name").value;
    let taskDescription = document.getElementById("task-description").value;
    let taskStatus = document.getElementById("task-status").value;

    if(!taskName){
        let aviso = document.getElementById("task-name");
        aviso.style.border = "0.1rem solid yellow";
        setTimeout(()=> {aviso.style.border = "0.1rem solid red";}, 500);
        setTimeout(()=> {aviso.style.border = "0.1rem solid black";}, 1100);
        //alert("QUEDO VACIO EL NOMBRE DE LA TAREA");
    }else{
    //actualizo dom
    nodoSeleccionado.textContent = taskName;

    //actualizo array
    buscado.cambioDescripcion(taskDescription);
    buscado.cambioNombre(taskName);

    //cierro el modal y reseteo form//
    crearTarea();
    resetModal(); 
    } 
};
document.getElementById("btn_edit").addEventListener("click", updateTarea);

function eliminar(ev){
    //primero elimino el elemento del dom//
    let paraBorrar = ev.target.parentElement;
    let nodopadre = paraBorrar.parentNode;
    nodopadre.removeChild(paraBorrar);

    //despues busco la posicion del elemento en mi array y lo elimino tambien de allí//
    let indexBuscado = todoList.indexOf(todoList.find(objeto => objeto.nombre == paraBorrar.textContent.trim()));
    todoList.splice(indexBuscado,1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ejecuto codigo en window.onload//
bienvenida();

//creo 3 obj de prueba y los muestro//
todoList.push(new Tarea("Tarea 1","","todo"));
todoList.push(new Tarea("Tarea 2","","todo"));
todoList.push(new Tarea("Tarea 3","","todo"));

for(let i=0; i<todoList.length; i++){
    todoList[i].mostrar();};
