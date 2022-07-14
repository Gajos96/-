app.controller('InvoiceCtrl', ['$http', function($http) {
    console.log('Kontroler InvoiceCtrl startuje')
    let ctrl = this

    ctrl.invoice = {
        no: '',
        rows: []
    }

    ctrl.invoices = []

    ctrl.newRow = {}
    ctrl.editedRow = {}
    ctrl.total = 0

    ctrl.vats = [ { label: '23%', percent: 23 }, { label: '8%', percent: 8 }, { label: 'zw.', percent: 0 } ]

    ctrl.total = function() {
        let total = 0
        ctrl.invoice.rows.forEach(function(row) {
            total += row.edited ? ctrl.value(ctrl.editedRow) : ctrl.value(row)
        })
        return total + (ctrl.newRow.edited ? ctrl.value(ctrl.newRow) : 0)
    }

    ctrl.addRow = function() {
        let newRowCopy = {}
        delete ctrl.newRow.edited
        Object.assign(newRowCopy, ctrl.newRow)
        ctrl.invoice.rows.push(newRowCopy)
    }

    ctrl.delRow = function(i) {
        ctrl.invoice.rows.splice(i, 1)
    }

    ctrl.editRow = function(i) {
        Object.assign(ctrl.editedRow, ctrl.invoice.rows[i])
        ctrl.invoice.rows[i].edited = true
    }

    ctrl.editNewRow = function(i) {
        ctrl.newRow.name = ''
        ctrl.newRow.quantity = ctrl.newRow.price = 0
        ctrl.newRow.vat = 23
        ctrl.newRow.edited = true
    }

    ctrl.updateRow = function(i) {
        Object.assign(ctrl.invoice.rows[i], ctrl.editedRow)
        delete ctrl.invoice.rows[i].edited
    }

    ctrl.value = function(row) {
        return row.quantity * row.price * (1 + row.vat * 0.01)
    }

    ctrl.clearRows = function() {
        ctrl.invoice.rows.length = 0
    }

    ctrl.isRowEdited = function() {
        let edited = false
        ctrl.invoice.rows.forEach(function(row) { edited = edited || row.edited })
        return edited
    }

    let getAllInvoices = function() {
        $http.get('invoice').then(
            function(res) { ctrl.invoices = res.data },
            function(err) {}
        )
    }

    ctrl.sendInvoice = function() {
        $http.post('invoice', ctrl.invoice).then(
            function(res) {
                getAllInvoices()
            },
            function(err) {
                alert(err.data.error)
            }
        )
    }

    ctrl.load = function() {
        $http.get('invoice?no=' + ctrl.invoice.no).then(
            function(res) { ctrl.invoice = res.data },
            function(err) {}
        )
    }

    getAllInvoices()   
}])