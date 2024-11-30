function frameSlideIn(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element mit der ID "${id}" wurde nicht gefunden.`);
        return;
    }
    element.classList.remove("slide-out");
    element.classList.add("slide-in");
}


function frameSlideOut(id) {
    document.getElementById(id).classList.remove("slide-in");
    document.getElementById(id).classList.add("slide-out");
}

function addOverlayBg(id) {
    document.getElementById(id).classList.add("slider-bg");
    document.getElementById(id).classList.remove("slider-center");
}

function removeOverlayBg(id) {
    document.getElementById(id).classList.remove("slider-bg");
    document.getElementById(id).classList.add("slider-center");
}

function addFixedBackround(id) {
    document.getElementById(id).classList.add("pos-fixed");
}

function removeFixedBackround(id) {
    document.getElementById(id).classList.remove("pos-fixed");
}

async function hideTaskOpen(id) {
    // Sicherstellen, dass das Element existiert
    const overlayElement = document.getElementById(id);
    if (!overlayElement) {
        console.error(`Element mit ID ${id} nicht gefunden!`);
        return;
    }

    loadBoard();
    frameSlideOut(id);
    removeFixedBackround("main_container_board");
    show("sub_menu");
    removeOverlayBg("task_overlay_bg");

    setTimeout(function () {
        hide("task_overlay_bg");
    }, 400);

    // Fetch-Anfragen
    for (let task of addedTasks) {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${task.id}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                return;
            }
        } catch (error) {
            console.error(`Netzwerkfehler beim Aktualisieren von Task ${task.id}:`, error);
        }
    }
}

function addFixedBackground(id) {
    document.getElementById(id).classList.add("pos-fixed");
}

function removeFixedBackround(id) {
    document.getElementById(id).classList.remove("pos-fixed");
}

