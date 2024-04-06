import React, { useEffect, useState } from 'react';
import { CountBox } from '.';

const CountdownTimer = ({ deadline }) => {
    const calculateTimeLeft = () => {
        const difference = deadline * 1000 - Date.now();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft.expired = true;
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <CountBox
            title={"Time Left"}
            fullWidth
            value={
                <div>
                    {timeLeft.expired ? (
                        <div>Expired</div>
                    ) : (
                        <div>
                            <span>{timeLeft.days}d </span>
                            <span>{timeLeft.hours}h </span>
                            <span>{timeLeft.minutes}m </span>
                            <span>{timeLeft.seconds}s </span>
                        </div>
                    )}
                </div>
            }
        />
    );
}

export default CountdownTimer;
