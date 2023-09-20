const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const typeUrl = 'https://pokeapi.co/api/v2/type/';

const kantoPokemonUrls = []; // Lista de URLs de los Pokémon de Kanto
const pokemonList = document.getElementById('pokemon-list');
const typeSelect = document.getElementById('type-select');

// Obtener las URLs de los Pokémon de Kanto al cargar la página
async function getKantoPokemonUrls() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        kantoPokemonUrls.length = 0; // Limpiar la lista actual

        // Obtener las URLs de los primeros 151 Pokémon (Kanto)
        for (let i = 0; i < 151; i++) {
            kantoPokemonUrls.push(data.results[i].url);
        }

        // Cargar la lista de Pokémon de Kanto
        getPokemon(kantoPokemonUrls);
    } catch (error) {
        console.error('Error al obtener las URLs de los Pokémon de Kanto:', error);
    }
}

// Función para obtener y mostrar Pokémon
async function getPokemon(urls) {
    try {
        // Limpiar la lista de Pokémon antes de agregar nuevos elementos
        pokemonList.innerHTML = '';

        for (const url of urls) {
            const pokemonData = await getPokemonDetails(url);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h2>${pokemonData.name}</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>Tipo: ${pokemonData.types.map((type) => type.type.name).join(', ')}</p>
            `;
            pokemonList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
    }
}

// Función para obtener detalles de un Pokémon
async function getPokemonDetails(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error);
    }
}

// Cargar las URLs de los Pokémon de Kanto al cargar la página
getKantoPokemonUrls();

// Manejar el evento de cambio en el select de filtrado
typeSelect.addEventListener('change', async () => {
    const selectedType = typeSelect.value;
    if (selectedType === 'all') {
        getPokemon(kantoPokemonUrls); // Mostrar todos los Pokémon de Kanto
    } else {
        try {
            const typeResponse = await fetch(typeUrl + selectedType);
            const typeData = await typeResponse.json();
            const typePokemonUrls = typeData.pokemon
                .filter((pokemon) => kantoPokemonUrls.includes(pokemon.pokemon.url))
                .map((pokemon) => pokemon.pokemon.url);
            getPokemon(typePokemonUrls);
        } catch (error) {
            console.error('Error al obtener la lista de Pokémon por tipo:', error);
        }
    }
});
