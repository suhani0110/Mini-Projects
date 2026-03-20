let offset = 0;
const limit = 20;
let api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
const pokemonListDiv = document.getElementById("pokemon-list");
const xpFilter = document.getElementById("xp-filter");
const typeFilter = document.getElementById("type-filter");
const nameFilter = document.getElementById("name-filter");
const loadMoreBtn = document.getElementById("load-more");

let allPokemons = [];
let allTypes = new Set();
let showingSingle = false;

async function fetchPokemons(isLoadMore = false) {
  api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(api);
  const data = await res.json();
  const promises = data.results.map(p => fetch(p.url).then(r => r.json()));
  const newPokemons = await Promise.all(promises);

  if (isLoadMore) {
    allPokemons = allPokemons.concat(newPokemons);
  } else {
    allPokemons = newPokemons;
  }

  allTypes = new Set();
  allPokemons.forEach(p => p.types.forEach(t => allTypes.add(t.type.name)));

  renderTypeOptions();
  renderNameOptions();
  renderPokemons(allPokemons);
}

function renderTypeOptions() {
  typeFilter.innerHTML = `<option value="">Filter by Type</option>`;
  allTypes.forEach(type => {
    typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
  });
}

function renderNameOptions() {
  nameFilter.innerHTML = `<option value="">Filter by Name</option>`;
  allPokemons.forEach(p => {
    nameFilter.innerHTML += `<option value="${p.name}">${p.name}</option>`;
  });
}

function renderPokemons(pokemons) {
  showingSingle = false;
  pokemonListDiv.innerHTML = "";
  if (pokemons.length === 0) {
    pokemonListDiv.innerHTML = "<p>No Pokémon found.</p>";
    return;
  }
  pokemons.forEach(p => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="${p.sprites.front_default}" alt="${p.name}">
      <h3>${p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
      <div>XP: ${p.base_experience}</div>
      <div>
        ${p.types.map(t => `<span class="pokemon-type">${t.type.name}</span>`).join(" ")}
      </div>
    `;
    card.addEventListener("click", () => showSinglePokemon(p));
    pokemonListDiv.appendChild(card);
  });
}

function showSinglePokemon(pokemon) {
  showingSingle = true;
  pokemonListDiv.innerHTML = `
    <div class="pokemon-card" style="margin: 3rem auto; width: 300px; font-size: 1.2rem;">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width:120px;height:120px;">
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <div><strong>XP:</strong> ${pokemon.base_experience}</div>
      <div><strong>Height:</strong> ${pokemon.height}</div>
      <div><strong>Weight:</strong> ${pokemon.weight}</div>
      <div><strong>Types:</strong> ${pokemon.types.map(t => `<span class="pokemon-type">${t.type.name}</span>`).join(" ")}</div>
      <button id="back-btn" style="margin-top:1.5rem;padding:0.5rem 1.5rem;background:#3b4cca;color:#fff;border:none;border-radius:6px;cursor:pointer;">Back</button>
    </div>
  `;
  document.getElementById("back-btn").onclick = () => {
    renderPokemons(allPokemons);
  };
}

function filterPokemons() {
  if (showingSingle) return;
  let filtered = [...allPokemons];

  if (xpFilter.value) {
    filtered = filtered.filter(p => {
      if (xpFilter.value === "low") return p.base_experience < 100;
      if (xpFilter.value === "medium") return p.base_experience >= 100 && p.base_experience <= 200;
      if (xpFilter.value === "high") return p.base_experience > 200;
      return true;
    });
  }

  if (typeFilter.value) {
    filtered = filtered.filter(p => p.types.some(t => t.type.name === typeFilter.value));
  }

  if (nameFilter.value) {
    filtered = filtered.filter(p => p.name === nameFilter.value);
  }

  renderPokemons(filtered);
}

xpFilter.addEventListener("change", filterPokemons);
typeFilter.addEventListener("change", filterPokemons);
nameFilter.addEventListener("change", filterPokemons);

loadMoreBtn.addEventListener("click", () => {
  if (showingSingle) return;
  offset += limit;
  fetchPokemons(true);
});

fetchPokemons();