
angular.module('fiona').controller('StorageController', function($scope, $controller, $http, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型", drugStoreSet: "onoffWithBoolean", sellStoreSet: "onoffWithBoolean"});

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