// 宠物管理
angular.module('fiona').controller('PetController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {petBreedSet: "绝育状态",statusSet: "宠物状态", statusSet: "会员状态"},
        userdicts: {petSexSet: "动物性别",petSkinColorSet: "动物颜色", gestSexSet: "性别"}
    };

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "gestStyle", server: "/api/v2/gestlevels"});

    $scope.dropdownWithTable({id: "raceType", server: "/api/v2/petraces"});

    $scope.dropdownWithTable({id: "petRace", server: "/api/v2/varieties"});

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 选择会员
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.filter();
});
