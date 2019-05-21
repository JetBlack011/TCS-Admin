$(document).ready(() => {
    switch (window.location.pathname) {
    case '/blocks/add':
        $("#nav-block").addClass("active")
        break
    case '/blocks/remove':
        $("#nav-remove").addClass("active")
    }
})