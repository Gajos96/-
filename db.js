// moduły zewnętrzne
let sqlite3 = require('sqlite3')

let connection = null

let db = module.exports = {

    init: function(fname) {
        connection = new sqlite3.Database(fname)
    },

    checkCredentials: function(login, password, callback) {
        let stmt = connection.prepare('SELECT * FROM users WHERE login=? AND password=?')
        stmt.get(login, password, callback)
        stmt.finalize()
    },

    getInvoicesCount: function(filter, callback) {
        let stmt = connection.prepare(
            'SELECT COUNT(*) AS count,' +
            'COUNT(*) FILTER (WHERE no LIKE ? OR client LIKE ?) AS filtered ' +
            'FROM invoices'
        )
        stmt.get(filter, filter, callback)
        stmt.finalize()
    },

    getAllInvoices: function(filter, from, to, callback) {
        let stmt = connection.prepare(
            'SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY invoices.no) AS row,' +
            'invoices.id AS id,no,client,' +
            'COALESCE(COUNT(invoice_items.id), 0) AS count,' +
            'COALESCE(SUM(invoice_items.price*invoice_items.quantity*(1+invoice_items.vat*0.01)),0) AS value ' +
            'FROM invoices ' +
            'LEFT JOIN invoice_items ON invoice_items.invoice_id=invoices.id ' +
            'WHERE no LIKE ? OR client LIKE ? ' +
            'GROUP BY invoices.no '+
            'ORDER BY invoices.no) subq ' +
            'WHERE subq.row>=? AND subq.row<=?'
        )
        stmt.all(filter, filter, from, to, callback)
        stmt.finalize()
    },

    GetClient: function(filter, from, to, callback) {
        let stmt = connection.prepare(
            'SELECT * FROM (' +
            'SELECT ROW_NUMBER() OVER (ORDER BY invoices.no) AS row,' +
            'invoices.client ,Count(invoices.no) As count ' +
            'from invoices ' +
            'WHERE no LIKE ? OR client LIKE ? ' +
            'GROUP BY invoices.client ' +
            'Order by Count(invoices.client) ' +
            ') as kro ' +
            'WHERE kro.row>=? AND kro.row<=?'
        )
        stmt.all(filter,filter, from, to, callback)
        stmt.finalize()
    },

    GetAll: function(callback) {
        let stmt = connection.prepare(
            'SELECT * '+
            'from invoices'
            )
        stmt.all(filter,filter, from, to, callback)
        stmt.finalize()
    },

    getInvoice: function(no, callback) {
        let stmt1 = connection.prepare('SELECT * FROM invoices WHERE no=?')
        stmt1.get(no, function(err, invoice) {
            if(err || !invoice) {
                callback({ error: 'No such invoice' }, null)
            } else {
                let stmt2 = connection.prepare('SELECT * FROM invoice_items WHERE invoice_id=? ORDER BY id')
                stmt2.all(invoice.id, function(err, rows) {
                    invoice.rows = rows
                    callback(null, invoice)
                })
                stmt2.finalize()
            }
        })
        stmt1.finalize()
    },



    addInvoice: function(invoice, callback) {
        let stmt1 = connection.prepare('INSERT INTO invoices (no,client) VALUES (?,?)')
        stmt1.run(invoice.no, invoice.client, function(err) {
            if(err) {
                if(callback) callback(err, null)
            } else {
                let lastInsertedId = this.lastID
                let stmt2 = connection.prepare('INSERT INTO invoice_items (invoice_id,name,price,quantity,vat) VALUES (?,?,?,?,?)')                
                invoice.rows.forEach(function(row) {
                    stmt2.run(lastInsertedId, row.name, row.price, row.quantity, row.vat)
                })
                if(callback) callback(null, invoice)
                stmt2.finalize()
            }
        })
        stmt1.finalize()
    },

    deleteInvoice: function(no, callback) {
        db.getInvoice(no, function(err, invoice) {
            if(invoice) {
                let stmt1 = connection.prepare('DELETE FROM invoices WHERE id=?')
                stmt1.run(invoice.id, function(err) {
                    if(err) {
                        if(callback) callback(err, null)
                    } else {
                        let stmt2 = connection.prepare('DELETE FROM invoice_items WHERE invoice_id=?')
                        stmt2.run(invoice.id, function(err) {
                            if(err) {
                                if(callback) callback(err, null)
                            } else {
                                if(callback) callback(null, invoice)
                                stmt2.finalize()        
                            }
                        })
                    }
                })
                stmt1.finalize()        
            } else {
                if(callback) callback({ error: 'No such invoice' }, null)
            }
        })
    }
}