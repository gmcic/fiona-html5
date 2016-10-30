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
//    $scope.petportal= {
//
//        id: "pet",
//
//        name: "宠物管理",
//
//        server: "/api/v2/pets",
//
//        defilters: {"petCode": "宠物病例号",  "petName": "宠物昵称",  "gestCode": "会员编号",  "gestName": "会员名称",  "gestPhone": "会员电话"},
//
//        callback: {
//            insert: function () {
//
//                $scope.setSelectDefault("pet", ["petBreed.valueNameCn"]);
//
//                $scope.setSelectDefaultObject("pet", ["petSkinColor", "petSex", "petRace", "status"]);
//
//                $scope.serialNumber({id: "pet", fieldName : "petCode", numberName : "宠物编号"});
//            },
//
//            update: function () {
//                $scope.replaceLocalObject("pet", ["petSkinColor", "petSex", "petRace", "status"]);
//
//                $scope.vipportal.unique($scope.pet.gestId);
//            }
//        }
//    };
//
//    $controller('BaseCRUDController', {$scope: $scope, component: $scope.petportal}); //继承

    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 选择会员
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.filter();
});
