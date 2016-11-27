
// 宠物管理
angular.module('fiona').controller('CheckdeviceController', function($scope, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {companyTypeSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]};

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