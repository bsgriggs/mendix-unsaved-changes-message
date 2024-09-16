import { ReactElement, createElement, MouseEvent } from "react";

import { usePositionObserver } from "../utils/usePositionObserver";

interface BlockerProps {
    watchingElement: Element;
    showChoicePopup: boolean;
    debugMode: boolean;
    navbarWidth: number | undefined;
    onClick: (x: number, y: number) => void;
}

export default function Blocker({ watchingElement, debugMode, onClick, navbarWidth }: BlockerProps): ReactElement {
    const position = usePositionObserver(watchingElement, true);
    return (
        <div
            onClick={(event: MouseEvent) => {
                // eslint-disable-next-line no-unused-expressions
                debugMode && console.info("blocker on click", { x: event.clientX, y: event.clientY });
                onClick(event.clientX, event.clientY);
            }}
            title={
                debugMode
                    ? "This element's action is being superseded by the Unsaved Changes Message widget"
                    : undefined
            }
            className="blocker"
            style={{
                left: position?.x || 0,
                top: position?.y || 0,
                width: navbarWidth ? navbarWidth : position?.width || 0,
                height: position?.height || 0,
                backgroundColor: debugMode ? "red" : "white",
                opacity: debugMode ? 0.6 : 0
            }}
        ></div>
    );
}
