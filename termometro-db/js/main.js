import { buscarCiudad, obtenerTemperaturas } from "./api.js";
import { pintarGrafico, mostrarCargando, mostrarError, limpiarEstado } from "./render.js";
import { guardarCiudad, cargarFavoritas } from "./db.js";

const $input = document.getElementById("input-ciudad");
const $boton = document.getElementById("btn-buscar");
const $resultado = document.getElementById("resultado");
const $titulo = document.getElementById("titulo-ciudad");


const $botonGuardar = document.createElement("button");
$botonGuardar.textContent = "Guardar esta ciudad";
$botonGuardar.className = "search__button";
$titulo.insertAdjacentElement("afterend", $botonGuardar);

const $seccionFavoritas = document.createElement("section");
$seccionFavoritas.innerHTML = `
  <h2 class="resultado__titulo">Mis ciudades favoritas</h2>
  <ul id="lista-favoritas"></ul>
`;
$resultado.insertAdjacentElement("afterend", $seccionFavoritas);

const $listaFavoritas = $seccionFavoritas.querySelector("#lista-favoritas");

let cargando = false;

let ciudadActual = null;

async function manejarBusqueda() {
  const consulta = $input.value.trim();

  if (consulta === "") {
    mostrarError("Escribe el nombre de una ciudad.");
    return;
  }

  if (cargando) return;

  cargando = true;
  $boton.disabled = true;
  mostrarCargando(consulta);

  try {
    const ciudad = await buscarCiudad(consulta);
    const horas = await obtenerTemperaturas(ciudad.lat, ciudad.lon);

    limpiarEstado();
    pintarGrafico(ciudad, horas);

    ciudadActual = ciudad;
  } catch (error) {
    mostrarError(error.message);
    console.error(error);
  } finally {
    cargando = false;
    $boton.disabled = false;
  }
}

async function manejarGuardado() {
  if (!ciudadActual) return;

  try {
    await guardarCiudad(ciudadActual.nombre, ciudadActual.lat, ciudadActual.lon);
    await mostrarFavoritas();
  } catch (error) {
    mostrarError(error.message);
    console.error(error);
  }
}

async function mostrarFavoritas() {
  try {
    const favoritas = await cargarFavoritas();

    $listaFavoritas.innerHTML = favoritas
      .map((ciudad) => `<li>${ciudad.nombre}</li>`)
      .join("");
  } catch (error) {
    mostrarError(error.message);
    console.error(error);
  }
}

$boton.addEventListener("click", manejarBusqueda);
$botonGuardar.addEventListener("click", manejarGuardado);

$input.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") manejarBusqueda();
});

$input.value = "Málaga";
manejarBusqueda();
mostrarFavoritas();
