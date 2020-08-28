import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import sendQuery from './sendQuery';
import Suggestion from './suggestion';
import Search from './search';

function Login() {
  const [pokemonName, setPokemonName] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const redirectPath = useHistory();

  const loadPokemon = (name) => {
    sendQuery(`{getPokemon(str:"${name}"){name, image}}`).then((result) => {
      setPokemonName(result.getPokemon.name);
      setImage(result.getPokemon.image);
      setIsLoading(false);
    });
  };

  const login = () => {
    sendQuery(`{login (pokemon: "${pokemonName}") {name}}`).then((result) =>
      redirectPath.push('/classroom')
    );
  };

  return (
    <div>
      <Search loadPokemon={loadPokemon} />
      !isLoading &&
      <div>
        <h1>{pokemonName}</h1>
        <img src={image}></img>
        <button></button>
      </div>
    </div>
  );
}

export default Login;
