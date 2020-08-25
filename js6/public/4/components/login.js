import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import sendQuery from './sendQuery';
import Suggestion from './suggestion';
import Search form './search';

function Login(props) {
  const [pokemonName, setPokemonName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const redirectPath = useHistory();
  
    const loadPokemon = (name) => {
    sendQuery(`{getPokemon(str:"${name}"){name, image}}`)
      .then((result) => {
        setPokemonName(result.getPokemon.name);
        setImage(result.getPokemon.image);
        setIsLoading(false);
        setSuggestions([]);
        inputEl.current.value = '';
      });
  };

    const handleChange = (str) => {
    sendQuery(`{search(str: "${str}"){name}}`)
    .then((data) => {
      const results = data.search || [];          
      const names = results.reduce((acc, pokemon) => {
        return acc.concat(pokemon.name);
      }, []);
      setSuggestions(names);
    });
  }
  
  const login = () => {
    sendQuery(`
      {login (pokemon: "${pokemonName}"){name}}
    `).then((result) => redirectPath.push('/classroom'));
  };

  return (
   <div>
     <Search 
       handleChange={handleChange}
       loadPokemon={loadPokemon}
     />
     <div className="suggestions">
        {
          suggestions.map((pokemon, idx) => {
            return <Suggestion name={pokemon}
              replaceStr={inputEl.current.value}
              handleClick={loadPokemon}
              key={idx} />
          })
        }
      </div>
      {
        isLoading ? <div></div> :
        <div>
          <h1>{pokemonName}</h1>
          <img src={image}></img>
          <button 
            onClick={login}
            className="loginButton">Login
          </button>
        </div>
      }
    </div>
  )
};

export default Login;
