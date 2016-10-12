
angular.module('fiona').controller('StorageController', function($scope, $controller, $http, commons) {


    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {
        drugStoreSet: [{id: false, valueNameCn: "否"}, {id: true, valueNameCn: "是"}],
        sellStoreSet: [{id: false, valueNameCn: "否"}, {id: true, valueNameCn: "是"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 仓库信息管理
     * ---------------------------
     * */
    $scope.storageportal= {
        id: "storage",

        name: "仓库信息管理",

        server: "/api/v2/warehouses",

        callback: {
            insert: function () {
                $scope.setSelectDefault("storage", ["drugStore", "sellStore"]);

                // $scope.dealer.code = commons.serialNumber(); // 自动编号

                // $scope.dealer.companyType = "1"; // 类型
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.storageportal}); //继承

    $scope.storageportal.list();
});