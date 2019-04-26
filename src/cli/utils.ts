/**
*  工具
*/
import * as fs from 'fs';
import * as path from 'path';

/**
 * 目录是否存在
 * @param directory 
 * @param callback 
 */
export function directoryExists (directory: string, callback: Function): Promise<boolean>|void {
    if ( !directory || typeof directory !== 'string' ) {
        throw new TypeError('directory-exists expects a non-empty string as its first argument');
    }

    if (typeof callback === 'undefined') {
        return new Promise( (resolve, reject) => {
            fs.stat( path.resolve(directory), function(err: Error, stat) {
                if (err) {
                return resolve(false);
                }
                resolve(stat.isDirectory());
            });
        });

    } else {

        fs.stat( path.resolve(directory), function(err, stat) {
            if (err) {
                return callback(null, false);
            }
            callback(null, stat.isDirectory());
        });
        
    }
};

export function directoryExistsSync(directory: string): boolean {
    if (!directory || typeof directory !== 'string') {
      throw new TypeError('directory-exists expects a non-empty string as its first argument');
    }
  
    try {
      return fs.statSync(path.resolve(directory)).isDirectory();
    } catch (e) {
      return false;
    }
};
