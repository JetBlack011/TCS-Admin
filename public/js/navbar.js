$(document).ready(() => {
    var pathname = window.location.pathname;
    if (pathname.startsWith('/blocks/add')) {
        $("#nav-block").addClass("active");
    } else if (pathname.startsWith('/blocks/remove')) {
        $("#nav-remove").addClass("active");
    } else if (pathname.startsWith('/clients')) {
        $("#nav-clients").addClass("active");
    } else if (pathname.startsWith('/blocks/list')) {
        $("#nav-list").addClass("active");
    } else if (pathname.startsWith('/users/register') || pathname.startsWith('/users/delete') || pathname.startsWith('/users/reset')) {
        $("#admin-dropdown").addClass("active");
    }
});