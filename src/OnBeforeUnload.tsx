import { ReactElement, createElement, useState, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import { OnBeforeUnloadContainerProps } from "../typings/OnBeforeUnloadProps";
import { ValueStatus, ActionValue } from "mendix";

const callMxAction = (action: ActionValue | undefined): void => {
  if (action !== undefined && action.canExecute) {
      action.execute();
  }
};

export function OnBeforeUnload({ block, name, debugMode, style, onChangeBlock }: OnBeforeUnloadContainerProps): ReactElement {
    const [blocking, setBlocking] = useState<boolean>(false);

    useEffect(() => {
        if (block.status === ValueStatus.Available && block.value !== blocking) {
            setBlocking(block.value as boolean);
            callMxAction(onChangeBlock);
        }
    }, [block.value]);

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
