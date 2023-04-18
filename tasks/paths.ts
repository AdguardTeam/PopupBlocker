import path from 'path';
import { BUILD_DIR, TMP_DIR } from './constants';

export const BUILD_PATH = path.resolve(__dirname, `../${BUILD_DIR}`);
export const TMP_PATH = path.resolve(__dirname, `../${TMP_DIR}`);
