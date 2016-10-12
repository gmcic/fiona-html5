
// 宠物品种管理
angular.module('fiona').controller('VarietieController', function($scope, $controller, $http, commons) {

    /**
     * 宠物品种
     * ---------------------------
     * */
    $scope.varietieportal= {

        foreign: "varietietype", // 外键

        foreignkey: "petRace",

        id: "varietie",

        name: "品种",

        server: "/api/v2/varieties"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.varietieportal}); //继承

    /**
     * 宠物种类
     * ---------------------------
     * */
    $scope.varietietypeportal = {
        id: "varietietype",

        name: "种类",

        server: "/api/v2/petraces",

        callback: {
            switched: function () {
                $scope.varietieportal.list();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.varietietypeportal}); //继承

    $scope.varietietypeportal.init();
});