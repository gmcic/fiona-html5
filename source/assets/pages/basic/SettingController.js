
// 应用参数配置
angular.module('fiona').controller('SettingController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {companyTypeSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]};

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