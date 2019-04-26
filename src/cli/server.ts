/**
*  服务器
*/
import chalk from 'chalk';
import * as moment from 'moment';
import * as Koa from 'koa';
import * as glob from 'glob';
import * as gulp from 'gulp';
import config from './config';
import { getPathData, loadFiles,  retrievalPath, replacePathMap } from './runtime';
import { throwError, logInfo, logWarning, newLines } from './log';

export class Server {
    private koa: Koa;

    private reloads: number = 1; // 热加载次数

    constructor () {
        this.koa = new Koa();
    }

    initUse () {
        this.koa.use( async (ctx) => {
            ctx.body = await retrievalPath(ctx.request, ctx.response, ctx);
        } );
    }
    
    /**
     * 得到路径下的数据文件列表
     * @param dir 
     */
    async getAllSourceFiles (dir: string): Promise<string[]> {
        return new Promise( ( reslove, reject ) => {
            const dirPath = dir + '/' + config.sourceGlob;

            glob(dirPath, { dot: false }, (err, files) => {
                if (err) {
                    return reject(err);
                } else {
                    return reslove(files);
                }
            });
        } );
    }
    
    /**
     * 监控source目录
     * @param dir 
     */
    watchSource(dir: string): void {
        gulp.watch(config.sourceGlob, {interval: config.sourceWatchInterval}, async (event) => {
            try {
                newLines();
                this.logRloadStart();

                await this.reloadDatas(dir);

                this.logRloadEnd();

                this.reloads++;
            } catch (e) {
                logWarning(`marble热加载第${this.reloads}次失败`);
            }
        })
    }

    logRloadStart () {
        let str = chalk.green('marble热加载第') + chalk.yellow(''+this.reloads) + 
                        chalk.green('次开始，时间: ') + 
                            chalk.yellow(''+moment().format('YYYY-MM-DD, hh:mm:ss a'));
        console.log(str);
    }

    logRloadEnd () {
        let str = chalk.green('marble热加载第') + chalk.yellow(''+this.reloads) + 
                        chalk.green('次结束，时间: ') + 
                            chalk.yellow(''+moment().format('YYYY-MM-DD, hh:mm:ss a'));
        console.log(str);
    }

    /**
     * 重新加载数据
     * @param dir 
     */
    async reloadDatas (dir: string) {
        const cache = require.cache;
        const cacheFiles: (string | number | symbol)[] = Reflect.ownKeys(cache);
        for ( let file of cacheFiles ) {
            if ( typeof file === 'string' && file.startsWith(dir) ) {
                delete cache[file];
            }
        }

        const files: string[] = await this.getAllSourceFiles(dir);
        let pathMap = await loadFiles(dir, files);
        replacePathMap(pathMap as Map<string, any>);
    }
    

    /**
     * 启动服务器
     * @param port 
     */
    async startServer (port: number): Promise<boolean> {
        this.initUse();

        return new Promise( (resolve, reject) => {
            this.koa.listen(port, () => {
                resolve(true);
            })
        } );
    }
    
    
    /**
     * 运行服务器
     * @param port 端口
     * @param dir 目录
     * @param fn 完成回调
     */
    async run (port: number, dir: string) {
        await this.reloadDatas(dir);

        this.watchSource(dir);

        await this.startServer(port);

        return `marble server start success!dir : ${dir}, port : ${port}`;
    }
}
