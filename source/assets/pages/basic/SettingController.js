
// 应用参数配置
angular.module('fiona').controller('SettingController', function($scope, $controller, $http, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.settingportal= {

        id: "setting",

        name: "角色管理",

        defilters: {},

        server: "/api/v2/settings",

        callback: {
            insert: function () {
                $scope.setSelectDefault("setting", ["companyType"]);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.settingportal}); //继承

    $scope.settingportal.list();
});