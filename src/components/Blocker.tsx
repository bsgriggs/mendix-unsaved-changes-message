import { ReactElement, createElement, useMemo } from "react";

import { usePositionObserver } from "../utils/usePositionObserver";

import { ScanParents } from "../utils/ScanParents";

interface BlockerProps {
    watchingElement: Element;
    debugMode: boolean;
    watchingClassList: string;
    onClick: () => void;
}

export default function Blocker(props: BlockerProps): ReactElement {
    const position = usePositionObserver(props.watchingElement, true);

    const zIndex = useMemo(() => {
        //Recursively get the z-index so the blocker can be z-index+1
        function CheckZIndex(element: Element): string {
            if (window.getComputedStyle(element).zIndex !== "auto") {
                return (Number(window.getComputedStyle(element).zIndex) + 1).toString();
            } else if (element.parentElement === null || element.matches(".mx-scrollcontainer")) {
                return "1";
            } else {
                return CheckZIndex(element.parentElement);
            }
        }

        return CheckZIndex(props.watchingElement);
    }, [props.watchingElement]);

    const shouldBlockerRender: boolean = useMemo(() => {
        let watchingClassnames = "";
        props.watchingClassList
            ?.trim()
            .split(",")
            .forEach(className => {
                // make sure the classname starts with a period
                watchingClassnames += `${className.startsWith(".") ? className : `.${className}`},`;
            });

        return ScanParents(
            props.watchingElement,
            `${watchingClassnames}.mx-scrollcontainer-open,.mx-scrollcontainer-nested`
        );
    }, [props.watchingClassList, props.watchingElement, position]);

    return (
        <div
            onClick={props.onClick}
            title={
                props.debugMode
                    ? "This element's action is being superseded by the Unsaved Changes Message widget"
                    : undefined
            }
            className="blocker"
            style={{
                display: shouldBlockerRender ? "block" : "none",
                zIndex: zIndex,
                left: position?.x || 0,
                top: position?.y || 0,
                width: position?.width || 0,
                height: position?.height || 0,
                backgroundColor: props.debugMode ? "red" : "white",
                opacity: props.debugMode ? 0.4 : 0
            }}
        ></div>
    );
}
