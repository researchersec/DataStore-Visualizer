import * as d3 from "d3";

interface ProfileKey {
    [key: string]: string;
}

interface Craft {
    [key: string]: any;
}

interface Character {
    Professions: { [key: string]: any };
    lastUpdate: number;
    Prof1: string;
    Prof2: string;
}

interface Global {
    Characters: { [key: string]: Character };
}

interface DataStore {
    profileKeys: ProfileKey;
    global: Global;
}

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const output = document.getElementById('output') as HTMLDivElement;

fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const data = parseLuaFile(text);
            visualizeData(data);
        };
        reader.readAsText(file);
    }
}

function parseLuaFile(luaText: string): DataStore {
    const luaData = luaText.substring(luaText.indexOf('{'), luaText.lastIndexOf('}') + 1);
    const jsonData = JSON.parse(luaData.replace(/--\s\[\d+\]/g, '').replace(/,\s*$/, ''));
    return jsonData;
}

function visualizeData(data: DataStore): void {
    output.innerHTML = '';
    const characters = Object.entries(data.global.Characters);
    
    const svg = d3.select(output)
        .append('svg')
        .attr('width', 600)
        .attr('height', characters.length * 30);

    svg.selectAll('text')
        .data(characters)
        .enter()
        .append('text')
        .attr('x', 10)
        .attr('y', (d, i) => (i + 1) * 25)
        .text(d => `${d[0]}: ${JSON.stringify(d[1].Professions, null, 2)}`);
}
