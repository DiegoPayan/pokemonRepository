import React, { useState, useEffect } from "react";
import { Divider, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import "./style.css";

const Form = (urlPokemones) => {
  const [pokemonesTemporales, setPokemonesTemporales] = useState([]);
  const [pokemonesArray, setPokemonesArray] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [banderaPokemon, setBanderaPokemon] = useState(true);
  const [openDialogPok, setOpenDialogPok] = useState(false);
  const [indicePokemon, setIndicePokemon] = useState("");

  useEffect(() => {
    let pokemonesInfo = [];
    axios.get(urlPokemones.lista).then((response) => {
      let pokemones = response.data.results;
      pokemones.map((val) => {
        let pokemon = {};
        pokemon.nombre = val.name;
        axios.get(val.url).then((response) => {
          let infoPokemon = response.data;
          pokemon.imagen = infoPokemon.sprites.front_default;
          pokemon.abilities = infoPokemon.abilities;
          pokemon.peso = infoPokemon.weight;
          pokemonesInfo.push(pokemon);
          setPokemonesArray(pokemonesInfo);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (banderaPokemon) {
      if (pokemonesArray.length === 20) {
        setPokemonesArray(pokemonesArray);
        setPokemonesTemporales(pokemonesArray);
        setBanderaPokemon(false);
      }
    }
  }, [pokemonesArray, banderaPokemon]);

  const eliminarPokemon = (indice) => {
    let pokemonDelete = pokemonesArray;
    pokemonDelete.splice(indice, 1);
    setPokemonesArray(pokemonDelete);
    setPokemonesTemporales(pokemonDelete);
  };

  const onChangeSearchPokemon = (e) => {
    if (e.target.value !== "") {
      setSearchPokemon(e.target.value);
    } else if (e.target.value === "") {
      setSearchPokemon(e.target.value);
      setPokemonesArray(pokemonesTemporales);
    }
  };

  const handleOpenDialogPokemon = (indice) => {
    setOpenDialogPok(true);
    setIndicePokemon(indice);
  };

  const handleCloseDialogPokemon = () => {
    setOpenDialogPok(false);
  };

  const pokemonesGrid = () => {
    return pokemonesArray.map((val, indice) => {
      let pokemonKey = val.nombre + String(indice);
      return (
        <div className="gridPokemon" key={pokemonKey}>
          <div className="alignText itemPokemonGrid" key={val.nombre}>
            <span
              className="cursorPointer"
              onClick={() => handleOpenDialogPokemon(indice)}
            >
              {val.nombre}
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
