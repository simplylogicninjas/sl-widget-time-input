import { createElement } from "react";

interface Props {
    visible: boolean;
    applyBtnClassName: string;
    onApplyBtnClick: () => void;
    cancelBtnClassName: string;
    onCancelBtnClick: () => void;
}

const Actions = ({
    visible,
    applyBtnClassName,
    onApplyBtnClick,
    cancelBtnClassName,
    onCancelBtnClick
}: Props) => {
    return (
        <div className={`sl-timeinput-actions ${visible ? 'is-visible' : 'is-hidden'}`}>
            <button
                className={`btn sl-timeinput-btn ${applyBtnClassName}`}
                aria-label="Apply input change"
                onClick={onApplyBtnClick}
            />
            <button
                className={`btn sl-timeinput-btn ${cancelBtnClassName}`}
                aria-label="Cancel input change"
                onClick={onCancelBtnClick}
            />
        </div>
    )
}

export default Actions;