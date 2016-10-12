// 库存查询
angular.module('fiona').controller('StockController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 库存查询
     * ---------------------------
     * */
    $scope.stockportal= {

        foreign: "storage", // 外键

        foreignkey: "warehouseCode",

        id: "stock",

        name: "库存查询",

        server: "/api/v2/itemcounts"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.stockportal}); //继承


    /**
     * 仓库
     * ---------------------------
     * */
    $scope.storageportal = {
        id: "storage",

        name: "仓库",

        server: "/api/v2/warehouses",

        callback: {
            switched: function () {
                $scope.stockportal.list();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.storageportal}); //继承

    $scope.storageportal.init();


    // // 主数据加载地址
    // $scope.master = {
    //     id: "stock",
    //
    //     name: "库存查询",
    //
    //     foreignkey: "warehouseCode",
    //
    //     server: "/api/v2/itemcounts",
    // };
    //
    // $controller('BaseSideController', {$scope: $scope}); //继承
    //
    // $scope.init();
});