# marble
前端接口数据模拟服务

轻量，简洁，自更新 的解决方案

1期支持本地化数据模拟
2期支持服务器+UI模拟

关于本地化模拟
支持json文件和js文件,且js的话支持自定义路径对应的钩子函数(👏👏👏)

## cli installation

```
npm install --save-dev gaoyonggege-marble

```

## cli使用方法
cli认为项目的mock数据应该和项目本身的代码放在一起，这样是最合理的。开发者可以在项目的
本目录下新建一个marble目录来存放模拟数据，您可以在其中随意新建子目录。cli会将marble目录下的所有文件[.js/.json]都认为是数据文件。文件格式应当是:
    data.js:
        module.exports = {
            '/a': {
                method: 'get',
                timeout: 1,
                data: {
                    code: 0,
                    msg: ''
                }
            }
        };
    data.json: 
        {
            "/a": {
                "method": "get",
                "timeout": 1,
                "data:" {
                    "code": 0,
                    "msg": ''s
                }
            }
        }  

当开发者写完所有数据文件后,还需要在项目的package.json文件中新建一个npm命令:
    script: {
        ...
        "mock": "marble-cli"
    }
执行命令 npm run mock，则工具会启动并加载全部的数据文件，然后开发者就可以访问自定义的
接口数据了。每当改变了数据文件的内容后工具会自动热加载数据，保证接口数据永远是最新的。          


## License

Apache-2.0
