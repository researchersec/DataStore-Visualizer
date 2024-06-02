document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const output = document.getElementById('output');
    const consoleOutput = document.getElementById('consoleOutput');

    if (!fileInput || !output || !consoleOutput) {
        console.error("Elements not found");
        return;
    }

    // Override the default console.log
    (function () {
        const oldLog = console.log;
        console.log = function (...args: any[]) {
            oldLog.apply(console, args);
            const logMessage = document.createElement('div');
            logMessage.textContent = args.join(' ');
            consoleOutput.appendChild(logMessage);
        };
    })();

    fileInput.addEventListener('change', (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            if (!file.type.startsWith('text/')) {
                output.innerHTML = 'Please upload a valid text file.';
                console.log('Invalid file type selected.');
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10 MB
            if (file.size > maxSize) {
                output.innerHTML = 'File is too large.';
                console.log('File size e
