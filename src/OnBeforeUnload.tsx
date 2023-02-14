import { ReactElement, createElement, useState, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import { OnBeforeUnloadContainerProps } from "../typings/OnBeforeUnloadProps";
import { ValueStatus, ActionValue } from "mendix";
import AdviceFunction from "./utils/AdviceFunction";

const callMxAction = (action: ActionValue | undefined): void => {
    if (action !== undefined && action.canExecute) {
        action.execute();
    }
};

export function OnBeforeUnload({
    block,
    name,
    debugMode,
    style,
    onChangeBlock,
    watchingClassName,
    onDiscard
}: OnBeforeUnloadContainerProps): ReactElement {
    const [blocking, setBlocking] = useState<boolean>(false);

    useEffect(() => {
        if (block.status === ValueStatus.Available && block.value !== blocking) {
            setBlocking(block.value as boolean);
            callMxAction(onChangeBlock);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [block.value]);

    useEffect(()=>{
        const elements = Array.from(document.getElementsByClassName(watchingClassName));
        console.info("elements", elements);
        elements.forEach((element)=>{
            const htmlElement = element as HTMLElement;
            AdviceFunction(htmlElement.click, blocking, "Are you sure", "Discard",onDiscard,"Cancel" );
        });
    }, [])

    useBeforeunload(event => {
        if (blocking) {
            event.preventDefault();
        }
    });

    return debugMode ? (
        <div id={name} style={style} className={`on-before-unload alert alert-${blocking ? "danger" : "warning"}`}>
            {"On Before Unload is currently " + (blocking ? "blocking" : "not blocking")}
        </div>
    ) : (
        <div id={name} style={style} className="on-before-unload" />
    );
}
