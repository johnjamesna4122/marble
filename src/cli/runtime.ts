/**
*  运行时
*/
import * as path from 'path';
import * as fileExists from 'file-exists';
import code from './code';
import config from './config';
import { throwError, logInfo, logWarning } from './log';


let pathMap: Map<string, any> = null;   // 路径集合

export let port: number = 0;   // 运行时端口
export let marbleDir: string = '';  // 数据目录绝对路径


/**
 * 运行时初始化
 */
export function init (port: string|number, dir: string) {
    pathMap = new Map();    
    marbleDir = path.join(process.cwd(), dir);
}

/**
 * 得到数据目录的绝对路径
 */
export function getDirAbsolutePath (): string {
    console.log(`dir : ${marbleDir}`);
    return marbleDir;
}


/**
 * 集合是否存在路径
 * @param path 
 */
export function hasPath (path: string): boolean {
    if (!path || typeof path != 'string') {
        return false;
    }

    return pathMap.has(path);
}
/**
 * 得到路径对应的信息
 */
export function getPathData (path: string): object | boolean {
    if (!path || typeof path != 'string') {
        return false;
    }

    if ( hasPath(path) ) {
        return pathMap.get(path);
    }

    return false;
}
/**
 * 清空路径集合
 */
export function clearPathMap () {
    if ( pathMap ) {
        pathMap.clear();
    }
}
/**
 * 替换
 * @param _pathMap 
 */
export function replacePathMap (_pathMap: Map<string, any>) {
    if ( _pathMap ) {
        pathMap = _pathMap;
    }
}









/**
 * 加载数据文件列表
 * @param dir 
 * @param files 
 */
export async function loadFiles (dir: string, files: string[]) {
    // 判断文件数量
    if ( !Array.isArray(files) || files.length <= 0 ) {
        return throwError(code['21'](dir));
    }

    const pathMap: Map<string, any> = new Map();
    for ( let file of files ) {
        let data:any = null;
        try {
            data = require(file);
        } catch (err) {
            logWarning(code['22'](file));
            continue;
        }
        if ( data && typeof data === 'object' ) {
            const paths: (string | number | symbol)[] = Reflect.ownKeys(data);
            for ( let p of paths ) {
                if ( !p ) {
                    logWarning(code['26'](file));
                } else {
                    if ( typeof data[p].timeout != 'number' || data[p].timeout > config.response.maxTimeout ) {
                        data[p].timeout = config.response.timeout;
                    }
                    
                    if ( pathMap.has(p as string) ) {
                        logWarning(code['27'](dir, file)); 
                    }


                    pathMap.set(p as string, data[p]);
                }
            }
        } else {
            logWarning(code['23'](file)); 
        }
    }

    return pathMap;
} 

/**
 * koa 检索路径  !核心算法!
 * @param path 
 * @param query 
 */
export async function retrievalPath (req: any,res: any, ctx: any) {
    const method = req.method, path = req.path;

    if ( !pathMap.has(path) ) {
        return code['91'](path);
    }

    let info = pathMap.get(path);
    if ( info && typeof info === 'object' ) {
        if ( method.toLowerCase() != info.method ) {
            return code['94'];
        }

        let timeout = info.timeout;
        await new Promise( ( resolve, reject ) => {
            setTimeout(resolve, timeout);
        });

        if ( typeof info.hook === 'function' ) {
            try {
                const ret = info.hook(req, res, ctx);
                if ( ret && typeof ret.then === 'function' ) {
                    return await ret;
                } else {
                    return ret;
                }

            } catch (err) {
                return code['93'](path, err);
            }
        } else {
            return info.data;
        }
    } else {
        return code['92'](path);
    }
}
