#!/usr/bin/env node

/**
*  cli入口
*/
/// <reference types="node" />

import * as path from 'path';
import { directoryExistsSync } from './utils';
import config from './config';
import code from './code';
import { throwError, logInfo, logWarning } from './log';
import { init as runtimeInit, getDirAbsolutePath } from './runtime';
import { Server } from './server';

/**
 * 校验port dir参数
 * @param port 
 * @param dir 
 */
function validateParams (port: string|number, dir: string): any {
    // 校验
    if ( !/\d/.test(port+'') || /[^0-9]/.test(port+'') ) {
        return throwError(code['1']);
    }

    port = Number.parseInt(port+'');
    if ( 1024 >= port || 65535 <= port ) {
        return throwError(code['2']);
    }

    if ( !dir || typeof dir != 'string' ) {
        return throwError(code['11']);
    }
    if ( dir.startsWith('../') ) {
        return throwError(code['12']);
    }
    let dirAbsPath = path.join(process.cwd(), dir);
    if ( !directoryExistsSync(dirAbsPath) ) {
        return throwError(code['13'](dir));
    }

    return true;
}


/**
 * 初始化系统
 * @param port 
 * @param dir 
 */
function init (port: string|number, dir: string): void {
    runtimeInit(port, dir);
}


/**
 * 系统启动
 * @param port 
 * @param dir 
 */
let server: Server = null;
function start (port: string|number, dir: string) {
    // 校验
    validateParams(port, dir);
    port = Number.parseInt(port+'');

    // 初始化
    init(port, dir);

    // 启动cli 服务
    server = new Server();
    const dirAbsolutePath = getDirAbsolutePath();
    server.run(port, dirAbsolutePath)
        .then( (data) => {
            logInfo(data);
        } ).catch( (err) => {
            throwError(err);
        } );
}



// 得到命令行参数
const argv: any = require('yargs').argv;
let port: number|string = config.port, dir: string = config.dir;  // 默认
if ( argv.port ) {
    port = argv.port;
}
if ( argv.dir ) {
    dir = argv.dir;
}
// 启动 
start(port, dir);
