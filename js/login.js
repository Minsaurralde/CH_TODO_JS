////////////////////////////////////////// Dom /////////////////////////////////////////////////

//variables que necesito para manipular dom//

let contenedorBlanco = document.querySelector(".contenedor-blanco");

let cajaLogin = document.querySelector(".caja-login");
let cajaRegistro = document.querySelector(".caja-registro");

let formLogin = document.querySelector(".form-login");
let formRegistro = document.querySelector(".form-registro");


//funciones para manipular dom//

function openRegistro() {
	if(window.innerWidth > 850){
		formRegistro.style.display = "block";
		contenedorBlanco.style.left = "410px";
		formLogin.style.display = "none";
		cajaRegistro.style.opacity = "0";
		cajaLogin.style.opacity = "1";	
	}else{
		formRegistro.style.display = "block";
		contenedorBlanco.style.left = "0px"; //si la pantalla es chica no lo muevo con el position//
		formLogin.style.display = "none";
		cajaRegistro.style.display = "none";
		cajaLogin.style.display = "block";	
		cajaLogin.style.opacity = "1";
	}	
};
document.getElementById("btn_formRegistro").addEventListener("click", openRegistro);

function openLogin(){
	if(window.innerWidth > 850){
		formRegistro.style.display = "none";
		contenedorBlanco.style.left = "10px"; //le devuelvo la medida que tenia seteada al inicio//
		formLogin.style.display = "block";
		cajaRegistro.style.opacity = "1";
		cajaLogin.style.opacity = "0";
	}else{
		formRegistro.style.display = "none";
		contenedorBlanco.style.left = "0px"; //si la pantalla es chica no lo muevo con el position//
		formLogin.style.display = "block";
		cajaRegistro.style.display = "block"; //muestro la caja para que no desaparezca//
		cajaLogin.style.display = "none"; //se oculta para que no quede superpuesto//
		cajaRegistro.style.opacity = "1";
	}
	
};
document.getElementById("btn_formIngreso").addEventListener("click", openLogin);

function pantallaMobile(){
	if(window.innerWidth > 850){
		cajaLogin.style.display = "block";
		cajaRegistro.style.display = "block";	
	}else{
		cajaRegistro.style.display = "block";
		cajaRegistro.style.opacity = "1"; 
		cajaLogin.style.display = "none";
		cajaLogin.style.opacity = "0";
		contenedorBlanco.style.left = "0px";
		formLogin.style.display = "block";
	}
};

////////////////////////////////////////// Objetos /////////////////////////////////////////////////

//armo clase del objeto//

class Usuario{

	constructor(n, e, p){
		this.nombre = n.toUpperCase();
		this.email = e.toUpperCase();
		this.password = p;
	}
};

//variables necesarias para tratar objetos//
const storageData = JSON.parse(localStorage.getItem("usuarios"));
let storageUsers = [];

const regexName = /^[a-zA-ZÀ-ÿ\s]{4,16}$/; // Letras y espacios, pueden llevar acentos.
const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const regexPass =  /^.{5,12}$/; // 5 a 12 caracteres.

//Armo funciones para manipular objetos//

function traerDelStorage(){
	for(const item of storageData){  //itero para transformar dataStorage en Usuario//
		storageUsers.push(new Usuario(item.nombre, item.email, item.password));
	}
}

function guardaStorage(clave, valor){
	localStorage.setItem(clave, JSON.stringify(valor));
};

function elimMsgError(){
	let error = document.getElementsByClassName("error-activo");

	if(error.length>0){
		for(let i=error.length-1; i >= 0; i--){
    	error[i].classList.remove("error-activo");}
	}
};

function validar(ev){
	let idtarget = ev.target.id;
	let validar = ev.target.value;
	let error = null;

	switch(idtarget){
		case "newname":
			if(regexName.test(validar)
			){error = false
			}else{error = true}
			break;
		case "newemail":
			if(regexEmail.test(validar)
			){error = false
			}else{error = true}
			break;
		case "newpass":
			if(regexPass.test(validar)
			){error = false
			}else{error = true}
			break;
	}
	if(error == true){
		document.getElementById("e-"+idtarget).classList.add("error-activo");
	}else{
		document.getElementById("e-"+idtarget).classList.remove("error-activo");
	};
};
document.getElementById("form-registro").addEventListener("change", validar);


function crearUsuario(){
	let nombre = document.getElementById("newname").value;
	let email = document.getElementById("newemail").value;
	let password = document.getElementById("newpass").value;

	const usuario = new Usuario(nombre, email, password);

	//primero miro si todos los datos estan ok
	let validacion = () => {
		if(regexName.test(nombre)&&
			regexEmail.test(email)&&
			regexPass.test(password)
		){return true
		}return false
		};

	switch(validacion()){
		case true:
			elimMsgError();
			if(storageUsers.length > 0 ){
				//hago la validacion de email duplicado en la lista//
				let busqueda = storageUsers.find(objeto => objeto.email == email.toUpperCase());
				if(busqueda != undefined){
					document.querySelector(".error-mail.subBtn").classList.add("error-activo")
					// console.log('El MAIL YA EXISTE, INTENTE CON OTRO');
				}else{
					storageUsers.push(usuario);
					guardaStorage("usuarios", storageUsers);
					document.getElementById("form-registro").reset();
					//aplico jquery animaciones concatenadas para cumplir desafio//
					$("#form-registro .exito-msg").slideDown().delay(1500).slideUp();
					// console.log('SE REGISTRO EXITOSO');
				};
			}else{
				storageUsers.push(usuario);
				guardaStorage("usuarios", storageUsers);
				document.getElementById("form-registro").reset();
				//aplico jquery animaciones concatenadas para cumplir desafio//
				$("#form-registro .exito-msg").slideDown().delay(1500).slideUp();
				// console.log('SE REGISTRO EXITOSO');
			};
		break;
		case false:
			document.querySelector(".error-mail.subBtn").classList.remove("error-activo");
			document.querySelector(".error-msg.subBtn").classList.add("error-activo");
    		// console.log('NO PASA VALIDACIONES REGEX');
		break;
	}
};
document.getElementById("btn_registro").addEventListener("click", crearUsuario);

function login(){
	let email = document.getElementById("email").value;
	let password = document.getElementById("pass").value;

	let busqueda = storageUsers.find(objeto => objeto.email == email.toUpperCase() && objeto.password == password );
	if(busqueda != undefined){
		guardaStorage("userLogin", busqueda );
		window.location = "todo.html";       
    }else{
        document.querySelector("#e-sesion").classList.add("error-activo");
    }
}
document.getElementById("btn_entrar").addEventListener("click", login);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ejecuto codigo en window.onload//
pantallaMobile();

if(storageData != null){
	traerDelStorage()
}