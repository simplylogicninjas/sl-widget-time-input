import { ReactElement, createElement, useState, useEffect, ReactNode } from "react";
import { CSSProperties } from "react";
import classNames from "classnames";

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
}

function parseMinute(minuteString: string): number {
  return parseInt(minuteString.length === 1 ? `${minuteString}0` : minuteString)
}

function parseTimeString(timeString: string): Date | null {
  // Regular expression to match the formats "10.59", "1059", "10h59m", or "10,75"
  const timeRegex = /^(\d{1,2})(?:[:]?(\d{1,2}))?(?:[hu:]?(\d{1,2}))?(?:[m]?)?(?:[,.:]?(\d{1,2}))?$/;

  // Check if the input string matches the expected format
  const match = timeRegex.exec(timeString);
  if (!match) {
    console.error("Invalid time format. Expected formats: '10.59', '1059', '10h59m', or '10,75'");
    return null;
  }

  // Extract the hours and minutes from the matched groups
  let hours = parseInt(match[1]);
  let minutes = 0;

  if (match[2]) {
    // If the minutes are included in the input string (e.g. "10.59" or "1059"), extract them from the second matched group
    minutes = parseMinute(match[2]);
  } else if (match[3]) {
    // If the minutes are included in the input string as part of a separate hours/minutes field (e.g. "10h59m"), extract them from the third matched group
    minutes = parseInt(match[3]);
  } else if (match[4]) {
    // If the minutes are included in the input string using a comma instead of a dot (e.g. "10,75"), extract them from the fourth matched group
    minutes = parseMinute(match[4]) * 60 / 100;
  }

  // Validate the hours and minutes
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    console.error("Invalid time. Hours must be between 0 and 23, and minutes must be between 0 and 59.");
    return null;
  }

  // Create a new Date object with today's date and the specified time
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  return date;
}

export function TimeInput({ value, className, style, tabIndex, outputFormat, disabled, children, outputDate = new Date(), onChange, onError }: Props): ReactElement {
  const [inputValue, setInputValue] = useState<string>('');
  const updateInputValue = (inputValue: string | undefined) => {
    let dateOutput: Date | null | undefined;
    if (inputValue) {
      dateOutput = parseTimeString(inputValue.replace(/\s/g, ""));
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

          triggerOnChange(outputDate);
        } else {
          const hours = date.getHours();
          const minutes = Math.ceil(date.getMinutes() / 60 * 100).toString();
          const minutesFormatted = minutes.length === 1 ? `0${minutes}` : minutes;

          triggerOnChange(parseFloat(`${hours}.${minutesFormatted}`));
        }
      } else {
        triggerError();
      }
  }

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onInputChange();
    }
  }

  useEffect(() => {
    // if (!initRef.current && value !== '00:00') {
    //   updateInputValue(value);
    //   initRef.current = true;
    // }

    value ? updateInputValue(value) : setInputValue('');
  }, [value])

  return <div className="widget-time-input">
    <input
      type='string'
      value={inputValue}
      className={classNames('form-control', className)}
      style={style}
      tabIndex={tabIndex}
      placeholder={'00:00'}
      onChange={e => setInputValue(e.target.value)}
      onBlur={onInputChange}
      onKeyUp={onKeyUp}
      disabled={disabled}
    />
    {children}
  </div>;
}
