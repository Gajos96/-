let lib = require('./lib')
let db = require('./db')

let restapi = module.exports = {

    handle: function(env) {

        let role = lib.sessions[env.session].role
        if(!role || !role.includes('u')) {
            lib.sendError(env.res, 'Permission denied', 403)
            return
        }

        switch(env.req.method + ' ' + env.urlParsed.pathname) {
            case 'GET /count':
                let filter = env.urlParsed.query.filter ? '%' + env.urlParsed.query.filter + '%': '%'
                db.getInvoicesCount(filter, function(err, row) {
                    if(err) {
                        lib.sendError(env.res, 'Error during counting invoices', 400)
                    } else {
                        lib.sendJson(env.res, row)
                    }
                })
                break

                case 'GET /client':
                    if(env.urlParsed.query.no) {
                        db.getInvoice(env.urlParsed.query.no, function(err, row) {
                            if(err) {
                                lib.sendError(env.res, 'Invoice not found', 404)
                            } else {
                                lib.sendJson(env.res, row)
                            }
                        })
                    } else {
                        let filter = env.urlParsed.query.filter ? '%' + env.urlParsed.query.filter + '%': '%'
                        let from = env.urlParsed.query.from ? parseInt(env.urlParsed.query.from) : 1
                        let to = env.urlParsed.query.to ? parseInt(env.urlParsed.query.to) : 999999
                    db.GetClient(filter, from, to, function(err, row) {
                        if(err) {
                            lib.sendError(env.res, 'Clients not found', 404)
                        } else {
                            lib.sendJson(env.res, row)
                        }})}
                    break

            case 'GET /invoice':
                if(env.urlParsed.query.no) {
                    db.getInvoice(env.urlParsed.query.no, function(err, row) {
                        if(err) {
                            lib.sendError(env.res, 'Invoice not found', 404)
                        } else {
                            lib.sendJson(env.res, row)
                        }
                    })
                } else {
                    let filter = env.urlParsed.query.filter ? '%' + env.urlParsed.query.filter + '%': '%'
                    let from = env.urlParsed.query.from ? parseInt(env.urlParsed.query.from) : 1
                    let to = env.urlParsed.query.to ? parseInt(env.urlParsed.query.to) : 999999
                    db.getAllInvoices(filter, from, to, function(err, rows) {
                        if(err) {
                            lib.sendError(env.res, 'Error during fetching invoices', 404)
                        } else {
                            lib.sendJson(env.res, rows)
                        }})}
                break
                
            case 'POST /invoice':
                if(!env.payload.no || env.payload.no.length <= 0) {
                    lib.sendError(env.res, 'Invoice has no number')
                } else {
                    db.getInvoice(env.payload.no, function(err, existing) {
                        if(existing) {
                            db.deleteInvoice(env.payload.no, function(err) {
                                if(err) {
                                    lib.sendError(env.res, 'Invoice cannot be updated')
                                } else {
                                    db.addInvoice(env.payload, function(err, invoice) {
                                        if(err) {
                                            lib.sendError(env.res, 'Invoice cannot be added')
                                        } else {
                                            lib.sendJson(env.res, invoice)
                                        }
                                    })
                                }
                            })
                        } else {
                            db.addInvoice(env.payload, function(err, invoice) {
                                if(err) {
                                    lib.sendError(env.res, 'Invoice cannot be added')
                                } else {
                                    lib.sendJson(env.res, invoice)
                                }
                            })    
                        }
                    })
                }
                break
            case 'DELETE /invoice':
                db.deleteInvoice(env.urlParsed.query.no, function(err, result) {
                    if(err) {
                        lib.sendError(env.res, 'Error during deleting invoice')
                    } else {
                        lib.sendJson(env.res, result)
                    }
                })               
                break
            default:
                lib.sendError(env.res, 'Method not implemented', 405)
        }

    }

}