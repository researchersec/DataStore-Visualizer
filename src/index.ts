// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get the file input element and the output div
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const output = document.getElementById('output');

    // Add an event listener to handle file selection
    fileInput.addEventListener('change', (event: Event) => {
        // Get the selected file
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            // Create a FileReader to read the file content
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                // Get the content of the file
                const content = e.target?.result as string;
                // Parse the Lua file content
                const parsedData = parseLuaFile(content);
                // Display the parsed data
                displayData(parsedData);
            };
            // Read the file as text
            reader.readAsText(file);
        }
    });

    // Function to parse the Lua file content
    function parseLuaFile(content: string): any {
        // Initialize an empty object to store the parsed data
        const data = {} as any;
        // Split the content into lines
        const lines = content.split('\n');
        // Iterate through each line
        lines.forEach(line => {
            // Use a regular expression to extract key-value pairs
            const match = line.match(/(\w+)\s*=\s*(.+)/);
            if (match) {
                // Store the key-value pair in the data object
                data[match[1]] = match[2];
            }
        });
        // Return the parsed data
        return data;
    }

    // Function to display the parsed data
    function displayData(data: any) {
        if (output) {
            // Convert the data object to a JSON string and display it
            output.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
    }
});
