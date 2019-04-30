
module.exports = {
    '/a': {
        method: 'get',
        timeout: 1000,
        data: {
            code: 0,
            msg: '',
            data: {
                name: 'aaa'
            }
        },
    },
    '/b': {
        method: 'post',
        timeout: 100,
        data: {
            code: 1,
            msg: '请稍后',
        },
    },
    '/c': {
        method: 'post',
        hook: (req) => {
            let querystring = req.querystring;
            if (querystring.indexOf('user') >= 0 ) {
                return 'yes user';
            } else {
                return 'no user';
            }
        }
    },
    '/d': {
        method: 'post',
        timeout: 0,
        hook: (req, res, ctx) => {
            return new Promise( (resolve, reject) => {
                setTimeout( () => {
                    resolve('5秒后.::gggg fd ...');
                }, 5000)
            } );
        }
    },
};