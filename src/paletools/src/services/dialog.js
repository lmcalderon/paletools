export function openDialog(options, title, message, onSelect) {
    const dialog = new EADialogViewController({
        dialogOptions: options,
        message,
        title,
    });

    dialog.init();
    dialog.onExit.observe(this, function (e, t) {
        e.unobserve(this);
        if(onSelect) {
            onSelect.call(this, t);
        }
    });
    gPopupClickShield.setActivePopup(dialog);
};