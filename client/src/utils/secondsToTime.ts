export const secondsToTime = (timeInSeconds: number) => {
    const pad = function (num: number, size: number) {
        return `000${num}`.slice(size * -1);
    };
    const time = parseFloat(timeInSeconds).toFixed(3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time - minutes * 60);
    const milliseconds = time.slice(-3);

    return `${hours >= 1 ? `${pad(hours, 2)}':'` : ''}
        ${pad(minutes, 2)}:${pad(seconds, 2)}`;
};
