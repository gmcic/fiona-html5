// 会员管理
angular.module('fiona').controller('VipController', function ($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {petBreedSet: "绝育状态",statusSet: "宠物状态", statusSet: "会员状态"},
        userdicts: {petSexSet: "动物性别",petSkinColorSet: "动物颜色", gestSexSet: "性别"}
    };

    $scope.dropdowns = {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "gestStyle", server: "/api/v2/gestlevels"});

    $scope.dropdownWithTable({id: "raceType", server: "/api/v2/petraces"});

    $scope.dropdownWithTable({id: "petRace", server: "/api/v2/varieties"});

    $scope.local = {'age' : 0, recount : function () {
        var date = new Date($scope.vip.gestBirthday);

        if($scope.vip.gestBirthday) {
            var year = '2014-10-12'.substr(0, 4);

            var age = parseInt(new Date().getFullYear()) - parseInt(year);

            $scope.local.age = age;
        }
    }};

    /**
     * 会员管理
     * ---------------------------
     * */
    $scope.vipportal= {

        id: "vip",

        name: "会员列表",

        server: "/api/v2/gests",

        defilters: {"gestCode": "会员编号",  "gestName": "会员名称",  "mobilePhone": "会员电话"},

        callback: {
            insert: function () {

                // 生成-会员编号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=会员编号").success(function (data, status, headers, config) {
                    $scope.vip.gestCode = data.data;
                }).error(function (data, status, headers, config) { //     错误
                    commons.modaldanger("vip", "生成会员编号失败");
                });

                angular.forEach(['gestSex', 'gestStyle', 'status'], function (key) {
                    $scope.vip[key] = $scope.dropdowns[key + 'Set'][0];
                });
            },

            update: function () {

                $scope.petportal.search();

                $scope.local.recount();

                angular.forEach($scope.dropdowns.gestSexSet, function (data) {
                    if(data.id == $scope.vip.gestSex.id)
                    {
                        $scope.vip.gestSex = data;
                    }
                });

                angular.forEach($scope.dropdowns.gestStyleSet, function (data) {
                    if(data.id == $scope.vip.gestStyle.id)
                    {
                        $scope.vip.gestStyle = data;
                    }
                });

                if($scope.vip.status)
                {
                    angular.forEach($scope.dropdowns.statusSet, function (data) {
                        if(data.id == $scope.vip.status.id)
                        {
                            $scope.vip.status = data;
                        }
                    });
                }
            },

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.pets, function (data, index, array) {
                    $scope.pet = data;

                    // 会员ID: gestId 会员编号: gestCode 会员姓名: gestName
                    $scope.pet.gestId = $scope.vip.id;

                    $scope.pet.gestCode = $scope.vip.gestCode;

                    $scope.pet.gestName = $scope.vip.gestName;

                    $scope.petportal.save();
                });
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

        // defilters: {"petCode": "宠物病例号",  "petName": "宠物昵称",  "gestCode": "会员编号",  "gestName": "会员名称",  "gestPhone": "会员电话"},

        callback: {
            insert: function () {
                angular.forEach(['status', 'petBreed', 'petSkinColor', 'petRace', 'petSex'], function (key) {
                    if($scope.dropdowns[key + 'Set'])
                    {
                        $scope.pet[key] = $scope.dropdowns[key + 'Set'][0];
                    }
                });

                // 生成-会员编号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=宠物编号").success(function (data, status, headers, config) {
                    $scope.pet.petCode = data.data;
                }).error(function (data, status, headers, config) { //     错误
                    commons.modaldanger("vip", "生成宠物编号失败");
                });
            },
            update: function () {
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.petportal}); //继承

    $scope.vipportal.filter();
});



