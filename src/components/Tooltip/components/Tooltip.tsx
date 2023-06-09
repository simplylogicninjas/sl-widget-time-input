import React, { ReactElement, ReactNode, useEffect, createElement, useState, useRef } from "react";
import { useDelayVisible } from "../hooks/useDelayVisible";
import { eventInsideTarget } from "../utils/eventInsideTarget";
import { eventOutsideTarget } from "../utils/eventOutsideTarget";
import Popper, { PopoverRef } from "./Popper";

interface Props {
    name?: string;
    className?: string;
    autoClose: boolean;
    showArrow: boolean;
    tooltipTriggerContent: ReactNode;
    tooltipContent: ReactNode;
    offsetDistance: number;
}

declare let window: any;

export function Tooltip(props: Props): ReactElement {
    const tooltipName = new Date().toTimeString();

    const [isVisible, _setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);
    const [menuTrigger, setMenuTrigger] = useState<HTMLElement | null>(null);
    const visibleByFocusRef = useRef(false);
    const shouldRenderTooltip = useDelayVisible(isVisible);
    const popover = useRef<PopoverRef>();

    const setIsVisible = (visible: boolean) => {
        isVisibleRef.current = visible;
        _setIsVisible(visible);
    };

    const setVisibleByFocus = (visible: boolean) => {
        visibleByFocusRef.current = visible;
    };

    const registerPublicApi = () => {
        if (window && !window.slPopover) {
            window.slPopover = {};
        }

        window.slPopover[tooltipName] = {
            hideMenu: () => hideMenu()
        };
    };

    const registerActivePopover = () => {
        if (window && !window.slPopover) {
            window.slPopover = {};
        }

        window.slPopover.activePopover = {
            name: props.name,
            autoClose: props.autoClose
        };
    };

    const showMenu = () => {
        if (window && window.slPopover) {
            const popoverName = window.slPopover.activePopover?.name;
            const autoClose = window.slPopover.activePopover?.autoClose;
            if (autoClose && popoverName && popoverName !== props.name) {
                if (window.slPopover[popoverName]) {
                    window.slPopover[popoverName].hideMenu();
                }
            }
        }

        if (!isVisibleRef.current) {
            popover?.current?.update();
            setIsVisible(true);
            registerActivePopover();
        }
    };

    const hideMenu = () => {
        if (isVisibleRef.current) {
            setIsVisible(false);
        }
    };

    const outsidePointerEventListener = (event: MouseEvent | TouchEvent | FocusEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (targetOutside) {
            hideMenu();
        }
    };

    const outsideFocusEvent = (event: FocusEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (visibleByFocusRef.current && targetOutside) {
            hideMenu();
            setVisibleByFocus(false);
        }
    };

    const outsideHoverEvent = (event: MouseEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (targetOutside) {
            hideMenu();
        }
    };

    const initOutsideListener = () => {
        document.addEventListener("mouseover", outsideHoverEvent);
    };

    const destroyOutsideListener = () => {
        document.removeEventListener("focusout", outsideFocusEvent);
        document.removeEventListener("mouseover", outsideHoverEvent);
        document.removeEventListener("mousedown", outsidePointerEventListener);
        document.removeEventListener("touchstart", outsidePointerEventListener);
    };

    const onHoverEvent = (event: MouseEvent) => {
        const insideTarget = eventInsideTarget(event, popover.current, menuTrigger);

        if (insideTarget) {
            showMenu();
        }
    };

    const onClickEvent = (event: MouseEvent | TouchEvent) => {
        const insideTarget = eventInsideTarget(event, popover.current, menuTrigger);

        if (insideTarget) {
            return isVisibleRef.current ? hideMenu() : showMenu();
        }
    };

    const initInsideListener = () => {
        document.addEventListener("mouseover", onHoverEvent);
    };

    const destroyInsideListener = () => {
        document.removeEventListener("mousedown", onClickEvent);
        document.removeEventListener("touchstart", onClickEvent);
        document.removeEventListener("mouseover", onHoverEvent);
    };

    useEffect(() => {
        if (menuTrigger) {
            initInsideListener();
            initOutsideListener();
            registerPublicApi();
        }

        return () => {
            destroyOutsideListener();
            destroyInsideListener();
        };
    }, [menuTrigger]);

    const renderMenuTrigger = () => (
        <div className="sl-tooltip-trigger" ref={setMenuTrigger}>
            {props.tooltipTriggerContent}
        </div>
    );

    return (
        <React.Fragment>
            {renderMenuTrigger()}
            {shouldRenderTooltip && (
                <Popper
                    className={props.className ?? ''}
                    ref={popover}
                    visible={isVisible}
                    showArrow={props.showArrow}
                    trigger={menuTrigger}
                    menuContent={props.tooltipContent}
                    offsetDistance={props.offsetDistance}
                />
            )}
        </React.Fragment>
    );
}
