import { promises as fsPromises } from 'fs';

/**
 * File-based model for CRUD operations on any type of data.
 */

/**
 * Retrieves the current data from the file. If the file doesn't exist, it creates a new file with an empty array.
 * @param filePath - The path to the file.
 * @returns A promise that resolves with the array of data.
 */
export async function getData(filePath: string): Promise<any[]> {
    try {
        await fsPromises.access(filePath);
    } catch (error) {
        // If the file doesn't exist, initialize it with an empty array
        try {
            await fsPromises.writeFile(filePath, JSON.stringify([]), 'utf-8');
            return [];
        } catch (writeError) {
            throw new Error(`Failed to create file at ${filePath}: ${(writeError as Error).message}`);
        }
    }

    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file content is invalid, reset it to an empty array
        try {
            await fsPromises.writeFile(filePath, JSON.stringify([]), 'utf-8');
            return [];
        } catch (writeError) {
            throw new Error(`Failed to reset file at ${filePath}: ${(writeError as Error).message}`);
        }
    }
}

/**
 * Retrieves an item from the file by its index.
 * @param filePath - The path to the file.
 * @param index - The index of the item to retrieve.
 * @returns A promise that resolves with the item at the specified index.
 */
export async function getItem(filePath: string, id: number): Promise<any> {
    try {
        const data = await getData(filePath);
        const item = data.find((item) => item.id === id);
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
}

/**
 * Adds a new item to the file.
 * @param filePath - The path to the file.
 * @param item - The item to add.
 * @returns A promise that resolves when the item is added.
 */
export async function addItem(filePath: string, item: any): Promise<void> {
    try {
        const data = await getData(filePath);
        const idx = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const newItem = { id: idx, ...item };
        data.push(newItem);
        await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return newItem;
    } catch (error) {
        throw new Error(`Failed to add item to file at ${filePath}: ${(error as Error).message}`);
    }
}

/**
 * Updates an item in the file by its index with a patch update.
 * Only the provided fields in `updatedFields` will be modified, leaving the rest unchanged.
 * @param filePath - The path to the file.
 * @param index - The index of the item to update.
 * @param updatedFields - An object containing the fields to update.
 * @returns A promise that resolves when the item is updated.
 */
export async function updateItem(filePath: string, index: number, updatedFields: Partial<any>): Promise<void> {
    try {
        const data = await getData(filePath);

        if (index < 0 || index >= data.length) {
            throw new Error('Invalid index');
        }
        const itemIndex = data.findIndex((item) => item.id === index);
        if (itemIndex === -1) {
            throw new Error('Item not found');
        }
        data[index] = { ...data[index], ...updatedFields };
        await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return data[index];
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
}

/**
 * Deletes an item from the file by its `id`.
 * @param filePath - The path to the file.
 * @param id - The `id` of the item to delete.
 * @returns A promise that resolves with the deleted item.
 */
export async function deleteItem(filePath: string, id: number): Promise<any> {
    try {
        const data = await getData(filePath);

        const itemIndex = data.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            throw new Error('Item not found');
        }

        // Remove the item from the array
        const [deletedItem] = data.splice(itemIndex, 1);

        // Write the updated data back to the file
        await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

        return deletedItem; // Return the deleted item
    } catch (error) {
        throw new Error(`Failed to delete item with id ${id} in file at ${filePath}: ${(error as Error).message}`);
    }
}