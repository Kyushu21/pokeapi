const team = [];
let previousTeams = [];

document.getElementById("add").addEventListener("click", async function () {
  const pokemonName = document.getElementById("name").value;
  if (team.length >= 6) {
    alert("¡El equipo ya está completo!");
    return;
  }
  try {
    await addPokemonToTeam(pokemonName);
  } catch (error) {
    alert(`Error: Pokémon '${pokemonName}' no encontrado`);
    console.error(error);
  }
});

document.getElementById("reset").addEventListener("click", function () {
  resetTeam();
});

async function getPokemonInfo(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error(`Pokémon '${name}' no encontrado`);
    }
    return response.json();
  } catch (error) {
    throw new Error(
      `Error al obtener información del Pokémon '${name}': ${error.message}`
    );
  }
}

async function addPokemonToTeam(name) {
  try {
    const pokemonData = await getPokemonInfo(name);
    team.push({
      name: pokemonData.name,
      id: pokemonData.id,
      image: pokemonData.sprites.front_default,
      types: pokemonData.types.map((typeObj) => typeObj.type.name).join(", "),
      ability: pokemonData.abilities[0].ability.name,
      baseExperience: pokemonData.base_experience,
    });
    if (team.length >= 6) {
      document.getElementById("add").disabled = true;
    }
  } catch (error) {
    throw new Error(
      `Error al añadir el Pokémon '${name}' al equipo: ${error.message}`
    );
  }
}

function resetTeam() {
  if (team.length === 0) {
    alert("No hay Pokémon en el equipo para reiniciar.");
    return;
  }
  previousTeams.push([...team]);
  team.length = 0;
  document.getElementById("add").disabled = false;
  document.getElementById("pokemonList").innerHTML = "";
}

document.getElementById("showHistory").addEventListener("click", function () {
  if (team.length === 0 && previousTeams.length === 0) {
    alert("No hay equipo por mostrar.");
    return;
  }
  displayTeam();
});

function displayTeam() {
  const sortedTeam = team
    .slice()
    .sort((a, b) => a.baseExperience - b.baseExperience);
  const pokemonListDiv = document.getElementById("pokemonList");
  pokemonListDiv.innerHTML = "<h3>Equipo Actual:</h3>";
  const currentTeamDiv = document.createElement("div");
  currentTeamDiv.classList.add("row", "mb-4");
  for (const pokemon of sortedTeam) {
    const pokemonCard = createPokemonCard(pokemon);
    currentTeamDiv.appendChild(pokemonCard);
  }
  pokemonListDiv.appendChild(currentTeamDiv);

  if (previousTeams.length > 0) {
    for (let i = previousTeams.length - 1; i >= 0; i--) {
      const prevTeam = previousTeams[i];
      const teamCounter = previousTeams.length - i;
      const previousTeamDiv = document.createElement("div");
      previousTeamDiv.classList.add("card", "mb-4");
      previousTeamDiv.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Equipo Anterior ${teamCounter}:</h5>
          <div class="row">
            ${prevTeam
              .map((pokemon) => createPokemonCard(pokemon).outerHTML)
              .join("")}
          </div>
        </div>
      `;
      pokemonListDiv.appendChild(previousTeamDiv);
    }
  }
}

function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("col-md-4", "pokemon-card");
  pokemonCard.innerHTML = `
    <div class="card shadow">
      <div class="card-body">
        <h5 class="card-title pokemon-name">${pokemon.name}</h5>
        <p class="card-text pokemon-id">ID: ${pokemon.id}</p>
        <img src="${pokemon.image}" alt="${pokemon.name}" class="card-img-top pokemon-image">
        <p class="card-text pokemon-type">Tipo: ${pokemon.types}</p>
        <p class="card-text pokemon-ability">Habilidad: ${pokemon.ability}</p>
        <p class="card-text pokemon-experience">Experiencia Base: ${pokemon.baseExperience}</p>
      </div>
    </div>
  `;
  return pokemonCard;
}
