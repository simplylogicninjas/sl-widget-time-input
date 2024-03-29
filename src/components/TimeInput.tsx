import { ReactElement, createElement, useState, useEffect, ReactNode, useRef } from "react";
import { CSSProperties } from "react";
import classNames from "classnames";
import Actions from "./Actions";
import { parseNumberValueToSeconds, parseHumanReadableValueToSeconds, parseTimeValueToSeconds } from "src/utils/value";

export interface ActionProps {
  enabled: boolean;
    config?: {
      applyBtn: {
        className: string;
        onClick: () => void;
      }
      cancelBtn: {
        className: string;
        onClick: () => void;
      }
    }
}

export interface Props {
  value?: string;
  outputFormat?: 'datetime' | 'decimal';
  outputDate?: Date;
  onChange?: (value: Date | number | undefined) => void;
  onError?: () => void;
  className?: string;
  index?: number;
  style?: CSSProperties;
  tabIndex?: number;
  disabled?: boolean;
  children?: ReactNode;
  actions: ActionProps;
}

function parseTimeString(timeString: string): Date | null {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  const parsedTimeValueToSeconds: number | null = parseTimeValueToSeconds(timeString);

  if (parsedTimeValueToSeconds !== null) {
    date.setSeconds(parsedTimeValueToSeconds);

    if (date.getSeconds() > 50) {
      date.setMinutes(date.getMinutes() + 1);
      date.setSeconds(0);
    }

    return date;
  }

  const parsedDecimalToSeconds: number | null = parseNumberValueToSeconds(timeString);

  if (parsedDecimalToSeconds !== null) {
    date.setSeconds(parsedDecimalToSeconds);

    if (date.getSeconds() > 50) {
      date.setMinutes(date.getMinutes() + 1);
      date.setSeconds(0);
    }

    return date;
  }

  const parsedHumanReadableToSeconds: number | null = parseHumanReadableValueToSeconds(timeString);

  if (parsedHumanReadableToSeconds !== null) {
    date.setSeconds(parsedHumanReadableToSeconds);

    if (date.getSeconds() > 50) {
      date.setMinutes(date.getMinutes() + 1);
      date.setSeconds(0);
    }

    return date;
  }

  return null;

  // // Regular expression to match the formats "10.59", "1059", "10h59m", or "10,75"
  // const timeRegex = /^(\d{1,2})(?:[:]?(\d{1,2}))?(?:[hu:]?(\d{1,2}))?(?:[m]?)?(?:[,.:]?(\d{1,3}))?$/;
  // const timeStringToMatch = timeString.startsWith('.') || timeString.startsWith(',')? `0${timeString}` : timeString;

  // // Check if the input string matches the expected format
  // const match = timeRegex.exec(timeStringToMatch);
  // if (!match) {
  //   console.error("Invalid time format. Expected formats: '10.59', '1059', '10h59m', or '10,75'");
  //   return null;
  // }

  // const now = new Date();
  // const originalInput = parseInt(match[0]);

  // if (timeStringToMatch.length < 4 && originalInput > 23) {
  //   const hoursFromMinutes = Math.floor(originalInput / 60);

  //   return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hoursFromMinutes, originalInput % 60);
  // }

  // // Extract the hours and minutes from the matched groups
  // let hours = parseInt(match[1]);
  // let minutes = 0;

  // if (match[2]) {
  //   // If the minutes are included in the input string (e.g. "10.59" or "1059"), extract them from the second matched group
  //   minutes = parseMinute(match[2]);
  // } else if (match[3]) {
  //   // If the minutes are included in the input string as part of a separate hours/minutes field (e.g. "10h59m"), extract them from the third matched group
  //   minutes = parseInt(match[3]);
  // } else if (match[4]) {
  //   // If the minutes are included in the input string using a comma instead of a dot (e.g. "10,75"), extract them from the fourth matched group
  //   minutes = parseMinute(match[4]) * 60 / 100;
  // }

  // minutes = Math.floor(minutes);

  // // Validate the hours and minutes
  // if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
  //   console.error("Invalid time. Hours must be between 0 and 23, and minutes must be between 0 and 59.");
  //   return null;
  // }

  // // Create a new Date object with today's date and the specified time
  // return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

export function TimeInput({
  value,
  className,
  style,
  tabIndex,
  outputFormat,
  disabled,
  children,
  outputDate = new Date(),
  actions,
  onChange,
  onError
}: Props): ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null); 
  const [inputValue, setInputValue] = useState<string>('');
  const [showActions, setShowActions] = useState(false);

  const updateInputValue = (inputValue: string | undefined) => {
    let dateOutput: Date | null | undefined;
    if (inputValue) {
      dateOutput = parseTimeString(inputValue);
      if (dateOutput) {
        const hourString = dateOutput.getHours().toString();
        const minuteString = dateOutput.getMinutes().toString();

        setInputValue(`${hourString.length === 1 ? `0${hourString}` : hourString}:${minuteString.length === 1 ? `0${minuteString}` : minuteString}`);
      }
    }
    return dateOutput;
  }

  const triggerOnChange = (value: Date | number | undefined) => {
    if (onChange) {
      onChange(value);
    }
  }

  const triggerError = () => {
    if (onError) {
      onError();
    }
  }

  const onInputChange = () => {
    if (inputValue === '') {
      triggerOnChange(undefined);

      return;
    }

    const date = updateInputValue(inputValue);

    if (date) {
      if (outputFormat === 'datetime') {
        outputDate.setHours(date.getHours());
        outputDate.setMinutes(date.getMinutes());
        outputDate.setSeconds(0);

        triggerOnChange(outputDate);
      } else {
        const hours = date.getHours();
        // const minutes = date.getMinutes() / 60 * 100;
        const minutes = date.getMinutes();
        // const minutesFormatted = minutes > 0 && minutes.toString().length === 1 ? `0${minutes}` : minutes;
        const minutesToDecimal = minutes / 60;
        const decimalTime = hours + minutesToDecimal;
        const decimal = parseFloat(decimalTime.toFixed(8))
        triggerOnChange(decimal);
      }
    } else {
      triggerError();
    }
  }

  const onInputFocus = () => {
    selectAllInputText();

    if (actions.enabled) {
      setTimeout(() => {
        setShowActions(true);
      }, 500);
    }
  }

  const onApplyBtnClick = () => {
    setShowActions(false);

    actions.config?.applyBtn.onClick();
  }

  const onCancelBtnClick = () => {
    setShowActions(false);

    actions.config?.cancelBtn.onClick();
  }

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onInputChange();
      onApplyBtnClick();
      blurInput();
    }

    if (e.key === 'Escape') {
      onInputChange();
      onCancelBtnClick();
      blurInput();
    }
  }

  const selectAllInputText = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }

  const blurInput = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }

  useEffect(() => {
    // if (!initRef.current && value !== '00:00') {
    //   updateInputValue(value);
    //   initRef.current = true;
    // }

    value ? updateInputValue(value) : setInputValue('');
  }, [value])

  return (
    <div className="widget-time-input">
      <input
        ref={inputRef}
        type='string'
        inputMode={'decimal'}
        value={inputValue}
        className={classNames('form-control', className)}
        style={style}
        tabIndex={tabIndex}
        placeholder={'00:00'}
        onChange={e => setInputValue(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputChange}
        onKeyUp={onKeyUp}
        disabled={disabled}
      />
      {children}
      { actions.enabled && actions.config ? (
        <Actions
          visible={showActions}
          applyBtnClassName={actions.config.applyBtn.className}
          onApplyBtnClick={onApplyBtnClick}
          cancelBtnClassName={actions.config.cancelBtn.className}
          onCancelBtnClick={onCancelBtnClick}
        />
      ): undefined}
    </div>
  );
}
