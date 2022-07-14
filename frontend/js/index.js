let app = angular.module('index', ['ngRoute', 'ngSanitize'])

app.constant('routes', [
    { route: '/', templateUrl: 'home.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
    { route: '/documents', templateUrl: 'documents.html', controller: 'DocumentsCtrl', controllerAs: 'ctrl', menu: 'Dokumenty', role: 'u' },
    { route: '/invoice', templateUrl: 'invoice.html', controller: 'InvoiceCtrl', controllerAs: 'ctrl', menu: 'Faktura', role: 'u' },
    { route: '/audit', templateUrl: 'audit.html', controller: 'AuditCtrl', controllerAs: 'ctrl', menu: 'Audyt', role: '' }
])

// router installation
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i])
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

app.controller('Ctrl', [ '$scope', '$location', '$http', 'routes', function($scope, $location, $http, routes) {
    console.log('Kontroler Ctrl startuje')
    let ctrl = this

    ctrl.login = ctrl.role = ''
    ctrl.creds = { login: '', password: '' }

    ctrl.doLogin = function() {
        $http.post('/auth', ctrl.creds).then(function(res) {
            ctrl.login = res.data.login
            ctrl.role = res.data.role
            rebuildMenu()
        }, function(err) {
            alert('Błąd logowania')
        })
    }

    ctrl.doLogout = function() {
        $http.delete('/auth').then(function(res) {
            ctrl.login = ctrl.role = ''
            rebuildMenu()
        }, function(err) {})
    }

    // menu building

    ctrl.menu = []

    let rebuildMenu = function() {
        ctrl.menu.length = 0
        for(let i in routes) {
            if(!routes[i].role || (ctrl.role && routes[i].role.match(new RegExp('[' + ctrl.role + ']')))) {
                ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
            }
        }
        $location.path('/')
    }

    ctrl.isCollapsed = true
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true
    })
    
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : ''
    }    

    $http.get('/auth').then(function(res) {
        ctrl.login = res.data.login
        ctrl.role = res.data.role
        rebuildMenu()
    }, function(err) {})

}])