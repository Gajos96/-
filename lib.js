let lib = module.exports = {

    sendJson: function(res, obj, code = 200) {
        let resData = JSON.stringify(obj)
        console.log(code, '>>', resData)
        res.writeHead(code, { contentType: 'application/json' })
        res.end(resData)
    },

    sendError: function(res, message, code = 400) {
        lib.sendJson(res, { error: message }, code)
    },

    sessions: {}
    
}