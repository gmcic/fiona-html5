// 支出管理
angular.module('fiona').controller('ExpenditureController', function ($scope, $controller) {

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 目录树数据加载地址
     * ---------------------------
     * */
    $scope.expendituretypeportal = {
        id: "expendituretype",

        name: "支出分类",

        server: "/api/v2/expensescates",

        callback: {
            switched: function () {
                $scope.expenditureportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.expendituretypeportal}); //继承

    $scope.expendituretypeportal.init();

    /**
     * 主数据加载地址
     * ---------------------------
     * */
    $scope.expenditureportal= {

        foreign: "expendituretype", // 外键

        foreignkey: "cateNo",

        id: "expenditure",

        name: "支出管理",

        server: "/api/v2/expensesexpends"
    };

    $controller('TablePaginationPanelController', {$scope: $scope, component: $scope.expenditureportal}); //继承

    // $controller('BaseSideController', {$scope: $scope}); //继承

    // $scope.init();
});