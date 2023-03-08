import React, { useState, useEffect } from "react"; // No es necesario importar React aquí
import { Divider, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import "./style.css"; // Te recomiendo utilizar alguna librería como tailwind o bulmacss

const Form = (urlPokemones) => { // No hay motivos para pasar la url como prop si a fin de cuentas es una constante que no varía
  const [pokemonesTemporales, setPokemonesTemporales] = useState([]);
  const [pokemonesArray, setPokemonesArray] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [banderaPokemon, setBanderaPokemon] = useState(true);
  const [openDialogPok, setOpenDialogPok] = useState(false);
  const [indicePokemon, setIndicePokemon] = useState("");

  useEffect(() => { // En general creo que toda la estructura de este useEffect se puede mejorar, hay formas de hacer llamadas con async/await dentro de un useEffect.
    let pokemonesInfo = [];
    axios.get(urlPokemones.lista).then((response) => {
      let pokemones = response.data.results; // Esta variable la podrías declarar como const, no la cambias después, también podrías haber echo `const { results: pokemones } = data.results`
      pokemones.map((val) => {
        let pokemon = {};
        pokemon.nombre = val.name;
        axios.get(val.url).then((response) => {
          let infoPokemon = response.data;
          pokemon.imagen = infoPokemon.sprites.front_default;
          pokemon.abilities = infoPokemon.abilities;
          pokemon.peso = infoPokemon.weight;
          pokemonesInfo.push(pokemon);
          setPokemonesArray(pokemonesInfo); // Estás haciendo un setState dentro de un map dentro de un useEffect, eso puede traer problemas de rendimiento.
        });
      });
    });
  }, []); // En general y como te comentaba al principio, yo creo que el approach ideal es wrappear todo el contenido del useEffect en una funcion async que devuelva el array con pokemonesInfo y ya con ese response hacer el setState une vez en lugar de por cada pokemon de la lista.

  useEffect(() => {
    if (banderaPokemon) {
      if (pokemonesArray.length === 20) {
        setPokemonesArray(pokemonesArray);
        setPokemonesTemporales(pokemonesArray);
        setBanderaPokemon(false);
      }
    }
  }, [pokemonesArray, banderaPokemon]);

  const eliminarPokemon = (indice) => { // Si como te comento en otra parte, utilizaras un id, podrías/tendrías que hacer un filter en lugar de un splice `pokemonesArray.filter(p => p.id !== id)`
    let pokemonDelete = pokemonesArray;
    pokemonDelete.splice(indice, 1);
    setPokemonesArray(pokemonDelete);
    setPokemonesTemporales(pokemonDelete);
  };

  const onChangeSearchPokemon = (e) => { // Aquí podrías haber hecho una deconstrucción `const onChangeSearchPokemon = ({ target: { value } }) =>`
    if (e.target.value !== "") {
      setSearchPokemon(e.target.value); // Este set es igual al que haces abajo, podrías ahorrarte unas lineas si haces el setSearchPokemon fuera de los if y un solo `if (e.target.value === "")` con el setPokemonesArray dentro
    } else if (e.target.value === "") {
      setSearchPokemon(e.target.value);
      setPokemonesArray(pokemonesTemporales);
    }
  };

  const handleOpenDialogPokemon = (indice) => {
    setOpenDialogPok(true);
    setIndicePokemon(indice);
  };

  const handleCloseDialogPokemon = () => { // Puedes eliminar esta función si haces el setState en donde estás mandando a llamarla
    setOpenDialogPok(false);
  };

  const pokemonesGrid = () => {
    return pokemonesArray.map((val, indice) => { // No se ve como buena práctica el utilizar el indice de un map para dictaminar el identificador de un elemento, yo te aconsejo tener algo como `val.id` o similar.
      let pokemonKey = val.nombre + String(indice);
      return (
        <div className="gridPokemon" key={pokemonKey}> // Lo mismo para los key, podrías usar el `val.id`
          <div className="alignText itemPokemonGrid" key={val.nombre}>
            <span
              className="cursorPointer"
              onClick={() => handleOpenDialogPokemon(indice)}
            >
              {val.nombre} // Para no estar haciendo `val.nombre`, `val.id`, `val.imagen` puedes hacer una declaración al principio como `const { id, imagen, nombre } = val;`
            </span>
          </div>
          <div className=" alignText itemPokemonGrid">
            <img alt="pokemon" src={val.imagen} width="200" height="200" />
          </div>
          <div className="alignText itemPokemonGrid">
            <IconButton
              aria-label="delete"
              onClick={() => eliminarPokemon(indice)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      );
    });
  };

  const buscarPokemon = () => {
    let filterPokemon = pokemonesTemporales.filter((pokemon) => {
      return pokemon.nombre === searchPokemon;
    });
    if (filterPokemon && filterPokemon.length > 0) {
      setPokemonesArray(filterPokemon);
    } else {
      setPokemonesArray([]);
    }
  };

  const ShowDetailsPokemon = () => {
    if (indicePokemon !== "" && pokemonesArray[indicePokemon]) {
      let div = (
        <div className="dialogPokemon">
          <div className="fontSizePokemon">
            <span>{pokemonesArray[indicePokemon].nombre}</span>
          </div>
          <div>
            <img
              alt="pokemon"
              src={pokemonesArray[indicePokemon].imagen}
              width="400"
              height="400"
            />
          </div>
          <div className="fontSizePokemon">Abilities:</div>
          {pokemonesArray[indicePokemon].abilities.map((val) => {
            return (
              <div key={val.ability.name} className="fontSizePokemon">
                {val.ability.name}
              </div>
            );
          })}
        </div>
      );
      return div;
    }
  };

  return (
    <>
      <form className="form">
        <div className="encabezadoFiltro">
          <TextField
            label="filtrar"
            variant="outlined"
            value={searchPokemon}
            onChange={onChangeSearchPokemon}
          />
          <div style={{ marginLeft: "1rem" }}>
            <Button variant="contained" size="large" onClick={buscarPokemon}>
              Search
            </Button>
          </div>
        </div>
      </form>
      <Divider />
      <div className="gridPokemon marginTopGrid">
        <div className="alignText itemGridEncabezado">Pokemon name</div>
        <div className="alignText itemGridEncabezado">Pokemon image</div>
        <div className="alignText itemGridEncabezado">Action</div>
      </div>
      {pokemonesGrid()}
      <div>
        <Dialog
          maxWidth="xl"
          open={openDialogPok}
          onClose={handleCloseDialogPokemon}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogContent>{ShowDetailsPokemon()}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogPokemon} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Form;
