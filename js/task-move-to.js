let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("find_task").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            //searchTask();
        }
    });
});

function startDragging(id) {
    console.log(`Dragging gestartet: ${id}`);
    currentDraggedElement = id; // ID des Elements speichern
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
        // PATCH-Request zum Backend senden
        const response = await fetch(`http://localhost:8000/api/tasks/${currentDraggedElement}/update/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bucket })  // Task mit neuem "bucket" speichern
        });

        if (!response.ok) {
            console.error('Fehler beim Aktualisieren:', response.status, response.statusText);
            return;
        }

        console.log(`Task ${currentDraggedElement} erfolgreich verschoben nach ${bucket}`);

        // Nach dem Update das Board mit den neuesten Daten neu laden
        await loadAddedTasksFromStorage();  // Lädt die neuesten Tasks
        loadBoard();  // Board aktualisieren

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

