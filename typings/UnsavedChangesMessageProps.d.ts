/**
 * This file was generated from UnsavedChangesMessage.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue } from "mendix";

export type ObserveModeEnum = "mendix" | "browser" | "both";

export interface UnsavedChangesMessageContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    observeMode: ObserveModeEnum;
    block: DynamicValue<boolean>;
    debugMode: boolean;
    watchingClassName: string;
    onProceed?: ActionValue;
    onChangeBlock?: ActionValue;
    bodyText: DynamicValue<string>;
    proceedCaption: DynamicValue<string>;
    cancelCaption: DynamicValue<string>;
}

export interface UnsavedChangesMessagePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    observeMode: ObserveModeEnum;
    block: string;
    debugMode: boolean;
    watchingClassName: string;
    onProceed: {} | null;
    onChangeBlock: {} | null;
    bodyText: string;
    proceedCaption: string;
    cancelCaption: string;
}
