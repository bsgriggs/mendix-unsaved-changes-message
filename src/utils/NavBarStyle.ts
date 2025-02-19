export const ToggleNavBarStyle = (enabled: boolean): void => {
    const styleElementID = "unsaved-changes-message-style";
    let style = document.getElementById(styleElementID);
    if (style === undefined || style === null) {
        style = document.createElement("style");
        style.id = styleElementID;
        (style as HTMLStyleElement).type = "text/css";
        document.head.append(style);
    }

    if (enabled) {
        style.innerHTML = `
.mx-scrollcontainer-wrapper:not(:has(.mx-scrollcontainer-open)) .mx-scrollcontainer-wrapper {
    width: auto !important;
}

.mx-scrollcontainer-wrapper:not(:has(.mx-scrollcontainer-open)) .mx-scrollcontainer-wrapper .mx-navigationtree > .navbar-inner > ul > li > a {
    padding: 0 !important;
}`;
    } else {
        style.innerHTML = "";
    }
};
