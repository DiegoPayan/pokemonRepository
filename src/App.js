import Form from "./components/Form";
import "./styles.css";

export default function App() {
  const pokemonList = "https://pokeapi.co/api/v2/pokemon/";

  return (
    <div className="App">
      <h1>Pokemon List</h1>
      <Form lista={pokemonList} />
    </div>
  );
}
