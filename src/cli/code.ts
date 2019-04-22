/**
* code
*/
export default {
    1: `命令行参数port格式错误`,
    2: `命令行参数port必须大于1024小于65535`,
    3: (port: number): string => { return `服务器端口号${port}被占用`; },

    11: `系统错误，dir参数为空`,
    12: `命令行参数dir不能试图指定为上级目录`,

    21: (dir: string) => { return `目录${dir}下没有合法的数据文件`; },
    22: (file: string) => { return `数据文件${file}内容错误`; },
    23: (file: string) => { return `数据文件${file}执行后返回值必须是对象`; },
    26: (file: string) => { return `文件${file}中有为定义的path`; },
    27: (file: string, path: string) => { return `文件${file}中定义的路径${path}重复了`; },


    91: (path: string) => { return `服务器${path}路由未定义`; },
    92: (path: string) => { return `服务器${path}路由定义错误`; },
    93: (path: string, err: any) => { return `路径${path}钩子函数报错, err msg : ${err.msg}`; },
    94: `路由地址相同但http方法不匹配`,
}
