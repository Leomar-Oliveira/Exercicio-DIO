const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const limit = 8;
let offset = 0;
let isLoading = false;

// Cria HTML de cada Pokémon
function createPokemonItem(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
      <span class="number">#${String(pokemon.number).padStart(3, "0")}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}" loading="lazy" />
      </div>
    </li>
  `;
}

// Renderiza e adiciona evento de clique
function appendPokemonItems(pokemons) {
  const newHtml = pokemons.map(createPokemonItem).join("");
  pokemonList.insertAdjacentHTML("beforeend", newHtml);

  document.querySelectorAll(".pokemon").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      if (!id) return console.error("ID do Pokémon não encontrado!");
      window.location.href = `pokemon.html?id=${id}`;
;
    });
  });
}

// Carrega Pokémon com limite e offset
async function loadPokemonItems(offset, limit) {
  if (isLoading) return;
  try {
    isLoading = true;
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Carregando...";

    const pokemons = await pokeApi.getPokemons(offset, limit);
    appendPokemonItems(pokemons);

  } catch (err) {
    console.error(err);
    alert("Ocorreu um erro ao carregar os Pokémon. Tente novamente.");
  } finally {
    isLoading = false;
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Load More";
  }
}

// Primeiro carregamento
loadPokemonItems(offset, limit);

// Clique do botão "Load More"
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItems(offset, limit);
});
