
// 角色管理
angular.module('fiona').controller('RoleController', function($scope, $controller, $http, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.roleportal= {

        id: "role",

        name: "角色管理",

        defilters: {},

        server: "/api/v2/roles",

        callback: {
            insert: function () {
                $scope.setSelectDefault("role", ["companyType"]);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.roleportal}); //继承

    $scope.roleportal.list();
});