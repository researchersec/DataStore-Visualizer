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
        console.log = function (message) {
            oldLog.apply(console, arguments);
            const logMessage = document.createElement('div');
            logMessage.textContent = message;
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
                console.log('File size exceeds the limit.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    const content = e.target?.result as string;
                    const parsedData = parseLuaFile(content);
                    displayData(parsedData);
                } catch (err) {
                    output.innerHTML = 'Error reading file.';
                    console.log('Error reading file:', err);
                }
            };
            reader.onerror = () => {
                output.innerHTML = 'Error reading file.';
                console.log('Error occurred while reading the file.');
            };
            reader.readAsText(file);
        }
    });

    function parseLuaFile(content: string): any {
        const data: { [key: string]: string } = {};
        const lines = content.split('\n');
        lines.forEach(line => {
            const match = line.match(/(\w+)\s*=\s*(.+)/);
            if (match) {
                data[match[1]] = match[2];
                console.log(`Parsed line: ${line}`);
            }
        });
        return data;
    }

    function displayData(data: any) {
        output.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        console.log('Displayed parsed data.');
    }
});