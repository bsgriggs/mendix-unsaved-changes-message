import { ReactElement, createElement, useState, useEffect, useMemo, useCallback } from "react";
import { useBeforeunload } from "react-beforeunload";
import { UnsavedChangesMessageContainerProps } from "../typings/UnsavedChangesMessageProps";
import { ActionValue } from "mendix";
import Blocker from "./components/Blocker";
import MxConfirmation from "./utils/MxConfirmation";
import "./ui/UnsavedChangesMessage.css";
import { DebugLog, Log, LOG_NODE } from "./utils/Logger";
import { createPortal } from "react-dom";

export function UnsavedChangesMessage(props: UnsavedChangesMessageContainerProps): ReactElement {
    const [watchingElements, setWatchingElements] = useState<Element[]>([]);
    const callMxAction = useCallback((action: ActionValue | undefined): void => {
        if (action !== undefined && action.canExecute && !action.isExecuting) {
            action.execute();
        }
    }, []);
    const blocking = useMemo(() => {
        callMxAction(props.onChangeBlock);
        return props.block.value === true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.block.value]); // cannot have props.onchange block param or it will cause an infinite loop when the action gets set to running

    const OnProceedHandler = useCallback(
        (element?: HTMLElement): void => {
            callMxAction(props.onProceed);
            element?.click();
            DebugLog(props.debugMode, "Ran on proceed and clicked element ", element);
        },
        [props.debugMode, props.onProceed, callMxAction]
    );

    const onClickHandler = useCallback(
        (element?: HTMLElement): Promise<boolean> => {
            if (props.showChoicePopup.value === true) {
                return MxConfirmation(
                    props.bodyText.value as string,
                    props.proceedCaption.value as string,
                    props.cancelCaption.value as string,
                    () => {
                        OnProceedHandler(element);
                    },
                    () => {
                        callMxAction(props.onCancel);
                    }
                );
            } else {
                OnProceedHandler(element);
                return new Promise(resolve => resolve(true));
            }
        },
        [
            OnProceedHandler,
            props.showChoicePopup,
            props.bodyText,
            props.proceedCaption,
            props.cancelCaption,
            props.onCancel,
            callMxAction
        ]
    );

    // Browser blocker
    useBeforeunload(
        blocking && (props.observeMode === "both" || props.observeMode === "browser")
            ? event => {
                  event.preventDefault();
                  return props.bodyText.value;
              }
            : undefined
    );

    useEffect(() => {
        if (props.mendixObserveType === "BOTH" || props.mendixObserveType === "JAVASCRIPT_ACTION") {
            // Mount a function that the JavaScript action can all to trigger the popup
            window["unsaved-changes-message"] = (): Promise<boolean> => {
                DebugLog(props.debugMode, `Browser callback with blocking: ${blocking}`);
                if (blocking) {
                    return onClickHandler();
                } else {
                    return new Promise(resolve => resolve(true));
                }
            };

            return () => {
                // On unmount, remove the special function
                window["unsaved-changes-message"] = undefined;
            };
        }
    }, [onClickHandler, blocking, props.debugMode, props.mendixObserveType]);

    useEffect((): void => {
        if (
            (props.observeMode === "both" || props.observeMode === "mendix") &&
            (props.mendixObserveType === "BOTH" || props.mendixObserveType === "CLASS_NAMES")
        ) {
            const newWatchingElements: Element[] = [];

            props.watchingClassList.value
                ?.trim()
                .split(",")
                .forEach(className => {
                    // make sure the classname starts with a period and get the DOM elements
                    document
                        .querySelectorAll(className.startsWith(".") ? className : `.${className}`)
                        .forEach(element => newWatchingElements.push(element));
                });
            if (newWatchingElements.length === 0) {
                Log(LOG_NODE.WARN, `No watching elements found with classname '${props.watchingClassList}'`);
            }

            props.navMenuClassList?.value
                ?.trim()
                .split(",")
                .forEach(className => {
                    const iClassName = className.startsWith(".") ? className : `.${className}`;
                    const navbar = document.querySelector(iClassName);
                    if (navbar !== null) {
                        const newNavBarElements: Element[] = [];
                        navbar.querySelectorAll("li:not(.dropdown) a:not(.dropbox)").forEach(anchor => {
                            newNavBarElements.push(anchor);
                        });
                        if (newNavBarElements.length === 0) {
                            Log(LOG_NODE.WARN, `No nav bar elements found with classname '${iClassName} li a'`);
                        }
                        newWatchingElements.push(...newNavBarElements);
                    }
                });

            DebugLog(props.debugMode, `Found elements to block: `, newWatchingElements);
            setWatchingElements(newWatchingElements);
        }
    }, [props.watchingClassList, props.navMenuClassList, props.observeMode, props.debugMode]);

    return (
        <div id={props.name} style={props.style} className={"unsaved-changes-message"}>
            {props.debugMode && (
                <p className={`alert alert-${blocking ? "danger" : "info"}`}>
                    {"DEBUG MODE: Unsaved Changes Message is " +
                        (blocking ? "blocking" : "not blocking") +
                        " and " +
                        (props.showChoicePopup.value === true ? "will" : "will not") +
                        " show the popup"}
                </p>
            )}
            {(props.observeMode === "both" || props.observeMode === "mendix") &&
                (props.mendixObserveType === "BOTH" || props.mendixObserveType === "CLASS_NAMES") &&
                createPortal(
                    <div className="unsaved-changes-message-element-list">
                        {blocking &&
                            watchingElements.map((htmlElement, index) => (
                                <Blocker
                                    key={index}
                                    watchingElement={htmlElement}
                                    debugMode={props.debugMode}
                                    onClick={() => onClickHandler(htmlElement as HTMLElement)}
                                    watchingClassList={props.watchingClassList.value as string}
                                />
                            ))}
                    </div>,
                    // mount the blockers either inside the popup or inside the mx-page
                    document.querySelector(".modal-content") || document.querySelector(".mx-page") || document.body
                )}
        </div>
    );
}
