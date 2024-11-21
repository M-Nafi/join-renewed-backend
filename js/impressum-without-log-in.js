async function init(){
    await includeHTML();
    hideMenu()
}

function hideMenu() {
    document.getElementById('menu_sidebar').classList.add('d-none');
    document.getElementById('user_help_section').classList.add('d-none');
}