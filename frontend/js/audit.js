app.controller('AuditCtrl', ['$http',function($http) {
    console.log('Uruchamianie Audytu')
    let ctrl = this

    const portionLength = 10
    
    ctrl.docs1 = []
    ctrl.filter = ''
    ctrl.from = 1
    ctrl.to = portionLength
    ctrl.count = ctrl.filtered = 0
    ctrl.portions = []

    ctrl.refreshCounts = function() {
        $http.get('count?filter=' + ctrl.filter).then(function(rep) {
            ctrl.count = rep.data.count
            ctrl.filtered = rep.data.filtered
            ctrl.portions.length = 0
            let from = 1
            while(from <= ctrl.filtered) {
                let to = from + portionLength - 1
                if(to > ctrl.filtered) to = ctrl.filtered
                let portionButton = { from: from, to: to, text: from + '-' + to }
                ctrl.portions.push(portionButton)
                from += portionLength
            }
        }, function(err) {})
    }

    ctrl.readData = function(refresh) {
        let from = !refresh && ctrl.from ? ctrl.from : 1
        let to = !refresh && ctrl.to ? ctrl.to : portionLength
        $http.get('client?filter=' + ctrl.filter + '&from=' + from + '&to=' + to).then(function(rep) {
            ctrl.docs1 = rep.data
        }, function(err) {})
        ctrl.refreshCounts()
    }

    ctrl.setFromTo = function(from, to) {
        ctrl.from = from
        ctrl.to = to
        ctrl.readData(false)
    }

    ctrl.refreshCounts()
    ctrl.readData()
}])