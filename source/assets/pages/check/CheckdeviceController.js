
// 宠物管理
angular.module('fiona').controller('CheckdeviceController', function($scope, $http, commons) {

    $scope.dropdowns= { };

    commons.findDict($scope.dropdowns, {companyTypeSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.checkdeviceportal= {

        id: "checkdevice",

        name: "经销商与生产商",

        defilters: {},

        server: "/api/v2/checkdevices",

        callback: {
            insert: function () {
                $scope.setSelectDefault("checkdevice", ["companyType"]);

                $scope.serialNumber({id: "checkdevice", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.checkdeviceportal}); //继承

    $scope.checkdeviceportal.list();
});