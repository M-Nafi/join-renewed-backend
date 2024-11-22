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
    }
}

async function loadDatabaseTasks() {
    const response = await fetch('http://localhost:8000/api/tasks/');
    if (response.ok) {
        const tasks = await response.json();
        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            document.getElementById("board").appendChild(taskCard);
        });
    } else {
        console.error('Fehler beim Laden der Tasks:', response.statusText);
    }
}
