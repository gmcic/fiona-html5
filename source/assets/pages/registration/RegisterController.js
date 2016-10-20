// 挂号查询
angular.module('fiona').controller('RegisterController', function($scope, $controller, $http, commons) {
     
    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "gestStyleSet", server: "gestlevels"},
        {name: "statusSet", server: "dicts", filterName: "会员状态"},
        {name: "gestSexSet", server: "userdicts", filterName: "性别"},

        {name: "raceTypeSet", server: "petraces"}, // 种类
        {name: "petRaceSet", server: "varieties"}, // 品种
        {name: "petBreedSet", server: "dicts", filterName: "绝育状态"},
        {name: "sickFileCodeSet", server: "dicts", filterName: "宠物状态"},
        {name: "petSexSet", server: "userdicts", filterName: "动物性别"},
        {name: "petSkinColorSet", server: "userdicts", filterName: "动物颜色"},

        {name: "registerStyleSet", server: "products", filterName: "挂号项目"},
        {name: "doctorIdSet", server: "personss"}, // 医生
        {name: "assistantDoctorIdSet", server: "personss"}  // 服务助理ID
    ];
    
    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承`

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 挂号查询
     * ---------------------------
     * */
    $scope.registerportal= {

        id: "register",

        name: "挂号查询",

        server: "/api/v2/medicregisterrecords",

        defilters: {"code": "自动编号", "name": "经销商名称", "contractMan": "联系人", "mobilePhone": "手机", "dealerAddress": "地址"},

        callback: {
            insert: function () {
                angular.forEach($scope.dropdowns, function (value, key) {
                    $scope.register[key.substr(0, key.length - 3)] = value[0];
                });
            },
            update: function () {
                // $scope.petportal.get($scope.beauty.gestId);
                // $scope.vipportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.registerportal}); //继承

    $scope.registerfastmodal = function () {
        $("#registerfast").modal('toggle');
    };

    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.init();

    //
    // $controller('PetPopupSelectController', {$scope: $scope}); //继承
    //
    // $scope.petportal.master.checked = function () {
    //     // 主人ID
    //     $scope.register.gestId = $scope.pet.id;
    //
    //     // 主人编号
    //     $scope.register.gestCode = $scope.pet.gestCode;
    //
    //     // 主人名称
    //     $scope.register.gestName = $scope.pet.gestName;
    // };
    //
    // $scope.petportal.master.submit = function () {
    //     // 主人ID
    //     $scope.register.gestId = $scope.pet.id;
    //
    //     // 主人编号
    //     $scope.register.gestCode = $scope.pet.gestCode;
    //
    //     // 主人名称
    //     $scope.register.gestName = $scope.pet.gestName;
    // };
    //
    // $scope.petportal.master.insert = function () {
    //     angular.forEach($scope.petportal.dropdowns, function (value, key) {
    //         $scope.pet[key.substr(0, key.length - 3)] = value[0];
    //     });
    // };

});