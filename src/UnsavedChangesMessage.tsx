import { ReactElement, createElement, useState, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import { UnsavedChangesMessageContainerProps } from "../typings/UnsavedChangesMessageProps";
import { ValueStatus, ActionValue } from "mendix";
import Blocker from "./components/Blocker";
import MxConfirmation from "./utils/MxConfirmation";
import "./ui/UnsavedChangesMessage.css";

const callMxAction = (action: ActionValue | undefined): void => {
    if (action !== undefined && action.canExecute) {
        action.execute();
    }
};

function onClickHandler(
    x: number,
    y: number,
    bodyText: string,
    proceedCaption: string,
    cancelCaption,
    onProceed: ActionValue | undefined,
    debugMode: boolean
): void {
    if (onProceed && onProceed.canExecute) {
        MxConfirmation(bodyText, proceedCaption, cancelCaption, () => {
            callMxAction(onProceed);
            const elementsAtPoint = document.elementsFromPoint(x, y);
            if (elementsAtPoint.length > 1) {
                // should be at least 2 elements, the temp element from this widget and the original element
                const htmlElement = elementsAtPoint[1] as HTMLElement;
                // eslint-disable-next-line no-unused-expressions
                debugMode && console.info("clicking element: ", htmlElement);
                htmlElement.click();
            } else {
                // eslint-disable-next-line no-unused-expressions
                debugMode && console.warn("No elements found under the points: {x: " + x + ", y: " + y + "}");
            }
        });
    } else {
        // eslint-disable-next-line no-unused-expressions
        debugMode && console.warn("No permission to execute the onProceed action");
    }
}

export function OnBeforeUnload({
    block,
    name,
    debugMode,
    style,
    onChangeBlock,
    watchingClassName,
    bodyText,
    cancelCaption,
    proceedCaption,
    onProceed,
    observeMode
}: UnsavedChangesMessageContainerProps): ReactElement {
    const [blocking, setBlocking] = useState<boolean>(false);
    const [watchingElements, setWatchingElements] = useState<HTMLElement[]>([]);

    // maintain blocking status
    useEffect(() => {
        if (block.status === ValueStatus.Available && block.value !== blocking) {
            setBlocking(block.value as boolean);
            callMxAction(onChangeBlock);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [block.value]);

    if (observeMode !== "browser") {
        // retrieve and store elements by class name
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const elements = document.getElementsByClassName(watchingClassName);
            if (elements.length > 0) {
                const elementsArray = Array.from(elements);
                // eslint-disable-next-line no-unused-expressions
                debugMode && console.info("found elements", elementsArray);
                const newWatchingElements: HTMLElement[] = [];
                elementsArray.forEach(element => {
                    const htmlElement = element as HTMLElement;
                    newWatchingElements.push(htmlElement);
                });
                setWatchingElements(newWatchingElements);
            } else {
                setWatchingElements([]);
                // eslint-disable-next-line no-unused-expressions
                debugMode && console.warn("No elements found with classname: " + watchingClassName);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [blocking]);
    }

    if (observeMode !== "mendix") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useBeforeunload(event => {
            if (blocking) {
                event.preventDefault();
            }
        });
    }

    return (
        <div id={name} style={style} className={"unsaved-changes-message"}>
            {debugMode && (
                <p className={`alert alert-${blocking ? "danger" : "warning"}`}>
                    {"On Before Unload is currently " + (blocking ? "blocking" : "not blocking")}
                </p>
            )}
            {observeMode !== "browser" && (
                <div className="element-list">
                    {blocking &&
                        watchingElements.map((htmlElement, index) => (
                            <Blocker
                                key={index}
                                watchingElement={htmlElement}
                                debugMode={debugMode}
                                onClick={(x, y) =>
                                    onClickHandler(
                                        x,
                                        y,
                                        bodyText.value as string,
                                        proceedCaption.value as string,
                                        cancelCaption.value as string,
                                        onProceed,
                                        debugMode
                                    )
                                }
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
