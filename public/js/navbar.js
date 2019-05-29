$(document).ready(() => {
    var pathname = window.location.pathname;
    if (pathname.startsWith('/blocks/add')) {
        $("#nav-block").addClass("active");
    } else if (pathname.startsWith('/blocks/remove')) {
        $("#nav-remove").addClass("active");
    } else if (pathname.startsWith('/clients')) {
        $("#nav-clients").addClass("active");
    }
});