import { buscarCiudad, obtenerTemperaturas } from "./api.js";
import { pintarGrafico, mostrarCargando, mostrarError, limpiarEstado } from "./render.js";
import { guardarCiudad, cargarFavoritas } from "./db.js";

const $input = document.getElementById("input-ciudad");
const $boton = document.getElementById("btn-buscar");
const $botonGuardar = document.getElementById("btn-guardar");
const $listaFavoritas = document.getElementById("lista-favoritas");

let cargando = false;

// La ciudad que hay AHORA en pantalla. Dentro de manejarBusqueda, la
// variable `ciudad` es local: nace y muere dentro de la función. Cuando
// pulses «guardar» ya no existiría, así que la copiamos aquí.
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

// GUARDAR la ciudad de pantalla en la base de datos.
// db.js avisa de los fallos con throw, así que aquí va el catch.
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

// LEER las favoritas y pintarlas, igual que pintas las barras.
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
