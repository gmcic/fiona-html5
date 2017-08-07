// 宠物管理
angular.module('fiona').controller('PetController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {petBreedSet: "绝育状态",statusSet: "宠物状态", statusSet: "会员状态", petSexSet: "动物性别",petSkinColorSet: "动物颜色", gestSexSet: "性别", gestStyleSet: "用户等级", raceTypeSet : "宠物种类", petRaceSet: "宠物品种"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $("#pet").on('shown.bs.modal', function(){
        var petRace = $('#petRace').select2();
        petRace.val($('#petRace').val()).trigger("change");
    })

    /**
     * 选择会员
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.filter();
});
