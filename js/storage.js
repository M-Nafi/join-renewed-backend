// ALTE funktion OHNE backend

// const STORAGE_TOKEN = 'CIEVHNM0XX863NLG0FAFWLL9NBEWOL7NM5VP7VCZ';
// const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


// /**
//  * Set an item in remote storage.
//  * @param {string} key - The key of the item to be stored.
//  * @param {any} value - The value of the item to be stored.
//  * @returns {Promise<Object>} A Promise that resolves to the response from the server.
//  */
// async function setItem(key, value) {
//     const payload = { key, value, token: STORAGE_TOKEN };
//     return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((res) => res.json());
// }

// /**
//  * Retrieve an item from remote storage.
//  * @param {string} key - The key of the item to be retrieved.
//  * @returns {Promise<any>} A Promise that resolves to the value of the retrieved item.
//  * @throws {string} Throws an error if the data with the specified key is not found.
//  */
// async function getItem(key) {
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     return fetch(url)
//         .then(res => res.json())
//         .then(res => {
//             // Improved code
//             if (res.data) {
//                 return res.data.value;
//             }
//             throw `Could not find data with key "${key}".`;
//         });
// }

// NEUE funktion MIT backend

const STORAGE_URL = 'http://localhost:8000/api/storage'; 
 
async function setItem(key, value) {
    const payload = { key, value };
    return fetch(`${STORAGE_URL}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then((res) => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}/${key}/`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                return res.data.value;
            }
            throw `Could not find data with key "${key}".`;
        });
}


async function loadDatabaseContacts() {
    const response = await fetch('http://localhost:8000/api/contacts/');
    if (response.ok) {
        const newContacts = await response.json();
        
        contactsData = newContacts.map(contact => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            bgcolor: getRandomColor(),
        })).sort((a, b) => a.name.localeCompare(b.name)); 

        console.log("Geladene und sortierte Kontakte:", contactsData); 
        
        // renderDifferentContacts(); // Zeige die Kontakte an 
    }
}

// async function loadDatabaseTasks() {
//     const response = await fetch('http://localhost:8000/api/tasks/');
//     if (response.ok) {
//         const tasks = await response.json();
//         tasks.forEach(task => {
//             const taskCard = createTaskCard(task);
//             document.getElementById("board").appendChild(taskCard); 
//         });
//     } else {
//         console.error('Fehler beim Laden der Tasks:', response.statusText);
//     }
// }  

async function loadDatabaseTasks() {
    const response = await fetch('http://localhost:8000/api/tasks/');
    if (response.ok) {
        const tasks = await response.json();
        console.log("Tasks geladen:", tasks); // Füge Debugging hinzu
        tasks.forEach(task => {
            console.log("Aktuelle Task:", task);
            const taskCard = createTaskCard(task);
            document.getElementById("board").appendChild(taskCard);
        });
    } else {
        console.error('Fehler beim Laden der Tasks:', response.statusText);
    }
}
