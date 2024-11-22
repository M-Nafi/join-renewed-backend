let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("find_task").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
        }
    });
});

function startDragging(id) {
    currentDraggedElement = id; 
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(bucket) {
    if (!currentDraggedElement) {
        console.error('Kein gültiges Element zum Verschieben gefunden.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${currentDraggedElement}/update/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bucket })  
        });
        if (!response.ok) {
            console.error('Fehler beim Aktualisieren:', response.status, response.statusText);
            return;
        }
        await loadAddedTasksFromStorage();  
        loadBoard();  
    } catch (error) {
        console.error('Fehler beim Verschieben:', error);
    }
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

