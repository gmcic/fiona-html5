// 会员管理
angular.module('fiona').controller('VipController', function ($scope, $controller) {

// 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {statusSet: "会员状态"},
        userdicts: {gestSexSet: "性别"}
    };

    $scope.dropdowns = {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "gestStyle", server: "/api/v2/gestlevels", code: "id", text: "levelName"});

    /**
     * 挂号查询
     * ---------------------------
     * */
    $scope.vipportal= {

        id: "vip",

        name: "会员列表",

        server: "/api/v2/gests",

        defilters: {"petCode": "宠物病例号",  "petName": "宠物昵称",  "gestCode": "会员编号",  "gestName": "会员名称",  "gestPhone": "会员电话"},

        callback: {
            insert: function () {
                angular.forEach($scope.dropdowns, function (value, key) {
                    $scope.vip[key.substr(0, key.length - 3)] = value[0];
                });
            },
            update: function () {
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipportal}); //继承


    /**
     * 宠物管理
     * ---------------------------
     * */
    $scope.petportal= {

        foreign: "vip",

        foreignkey: "gestId",

        id: "pet",

        name: "宠物管理",

        server: "/api/v2/pets",

        defilters: {"petCode": "宠物病例号",  "petName": "宠物昵称",  "gestCode": "会员编号",  "gestName": "会员名称",  "gestPhone": "会员电话"},

        callback: {
            insert: function () {
                angular.forEach($scope.petportal.dropdowns, function (value, key) {
                    if(key != 'raceTypeSet')
                    {
                        $scope.pet[key.substr(0, key.length - 3)] = value[0];
                    }
                });
            },
            update: function () {
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.petportal}); //继承

    $scope.vipportal.filter();
});



