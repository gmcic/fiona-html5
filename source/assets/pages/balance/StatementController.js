// 支出管理
angular.module('fiona').controller('StatementController', function($scope, $controller, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {types: "厂家类型", packageUnitSet: "物品单位"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 支出管理
     * ---------------------------
     * */
    $scope.statementportal = {

        id: "statement",

        name: "支出管理",

        server: "/api/v2/financesettleaccountss",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {
            view: function () {
              $scope.statementdetailportal.searchAll();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementportal}); //继承

    /**
     * 支出管理
     * ---------------------------
     * */
    $scope.statementdetailportal = {

        foreign: "statement", // 父表的标识

        foreignkey: "settleAccountsDetailId", // 表关联使用的字段

        id: "statementdetail",

        name: "支出管理",

        server: "/api/v2/financesettleaccountsdetails",

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementdetailportal}); //继承


  $scope.statementportal.filter();
});
