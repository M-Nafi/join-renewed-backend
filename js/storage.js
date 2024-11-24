const STORAGE_URL = 'http://localhost:8000/api/storage'; 

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * contactCircleColors.length);
    return contactCircleColors[randomIndex];
}

let contactCircleColors = [
    "#FF5733",   
    "#33FF57",   
    "#3357FF",   
    "#FF33A1",  
    "#FFD700",   
    "#800080",   
    "#008080",   
    "#FF6347",   
    "#C71585",   
    "#4682B4",   
    "#32CD32",   
    "#B22222",   
    "#D2691E",   
    "#ADFF2F",   
    "#FF4500",   
    "#FF1493",   
];

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

        contactsData = newContacts.map(contact => {
            if (!contact.bgcolor) {
                contact.bgcolor = getRandomColor();
            }
            return {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                bgcolor: contact.bgcolor, 
            };
        }).sort((a, b) => a.name.localeCompare(b.name)); 
    }
}



// async function loadDatabaseContacts() {
//     try {
//         const response = await fetch('http://127.0.0.1:8000/api/contacts/');
//         if (response.ok) {
//             const newContacts = await response.json();

//             contactsData = newContacts.map(contact => {
//                 // Falls keine Hintergrundfarbe gesetzt ist, generiere eine zufällige Farbe
//                 if (!contact.bgcolor) {
//                     contact.bgcolor = getRandomColor();
//                 }
//                 return {
//                     id: contact.id,
//                     name: contact.name,
//                     email: contact.email,
//                     phone: contact.phone,
//                     bgcolor: contact.bgcolor, 
//                 };
//             }).sort((a, b) => a.name.localeCompare(b.name)); // Kontakte nach Namen sortieren

//             console.log("Contacts erfolgreich geladen:", contactsData);
//         } else {
//             console.error("Fehler beim Laden der Kontakte:", response.statusText);
//         }
//     } catch (error) {
//         console.error("Netzwerkfehler beim Laden der Kontakte:", error);
//     }
// }



async function loadDatabaseTasks() {
    const response = await fetch('http://localhost:8000/api/tasks/');
    if (response.ok) {
        const tasks = await response.json();
        for (const task of tasks) {
            const color = await getUserColor(task.userId); 
            task.bgcolor = color; 
            const taskCard = createTaskCard(task);
            document.getElementById("board").appendChild(taskCard);
        }
    } else {
        console.error('Fehler beim Laden der Tasks:', response.statusText);
    }
}


