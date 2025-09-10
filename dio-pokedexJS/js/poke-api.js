const pokeApi = {};

// Converte a resposta da API em objeto Pokemon
function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id; // id do Pokémon
  pokemon.name = pokeDetail.name;

  // Tipos
  const types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
  const [type] = types;
  pokemon.types = types;
  pokemon.type = type;

  // Foto com fallback
  pokemon.photo = pokeDetail.sprites?.other?.dream_world?.front_default
                || pokeDetail.sprites?.other?.["official-artwork"]?.front_default
                || pokeDetail.sprites?.front_default;

  return pokemon;
}

// Pega os detalhes de um Pokémon individual
pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then(response => response.json())
    .then(convertPokeApiDetailToPokemon);
};

// Pega lista de Pokémon detalhados
pokeApi.getPokemons = async (offset = 0, limit = 5) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const jsonBody = await response.json();

    // array de Promises para cada Pokémon detalhado
    const detailRequests = jsonBody.results.map(pokeApi.getPokemonDetail);

    // retorna todos os detalhes resolvidos
    return await Promise.all(detailRequests);

  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    return [];
  }
};
