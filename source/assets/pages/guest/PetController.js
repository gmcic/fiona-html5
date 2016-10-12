// 宠物管理
angular.module('fiona').controller('PetController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "raceTypeSet", server: "petraces"}, // 种类
        {name: "petRaceSet", server: "varieties"}, // 品种
        {name: "petBreedSet", server: "dicts", filterName: "绝育状态"},
        {name: "sickFileCodeSet", server: "dicts", filterName: "宠物状态"},
        {name: "petSexSet", server: "userdicts", filterName: "动物性别"},
        {name: "petSkinColorSet", server: "userdicts", filterName: "动物颜色"}
    ];

    $scope.dropdowns= {};

    // 主数据加载地址
    $scope.master = {
        id: "pet",

        name: "宠物管理",

        server: "/api/v2/pets",

        insert: function () {
            angular.forEach($scope.dropdowns, function (value, key) {
                if(key != 'raceTypeSet')
                {
                    $scope.pet[key.substr(0, key.length - 3)] = value[0];
                }
            });
        },

        update: function () {
            $scope.vipportal.get($scope.pet.gestId);
            // $scope.vipportal.search();
        }
    };

    // 综合搜索项
    $scope.filters = [
        // 宠物昵称
        {"fieldName": "petCode","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "petName","operator": "EQ", "value":""},

        // 会员编号
        {"fieldName": "gestCode","operator": "EQ", "value":""},

        // 会员名称
        {"fieldName": "gestName","operator": "EQ", "value":""}
    ];

    $scope.placeholder = "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话";

    $controller('BasePaginationController', {$scope: $scope}); //继承


    /**
     * 选择会员
     * ---------------------------
     * */
    $scope.vipportal = {
        dropdowns: {},

        dropboxargs : [
            {name: "gestStyleSet", server: "gestlevels"},
            {name: "statusSet", server: "dicts", filterName: "会员状态"},
            {name: "gestSexSet", server: "userdicts", filterName: "性别"}
        ],

        master: {
            id: "vip",

            name: "会员",

            server: "/api/v2/gests",

            checked: function () {
                // 主人ID
                $scope.pet.gestId = $scope.vip.id;

                // 主人编号
                $scope.pet.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.pet.gestName = $scope.vip.gestName;
            },
            submit: function () {
                // 主人ID
                $scope.pet.gestId = $scope.vip.id;

                // 主人编号
                $scope.pet.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.pet.gestName = $scope.vip.gestName;
            },
            insert: function () {
                angular.forEach($scope.vipportal.dropdowns, function (value, key) {
                    $scope.vip[key.substr(0, key.length - 3)] = value[0];
                });
            }
        },

        parent: {
            id: "labwork"
        }
    };

    $controller('CommonVipController', {$scope: $scope, component: $scope.vipportal}); //继承
});
