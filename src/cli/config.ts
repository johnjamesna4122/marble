/**
*  cli 默认配置
*/

export default {
    port: 11111,    // cli服务器端口
    dir: 'marble',  // 模拟数据所在目录
    
    // source
    sourceWatchInterval: 800,
    sourceGlob: '**/*.js',

    // response 应答
    response: {
        timeout: 150,   // 默认响应时间 150毫秒
        maxTimeout: 10*1000,
    },

}