const db = require('./db')
let lib = require('./lib')

let whoami = function(env) {
    let result = { session: env.session }
    let login = lib.sessions[env.session].login
    if(login) {
        result.login = login
        result.role = lib.sessions[env.session].role
    }
    return result
}

let auth = module.exports = {

    handle: function(env) {
        switch(env.req.method) {

            case 'GET':
                // kim jestem
                lib.sendJson(env.res, whoami(env))
                break

            case 'POST':
                // logowanie
                db.checkCredentials(env.payload.login, env.payload.password, function(err, row) {
                    if(err || !row) {
                        lib.sendError(env.res, "Login failed", 401)
                    } else {
                        lib.sessions[env.session].login = row.login
                        lib.sessions[env.session].role = row.role
                        lib.sendJson(env.res, whoami(env))    
                    }
                })
                break

            case 'DELETE':
                // wylogowanie
                delete lib.sessions[env.session].login
                delete lib.sessions[env.session].role
                lib.sendJson(env.res, whoami(env))
                break

            default:
                lib.sendError(env.res, 'Method not implemented', 405)
        }
    }
}