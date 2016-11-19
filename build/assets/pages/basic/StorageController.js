
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

                $scope.serialNumber({id: "storage", fieldName : "code", numberName : "仓库编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.storageportal}); //继承

    $scope.storageportal.list();
});