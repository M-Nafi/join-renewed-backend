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


