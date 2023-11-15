const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

// Vector para almacenar los usuarios
let userList = getStoredUsers();

// Obtenemos la lista de usuarios si la hay almacenada en LocalStorage o comenzamos a crearla
getUserListOrRandomUser();
// Obtenemos la cuantía total o la calculamos si no la hay almacenada
getTotalWealthOrCalculate();

/*  Función que obtiene de la API un nombre aleatorio,
    genera una cantidad de dinero aleatoria cuyo máximo es 1.000.000
    y añade al usuario con ambos datos */
async function getRandomUser() {
    let res = await fetch('https://randomuser.me/api');
    let data = await res.json();
    let user = data.results[0];

    // TODO: Crea un objeto usuario (newUser) que tenga como atributos: name y money
    let newUser = {
        name: `${user.name.first} ${user.name.last}`, //nombre obtenido de la API
        money: Math.random() * 1000000 // Dinero aleatorio entre 1 y 1.000.000
    };
    addData(newUser);
}

// Obtenemos la lista de usuarios almacenada en LocalStorage si la hay
function getUserListOrRandomUser() {
    userList = getStoredUsers();

    // Si la lista de usuarios de LocalStorage está vacía, comenzamos a obtener usuarios
    if (userList.length === 0) {
        getRandomUser();
    } else {
        // Si hay usuarios almacenados, actualizamos el DOM con la lista existente
        updateDOM();
    }
}

// TODO: Función que añade un nuevo usuario (objeto) al listado de usuarios (array)
function addData(obj) {
    userList.push(obj);

    // Actualizamos el DOM
    updateDOM();

    // Introducimos la userList actualizada en nuestro LocalStorage
    storageUsers(userList);
}


// TODO: Función que dobla el dinero de todos los usuarios existentes
function doubleMoney() {
    // TIP: Puedes usar map()
    // Por cada usuario creado, vamos a mostrar su nombre y el doble de su dinero actual
    userList = userList.map(user => {
        return {
            name: user.name,
            money: user.money * 2
        };
    });
    // Actualizamos el DOM después de duplicar el dinero
    updateDOM();
}

// TODO: Función que ordena a los usuarios por la cantidad de dinero que tienen
function sortByRichest() {
    // TIP: Puedes usar sort()
    userList.sort((a, b) => b.money - a.money);
    updateDOM();
}

// TODO: Función que muestra únicamente a los usuarios millonarios (tienen más de 1.000.000)
function showMillionaires() {
    // TIP: Puedes usar filter()
    let millionaires = userList.filter(user => user.money >= 1000000);
    // Actualizamos la lista de usuarios solo con los millonarios
    userList = millionaires;
    // Actualizamos el DOM para mostrar solo a los millonarios
    updateDOM();
}

// TODO: Función que calcula y muestra el dinero total de todos los usuarios
function calculateWealth() {
    // TIP: Puedes usar reduce ()
    // Vamos sumando el dinero de cada usuario a un total, partiendo desde 0
    let totalWealth = userList.reduce((total, user) => total + user.money, 0);

    // Mostramos el resultado debajo del listado de usuarios
    let wealthElement = document.createElement('div');
    wealthElement.innerHTML = `<h3>Dinero Total: <strong>${formatMoney(totalWealth)}</strong></h3>`;
    main.appendChild(wealthElement);

    // Almacenamos el totalWealth en el LocalStorage
    localStorage.setItem('totalWealthStorage', totalWealth);
}

// Función para obtener el totalWealth almacenado en el LocalStorage
function getStoredTotalWealth() {
    let storedTotalWealth = localStorage.getItem('totalWealthStorage');
    return storedTotalWealth ? parseFloat(storedTotalWealth) : 0;
}

// Función para obtener el totalWealth almacenado si se encuentra o calcularlo
function getTotalWealthOrCalculate() {
    let totalWealth = getStoredTotalWealth();

    // Si no hay totalWealth almacenado, calculamos el total
    if (totalWealth === 0) {
        calculateWealth();
    }
}


// TODO: Función que actualiza el DOM
function updateDOM() {
    // TIP: Puedes usar forEach () para actualizar el DOM con cada usuario y su dinero
    main.innerHTML = '<h2><strong>Persona</strong> Dinero</h2>';

    // Por cada usuario del vector, vamos a crear un div al que le daremos la clase person e introduciremos el nombre del user creado y su dinero formateado
    userList.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('person');
        userElement.innerHTML = `<strong>${user.name}</strong> ${formatMoney(user.money)}`;
        main.appendChild(userElement);
    });
}

// Función que formatea un número a dinero
function formatMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '€';
}


// Función para guardar los usuarios en LocalStorage
function storageUsers(newUserList) {
    let newUserListToJSON = JSON.stringify(newUserList);
    localStorage.setItem('userListStorage', newUserListToJSON);
}

// Función para obtener la lista de usuarios almacenada en el LocalStorage, si no hay nada la devuelve vacía
function getStoredUsers() {
    let storedUsersJSON = localStorage.getItem('userListStorage');
    return storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
}

// TODO: Event listeners
addUserBtn.addEventListener("click", () => {
    getRandomUser();
    storageUsers(userList); // Actualizamos el LocalStorage al añadir un usuario
});
doubleBtn.addEventListener("click", () => {
    doubleMoney();
    storageUsers(userList); // Actualizamos el LocalStorage al duplicar el dinero
});
showMillionairesBtn.addEventListener("click", () => {
    showMillionaires();
    storageUsers(userList); // Actualizamos el LocalStorage al mostrar millonarios
});
sortBtn.addEventListener("click", () => {
    sortByRichest();
    storageUsers(userList); // Actualizamos el LocalStorage al ordenar los usuarios
});
calculateWealthBtn.addEventListener("click", () => {
    calculateWealth();
    storageUsers(userList); // Actualizamos el LocalStorage del total de dinero calculado
});