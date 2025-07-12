
export class FileReader {
    /**
     * Reads a JSON file with the specified format and returns a 2D boolean array.
     * Each cell is true if the value in the data array is not 0, otherwise false.
     * @param filePath Path to the JSON file.
     */
    static readTileDataAsBooleanArray(jsonContent: string): boolean[][] {
        const json = JSON.parse(jsonContent);

        // Assumes first layer is the one to read
        const layer = json.layers[0];
        const { data, width, height } = layer;

        // Convert flat data array to 2D boolean array
        const result: boolean[][] = [];
        for (let y = 0; y < height; y++) {
            const row: boolean[] = [];
            for (let x = 0; x < width; x++) {
                const value = data[y * width + x];
                row.push(value !== 0);
            }
            result.push(row);
        }
        return result;
    }
}