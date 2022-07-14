// moduły wbudowane
let http = require('http')
let url = require('url')

// moduły zewnętrzne
let nodestatic = require('node-static')
let cookies = require('cookies')
let uuid = require('uuid')

// moje moduły
let lib = require('./lib')
let db = require('./db')
let auth = require('./auth')
let restapi = require('./restapi')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

httpServer.on('request', function(req, res) {

    let env = { req, res }

    // utrzymanie sesji
    let appCookies = new cookies(env.req, env.res)
    env.session = appCookies.get('session')
    let now = Date.now()
    if(!env.session || !lib.sessions[env.session]) {
        env.session = uuid.v4()
        lib.sessions[env.session] = { created: now, touched: now }
    } else {
        lib.sessions[env.session].touched = now
    }
    appCookies.set('session', env.session, { httpOnly: false })

    // sparsuj url
    env.urlParsed = url.parse(env.req.url, true)

    env.payload = ''
    env.req.on('data', function(data) {
        // pobierz kolejną paczkę danych
        env.payload += data
    }).on('end', function() {
        // wszystkie dane zostały zebrane
        try {
            console.log(env.session, '<<', env.req.method, env.req.url, env.payload)
            if(env.payload) {
                env.payload = JSON.parse(env.payload)
                if(!env.payload || typeof env.payload != 'object') {
                    lib.sendError(env.res, 'Invalid payload (not an object)')
                    return
                }
            } else {
                env.payload = {}
            }
        } catch(ex) {
            lib.sendError(env.res, 'Invalid payload (parse error)')
            return
        }

        switch(env.urlParsed.pathname) {

            case '/auth':
                auth.handle(env)
                break

            case '/count':
            case '/invoice':
                restapi.handle(env)
                break
            case '/client':
                restapi.handle(env)
                break
            default:
                fileServer.serve(env.req, env.res)

        }
    })
})

db.init('pai2022l.sqlite')
httpServer.listen(7777)