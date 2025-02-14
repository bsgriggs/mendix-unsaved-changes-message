/* eslint-disable no-unused-vars */
export enum LOG_NODE {
    DEBUG,
    WARN,
    ERROR
}

const logPrefix = "UnsavedChangesMessage - ";
export function DebugLog(debugMode: boolean, message: string, ...optionalParams: any[]): void {
    if (debugMode) {
        console.info(logPrefix + message, ...optionalParams);
    }
}

export function Log(logNode: LOG_NODE, message: string, ...optionalParams: any[]): void {
    if (logNode === LOG_NODE.WARN) {
        console.warn(logPrefix + message, ...optionalParams);
    } else if (logNode === LOG_NODE.ERROR) {
        console.error(logPrefix + message, ...optionalParams);
    }
}
