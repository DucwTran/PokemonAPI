let offset = 0;
let numberOfRender = 36;

let Allpokemons = [];
let filteredPokemons = [];

let htmlPokemon = "";
let htmlType = "";

const fetchAPI = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getPokemon() {
    const data = await fetchAPI('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100');
    console.log(data);
    Allpokemons = data.results;
    filteredPokemons = Allpokemons;
    renderPokemons();
}

function getIDPokemon(url) {
    const parts = url.split('/'); 
    return parseInt(parts[parts.length - 2], 10);
}

// Hiển thị danh sách Pokémon
async function renderPokemons() {
    for (let index = offset; index < offset + numberOfRender &&  index < filteredPokemons.length; index++) {
        //Get pokemon
        const pokemon = filteredPokemons[index];

        //Get ID of pokemon
        const ID = getIDPokemon(pokemon.url);

        //Get Types of pokemon
        const typeData = await fetchAPI(pokemon.url);
        htmlType = "";
        typeData.types.forEach(element => {
            htmlType += `
                <div class="types__item ${element.type.name}">${element.type.name}</div>
            `;
        });

        //Get pokemon item
        htmlPokemon += `
            <div class="item">
                <div class="item__id">
                    #${ID}
                </div>
                <div class="item__image" style="background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ID}.png');">
                </div>
                <div class="item__name">
                    ${pokemon.name}
                </div>
                <div class="types">
                    ${htmlType}
                </div>
            </div>
        `;
    }

    const itemPokemon = document.querySelector('.items');
    itemPokemon.innerHTML = htmlPokemon;
    setupLoadMore();
}

function setupLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more');
    if (offset + numberOfRender < filteredPokemons.length) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = () => {
            offset += numberOfRender;
            renderPokemons();
        };
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function searchPokemon(query) {
    htmlPokemon = "";
    if(query === '') {
        filteredPokemons = Allpokemons;
    }
    else{

        filteredPokemons = Allpokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
    }
    offset = 0;
    renderPokemons();
}
const searchInput = document.querySelector('.title__input');
console.log(searchInput)
// Hàm debounce
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
const debouncedSearch = debounce(searchPokemon, 200);
searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    debouncedSearch(query);
});

getPokemon();
