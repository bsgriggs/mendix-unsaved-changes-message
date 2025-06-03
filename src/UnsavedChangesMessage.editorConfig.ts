import { UnsavedChangesMessagePreviewProps } from "../typings/UnsavedChangesMessageProps";
import { hidePropertiesIn } from "./utils/PageEditorUtils";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

export type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

export type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    _values: UnsavedChangesMessagePreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    if (_values.observeMode === "browser") {
        hidePropertiesIn(defaultProperties, _values, [
            "watchingSelectors",
            "bodyText",
            "proceedCaption",
            "cancelCaption",
            "onProceed",
            "navMenuSelectors",
            "mendixObserveType",
            "showPopup",
            "popupType",
            "checkPopupInterval"
        ]);
    }

    if (_values.mendixObserveType === "JAVASCRIPT_ACTION") {
        hidePropertiesIn(defaultProperties, _values, ["watchingSelectors", "navMenuSelectors"]);
    }

    if (_values.popupType === "MXCONFIRM") {
        hidePropertiesIn(defaultProperties, _values, ["showPopup", "checkPopupInterval"]);
    } else {
        hidePropertiesIn(defaultProperties, _values, ["bodyText", "proceedCaption", "cancelCaption"]);
    }

    return defaultProperties;
}

export function check(_values: UnsavedChangesMessagePreviewProps): Problem[] {
    const errors: Problem[] = [];
    // Add errors to the above array to throw errors in Studio and Studio Pro.
    if (_values.checkPopupInterval === null || _values.checkPopupInterval < 50) {
        errors.push({
            property: `checkPopupInterval`,
            message: `Check popup interval must be greater than or equal to 50.`,
            url: "https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/master/README.md"
        });
    }

    if (_values.popupType === "MXCONFIRM" && _values.onProceed === null) {
        errors.push({
            property: `onProceed`,
            message: `On proceed is required. It should rollback the object with unsaved changes.`,
            url: "https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/master/README.md"
        });
    }

    if (_values.popupType === "CUSTOM" && _values.showPopup === null) {
        errors.push({
            property: `showPopup`,
            message: `Show popup is required.`,
            url: "https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/master/README.md"
        });
    }

    return errors;
}

// export function getPreview(values: OnBeforeUnloadPreviewProps, isDarkMode: boolean): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: OnBeforeUnloadPreviewProps, platform: Platform): string {
//     return "OnBeforeUnload";
// }
