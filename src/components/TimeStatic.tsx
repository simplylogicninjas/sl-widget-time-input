import { ReactElement, createElement, useEffect, useState } from "react";
import { parseNumberValueToSeconds, parseTimeValueToSeconds, secondsToHoursAndMinutes } from "src/utils/value";

type Props = {
    value?: string;
}

function parseTimeValue(timeString: string) {
    const parsedTimeValueToSeconds: number | null = parseTimeValueToSeconds(timeString, false);

  if (parsedTimeValueToSeconds !== null) {
    const {hours, minutes} = secondsToHoursAndMinutes(parsedTimeValueToSeconds);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const parsedDecimalToSeconds: number | null = parseNumberValueToSeconds(timeString, false);

  if (parsedDecimalToSeconds !== null) {
    const {hours, minutes} = secondsToHoursAndMinutes(parsedDecimalToSeconds);
    const isNegative = timeString.charAt(0) === '-';

    return `${isNegative ? '-' : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  return '';
}

const TimeStatic = ({value}: Props): ReactElement => {
    const [timeValue, setTimeValue] = useState('');

    useEffect(() => {
        if (value) {
            setTimeValue(parseTimeValue(value))
        }
    }, [value]);

    return (
        <div className="widget-time-input-static">
            {timeValue}
        </div>
    )
}

export default TimeStatic;