const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get("id");

if (!pokemonId) {
  alert("ID do Pokémon não informado!");
  throw new Error("ID do Pokémon não informado na URL");
}

const detailContainer = document.getElementById("pokemonDetailContainer");

// Carrega detalhes do Pokémon
async function loadPokemonDetail(id) {
  try {
    // Dados do Pokémon
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json());

    // Dados da espécie e evolução
    const speciesData = await fetch(data.species.url).then(res => res.json());
    const evolutionData = await fetch(speciesData.evolution_chain.url)
      .then(res => res.json());

    detailContainer.innerHTML = `
      <div class="pokemon-card ${data.types[0].type.name}">
        <span class="number">#${String(data.id).padStart(3, "0")}</span>
        <h1 class="name">${data.name}</h1>

        <ol class="types">
          ${data.types.map((t, index) => 
            `<li class="type ${t.type.name}" ${index === 0 ? 'style="filter: brightness(1.1)"' : ''}>
              ${t.type.name}
            </li>`
          ).join("")}
        </ol>

        <img src="${data.sprites.other.dream_world.front_default || 
                    data.sprites.other['official-artwork'].front_default || 
                    data.sprites.front_default}" alt="${data.name}" />

        <div class="tabs">
          <button class="tab-button active" data-tab="about">About</button>
          <button class="tab-button" data-tab="stats">Base Stats</button>
          <button class="tab-button" data-tab="evolution">Evolution</button>
          <button class="tab-button" data-tab="moves">Moves</button>
        </div>

        <div class="tab-content active" id="about">
          <p><strong>Height:</strong> ${data.height / 10} m</p>
          <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
          <p><strong>Base experience:</strong> ${data.base_experience}</p>
        </div>

        <div class="tab-content" id="stats">
          ${data.stats.map(stat => {
            const value = stat.base_stat;
            let color = "red";
            if (value >= 80) color = "blue";
            else if (value >= 50) color = "yellow";
            return `
              <div class="stat-row">
                <span class="stat-name">${stat.stat.name}:</span>
                <span class="stat-value">${value}</span>
                <div class="stat-bar-container">
                  <div class="stat-bar" style="width: ${value}%; background-color: ${color};"></div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="tab-content" id="evolution">
          ${getEvolutionChain(evolutionData.chain)}
        </div>

        <div class="tab-content" id="moves">
          ${data.moves.map(move => `<p>${move.move.name}</p>`).join("")}
        </div>

        <button id="backButton">Back</button>
      </div>
    `;

    initTabs();
    document.getElementById("backButton").addEventListener("click", () => history.back());

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar Pokémon.");
  }
}

// Inicializa abas
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));

      button.classList.add("active");
      const tab = button.getAttribute("data-tab");
      document.getElementById(tab).classList.add("active");
    });
  });
}

// Gera evolução
function getEvolutionChain(chain) {
  const evolutions = [];
  function traverse(node) {
    evolutions.push(node.species.name);
    if (node.evolves_to.length > 0) traverse(node.evolves_to[0]);
  }
  traverse(chain);
  return evolutions.map(name => `<p>${name}</p>`).join("");
}

// Carrega o Pokémon ao abrir a página
loadPokemonDetail(pokemonId);
