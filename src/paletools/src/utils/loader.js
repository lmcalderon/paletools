export function displayLoader() {
    $(".ut-click-shield").addClass("showing");
    $(".loaderIcon ").css("display", "block");
};

export function hideLoader() {
    $(".ut-click-shield").removeClass("showing");
    $(".loaderIcon ").css("display", "none");
};