/**
 * This file was generated from UnsavedChangesMessage.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue } from "mendix";

export type ObserveModeEnum = "mendix" | "browser" | "both";

export type MendixObserveTypeEnum = "CLASS_NAMES" | "JAVASCRIPT_ACTION" | "BOTH";

export interface UnsavedChangesMessageContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    observeMode: ObserveModeEnum;
    block: DynamicValue<boolean>;
    showChoicePopup: DynamicValue<boolean>;
    debugMode: boolean;
    mendixObserveType: MendixObserveTypeEnum;
    watchingSelectors: DynamicValue<string>;
    navMenuSelectors?: DynamicValue<string>;
    bodyText: DynamicValue<string>;
    proceedCaption: DynamicValue<string>;
    cancelCaption: DynamicValue<string>;
    onProceed?: ActionValue;
    onCancel?: ActionValue;
    onChangeBlock?: ActionValue;
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
    showChoicePopup: string;
    debugMode: boolean;
    mendixObserveType: MendixObserveTypeEnum;
    watchingSelectors: string;
    navMenuSelectors: string;
    bodyText: string;
    proceedCaption: string;
    cancelCaption: string;
    onProceed: {} | null;
    onCancel: {} | null;
    onChangeBlock: {} | null;
}
