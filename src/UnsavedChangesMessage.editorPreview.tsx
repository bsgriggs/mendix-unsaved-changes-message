import { ReactElement, createElement } from "react";
import { UnsavedChangesMessagePreviewProps } from "../typings/UnsavedChangesMessageProps";

export function preview({ block, debugMode, showChoicePopup }: UnsavedChangesMessagePreviewProps): ReactElement {
    return (
        <div className={`on-before-unload alert ${debugMode ? "alert-danger" : "alert-info"}`}>
            {`${
                debugMode ? "[DEBUG MODE] " : ""
            }On Before Unload is blocking based on the expression '${block}' and will/will not show the popup based the expression '${showChoicePopup}'`}
        </div>
    );
}
