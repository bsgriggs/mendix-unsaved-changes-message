import { ReactElement, createElement } from "react";
import { OnBeforeUnloadPreviewProps } from "../typings/OnBeforeUnloadProps";

export function preview({ block, debugMode }: OnBeforeUnloadPreviewProps): ReactElement {
    return (
        <div className="on-before-unload alert alert-info">
            {(debugMode ? "[DEBUG MODE] " : "") +
                "On Before Unload is blocking browser & tab close based on the expression:  " +
                block}
        </div>
    );
}
