import * as luaparse from 'luaparse';


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const output = document.getElementById('output');
    const consoleOutput = document.getElementById('consoleOutput');

    if (!fileInput || !output || !consoleOutput) {
        console.error("Elements not found");
        return;
    }

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
        const ast = luaparse.parse(content);
        const data: { [key: string]: any } = {};

        function traverse(node: any, parent: any = null) {
            if (node.type === 'AssignmentStatement') {
                node.variables.forEach((variable: any, index: number) => {
                    const value = node.init[index];
                    if (variable.type === 'Identifier' && value.type === 'TableConstructorExpression') {
                        data[variable.name] = parseTable(value);
                    }
                });
            } else if (node.body) {
                node.body.forEach((childNode: any) => traverse(childNode, node));
            }
        }

        function parseTable(node: any): any {
            const tableData: any = {};
            node.fields.forEach((field: any) => {
                if (field.type === 'TableKeyString') {
                    tableData[field.key.name] = field.value.raw || parseTable(field.value);
                } else if (field.type === 'TableValue') {
                    tableData.push(field.value.raw || parseTable(field.value));
                }
            });
            return tableData;
        }

        traverse(ast);
        return data;
    }

    function displayData(data: any) {
        if (output) {
            output.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            console.log('Displayed parsed data.');
        } else {
            console.log('Output element is null.');
        }
    }
});
