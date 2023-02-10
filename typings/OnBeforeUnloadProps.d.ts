/**
 * This file was generated from OnBeforeUnload.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue } from "mendix";

export interface OnBeforeUnloadContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    block: DynamicValue<boolean>;
    debugMode: boolean;
    onChangeBlock?: ActionValue;
}

export interface OnBeforeUnloadPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    block: string;
    debugMode: boolean;
    onChangeBlock: {} | null;
}
