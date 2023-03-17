/**
 * This file was generated from SLTimeInput.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface SLTimeInputContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    value: EditableValue<Big | Date>;
    mendixFeedback: boolean;
    invalidMessage: DynamicValue<string>;
    instructionMessage: DynamicValue<string>;
}

export interface SLTimeInputPreviewProps {
    readOnly: boolean;
    value: string;
    onValueChange: {} | null;
    mendixFeedback: boolean;
    invalidMessage: string;
    instructionMessage: string;
}
