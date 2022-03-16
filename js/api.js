//API utilizada OpenWeather
//key = "bfd8ebcb713b01c66109a224bde5b533"
//city_id = 3433955

//iconos de clima en "https://openweathermap.org/weather-conditions#Icon-list"
//metrica en celcius "https://openweathermap.org/current#data"
//lenguaje en español "https://openweathermap.org/current#multi"

//paso 1- me creo las variables que necesito del dom para inyectarles la info de la api
let API_key = "bfd8ebcb713b01c66109a224bde5b533"
let cityDefault = "Buenos Aires"
let datos = []

let hora = document.getElementById("w-update")
let grados = document.getElementById("w-celsius");
let descripcion = document.querySelector("#w-description span");
let imagen = document.getElementById("w-img");

let wformulario = document.getElementById("w-buscador")

//paso 2- declaro una funcion que use ajax para buscar el clima en la API
wformulario.addEventListener("submit", e=>{
	e.preventDefault();
	let ciudad = document.getElementById("w-ciudad");
	obtenerPronostico(ciudad.value);
	wformulario.reset();
});
function obtenerPronostico(city){
	//primero hago el request
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric&lang=sp`
	const ajax = new XMLHttpRequest();
	ajax.open("GET", url, true);
	ajax.send();

	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			//convierto el response a objetos para manipularlo
			datos = JSON.parse(this.responseText);
			console.log(datos);
			
			//paso 3- casteo la hora
			mostrarHora(datos);
			//paso 4- muestro los datos en el witget del clima
			mostrarClima(datos);
		}
	}
}

//declaro las funciones adicionales
function mostrarHora(datosApi){
	let horaApi = new Date(datosApi.dt*1000)
	let horaLegible = horaApi.toLocaleString("es-ES", {
		timeStyle: "short",
		dateStyle: "short"});
	// console.log(horaLegible);

	//inyecto la hora en el html
	hora.innerHTML = `Updated ${horaLegible}`;
}
function mostrarClima(datosApi){
	//mostrar temperatura
	let gradosApi = Math.floor(datosApi.main.temp);
	grados.innerHTML = `${gradosApi}°C`;

	let imagenApi = datosApi.weather[0].icon;
	imagen.innerHTML = `<img src="http://openweathermap.org/img/wn/${imagenApi}@2x.png">`

	//mostrar descripcion
	let ciudadApi = datosApi.name;
	let descriptionApi = datosApi.weather[0].description;

	descripcion.innerHTML = `${ciudadApi} - ${descriptionApi}`;
}
//////eventos en windows.onload//////////////////
obtenerPronostico(cityDefault);
