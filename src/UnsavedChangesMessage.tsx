import { ReactElement, createElement, useState, useEffect, useMemo } from "react";
import { useBeforeunload } from "react-beforeunload";
import { UnsavedChangesMessageContainerProps } from "../typings/UnsavedChangesMessageProps";
import { ActionValue } from "mendix";
import Blocker from "./components/Blocker";
import MxConfirmation from "./utils/MxConfirmation";
import "./ui/UnsavedChangesMessage.css";
import { usePositionObserver } from "./utils/usePositionObserver";

const callMxAction = (action: ActionValue | undefined): void => {
    if (action !== undefined && action.canExecute) {
        action.execute();
    }
};

function ProceedAndClickClickedHtmlItem(
    x: number,
    y: number,
    onProceed: ActionValue | undefined,
    debugMode: boolean
): void {
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
}

function onClickHandler(
    showChoicePopup: boolean,
    x: number,
    y: number,
    bodyText: string,
    proceedCaption: string,
    cancelCaption,
    onProceed: ActionValue | undefined,
    debugMode: boolean
): void {
    if (showChoicePopup) {
        MxConfirmation(bodyText, proceedCaption, cancelCaption, () =>
            ProceedAndClickClickedHtmlItem(x, y, onProceed, debugMode)
        );
    } else {
        ProceedAndClickClickedHtmlItem(x, y, onProceed, debugMode);
    }
}

export function UnsavedChangesMessage({
    block,
    name,
    showChoicePopup,
    debugMode,
    style,
    onChangeBlock,
    watchingClass,
    bodyText,
    cancelCaption,
    proceedCaption,
    onProceed,
    observeMode,
    sidebarClass,
    navigationMenuClass
}: UnsavedChangesMessageContainerProps): ReactElement {
    const [watchingElements, setWatchingElements] = useState<HTMLElement[]>([]);
    const [navbar, setNavbar] = useState<Element | null>(null);
    const blocking = useMemo(() => {
        callMxAction(onChangeBlock);
        return block.value as boolean;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [block.value]);
    const showPopup = useMemo(() => showChoicePopup.value as boolean, [showChoicePopup.value]);

    // get navbar
    if (observeMode !== "browser") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const navbarList = document.getElementsByClassName(sidebarClass);
            if (navbarList.length > 0) {
                setNavbar(navbarList[0]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    }

    const navbarPosition = usePositionObserver(navbar, blocking);

    if (observeMode !== "browser") {
        // retrieve and store elements by class name
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const elements = document.getElementsByClassName(watchingClass);
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
                debugMode && console.warn("No elements found with classname: " + watchingClass);
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
                <p className={`alert alert-${blocking ? "danger" : "info"}`}>
                    {"DEBUG MODE: Unsaved Changes Message is " +
                        (blocking ? "blocking" : "not blocking") +
                        " and " +
                        (showPopup ? "will" : "will not") +
                        " show the popup"}
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
                                navbarWidth={
                                    htmlElement.classList.contains(navigationMenuClass)
                                        ? navbarPosition?.width
                                        : undefined
                                }
                                onClick={(x, y) =>
                                    onClickHandler(
                                        showPopup,
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
