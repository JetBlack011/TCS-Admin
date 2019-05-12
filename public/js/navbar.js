$(document).ready(() => {
    switch (window.location.pathname) {
    case '/blocks/add':
        $("#navBlock").addClass("active")
        break
    case '/blocks/remove':
        $("#navRemove").addClass("active")
        break
    case '/logout':
        $("#navLogout").addClass("active")
    }
})