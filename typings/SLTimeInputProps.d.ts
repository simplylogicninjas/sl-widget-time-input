/**
 * This file was generated from SLTimeInput.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, EditableValue, WebIcon } from "mendix";
import { Big } from "big.js";

export interface SLTimeInputContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    value: EditableValue<Big | Date>;
    mendixFeedback: boolean;
    invalidMessage: DynamicValue<string>;
    instructionMessage: DynamicValue<string>;
    enableActions: boolean;
    applyAction?: ActionValue;
    applyBtnClass?: DynamicValue<string>;
    applyBtnIcon?: DynamicValue<WebIcon>;
    cancelAction?: ActionValue;
    cancelBtnClass?: DynamicValue<string>;
    cancelBtnIcon?: DynamicValue<WebIcon>;
}

export interface SLTimeInputPreviewProps {
    readOnly: boolean;
    value: string;
    onValueChange: {} | null;
    mendixFeedback: boolean;
    invalidMessage: string;
    instructionMessage: string;
    enableActions: boolean;
    applyAction: {} | null;
    applyBtnClass: string;
    applyBtnIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    cancelAction: {} | null;
    cancelBtnClass: string;
    cancelBtnIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
}
