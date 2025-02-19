import { ReactElement, createElement, useState, useEffect, useMemo, useCallback } from "react";
import { useBeforeunload } from "react-beforeunload";
import { UnsavedChangesMessageContainerProps } from "../typings/UnsavedChangesMessageProps";
import { ActionValue } from "mendix";
import Blocker from "./components/Blocker";
import MxConfirmation from "./utils/MxConfirmation";
import "./ui/UnsavedChangesMessage.css";
import { DebugLog, Log, LOG_NODE } from "./utils/Logger";
import { ToggleNavBarStyle } from "./utils/NavBarStyle";

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

    useEffect(() => {
        if (
            (props.observeMode === "both" || props.observeMode === "mendix") &&
            (props.mendixObserveType === "BOTH" || props.mendixObserveType === "CLASS_NAMES")
        ) {
            ToggleNavBarStyle(true);
            const newWatchingElements: Element[] = [];

            props.watchingSelectors.value
                ?.trim()
                .split(",")
                .forEach(className => {
                    document.querySelectorAll(className).forEach(element => newWatchingElements.push(element));
                });
            if (newWatchingElements.length === 0) {
                Log(LOG_NODE.WARN, `No watching elements found with classname '${props.watchingSelectors}'`);
            }

            props.navMenuSelectors?.value
                ?.trim()
                .split(",")
                .forEach(className => {
                    document.querySelectorAll(className).forEach(element => newWatchingElements.push(element));
                });

            DebugLog(props.debugMode, `Found elements to block: `, newWatchingElements);
            setWatchingElements(newWatchingElements);
        }
        return () => {
            ToggleNavBarStyle(false);
        };
    }, [props.watchingSelectors, props.navMenuSelectors, props.observeMode, props.debugMode, props.mendixObserveType]);

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
                (props.mendixObserveType === "BOTH" || props.mendixObserveType === "CLASS_NAMES") && (
                    <div className="unsaved-changes-message-element-list">
                        {blocking &&
                            watchingElements.map((htmlElement, index) => (
                                <Blocker
                                    key={index}
                                    watchingElement={htmlElement}
                                    debugMode={props.debugMode}
                                    onClick={() => onClickHandler(htmlElement as HTMLElement)}
                                    watchingClassList={props.watchingSelectors.value as string}
                                    navClassList={props.navMenuSelectors?.value as string}
                                />
                            ))}
                    </div>
                )}
        </div>
    );
}
