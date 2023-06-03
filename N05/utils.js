import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
export default __dirname;


export async function validateLimit(limit) {
    try {
        let a = Number(limit);
        if (a > 0) {
            return a;
        } else {
            return 10;
        }
        
    } catch (error) {
        console.log("validLimit error: " + error);
        return 10;
    }
}

export async function validatePage(page) {
    try {
        let a = Number(page);
        if (a > 0) {
            return a;
        } else {
            return 1;
        }
        
    } catch (error) {
        console.log("validLimit error: " + error);
        return 1;
    }
}