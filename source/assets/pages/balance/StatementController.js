// 支出管理
angular.module('fiona').controller('StatementController', function($scope, $controller, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {types: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 支出管理
     * ---------------------------
     * */
    $scope.statementportal = {

        id: "statement",

        name: "支出管理",

        server: "/api/v2/personss",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementportal}); //继承

});
