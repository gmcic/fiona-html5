// 支出管理
angular.module('fiona').controller('ExpenditureController', function ($scope, $controller) {

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 支出分类
     * ---------------------------
     * */
    $scope.expendituretypeportal= {

        id: "expendituretype",

        name: "支出分类",

        server: "/api/v2/expensescates"
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.expendituretypeportal}); //继承

    /**
     * 宠物品种
     * ---------------------------
     * */
    $scope.expenditureportal= {

        foreign: "expendituretype", // 外键

        foreignkey: "cateNo",

        id: "expenditure",

        name: "支出管理",

        server: "/api/v2/expensesexpends"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.expenditureportal}); //继承

    $scope.expendituretypeportal.init();
});