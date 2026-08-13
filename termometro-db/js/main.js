import { buscarCiudad, obtenerTemperaturas } from "./api.js";
import { pintarGrafico, mostrarCargando, mostrarError, limpiarEstado } from "./render.js";
import { guardarCiudad, cargarFavoritas } from "./db.js";



const $input = document.getElementById("input-ciudad");
const $boton = document.getElementById("btn-buscar");

let cargando = false;

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
  } catch (error) {
    mostrarError(error.message);
    console.error(error);
  } finally {
    cargando = false;
    $boton.disabled = false;
  }
}


// Cuando el usuario pulse «guardar ciudad»:
botonGuardar.addEventListener("click", async () => {
  await guardarCiudad(ciudadActual, lat, lon);
  mostrarFavoritas();
});

// Al arrancar la app, pintar las favoritas guardadas:
async function mostrarFavoritas() {
  const favoritas = await cargarFavoritas();
  console.log("Mis ciudades:", favoritas);
  // aquí las pintas en el DOM, como haces con las barras
}
mostrarFavoritas();


$boton.addEventListener("click", manejarBusqueda);

$input.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") manejarBusqueda();
});

$input.value = "";
manejarBusqueda();