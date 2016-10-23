// 挂号查询
angular.module('fiona').controller('RegisterController', function($scope, $controller, $http, commons) {


    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {statusSet: "会员状态",petBreedSet: "绝育状态", sickFileCodeSet: "宠物状态"},
        userdicts: {gestSexSet: "性别",petSexSet: "动物性别", petSkinColorSet: "动物颜色"}
    };

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "gestStyle", server: "/api/v2/gestlevels"}); // 会员级别
    $scope.dropdownWithTable({id: "raceType", server: "/api/v2/petraces"}); // 种类
    $scope.dropdownWithTable({id: "petRace", server: "/api/v2/varieties"});// 品种

    $scope.dropdownWithTable({id: "doctorId", server: "/api/v2/personss"}); // 医生
    $scope.dropdownWithTable({id: "operatorMan", server: "/api/v2/personss"}); // 业务员
    $scope.dropdownWithTable({id: "assistantDoctorId", server: "/api/v2/personss"}); // 服务助理

    // 挂号服务类型
    $http.post(commons.getBusinessHostname() + "/api/v2/itemtypes/page", {
        'pageSize': 10000,
        'pageNumber': 1,
        'filters': [{"fieldName": 'cateNo', "operator": "EQ", "value": '2d8d75d7-c7af-4ceb-901b-22a7141c87bc'}]
    }).success(function (data, status, headers, config) {
        $scope.dropdowns["itemCodeSet"] = data.data.content;
    });

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
            selectsync: function (inputName, selectObj) {

                if(inputName == 'itemCode')
                {
                    $scope.register.itemName = selectObj.itemName;
                }
                else if(inputName == 'doctorId')
                {
                    $scope.register.doctor = selectObj.personName;
                }
                else if(inputName == 'assistantDoctorId')
                {
                    $scope.register.assistantDoctorName = selectObj.personName;
                }
            },
            submitbefore: function () {
                $scope.register.gestName = $scope.pet.gestName;
                $scope.register.petName = $scope.pet.petName;
                $scope.register.petId = $scope.pet.id;
            },
            insert: function () {

                // 生成-登记编号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=登记编号").success(function (data, status, headers, config) {
                    $scope.register.registerNo = data.data;
                }).error(function (data, status, headers, config) { //     错误
                    commons.modaldanger("register", "生成登记编号失败");
                });

                // $scope.setSelectDefault("register", ["doctorId", "operatorMan", "assistantDoctorId", "itemCode"]);
            },
            update: function () {
                // $scope.petportal.get($scope.beauty.gestId);
                // $scope.vipportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.registerportal}); //继承

    $scope.registerfastportal = {

        selectchange : function (inputName, fieldName) {

            // 本对象字段名, 选择对象的字段名
            angular.forEach($scope.dropdowns[inputName  + 'Set'], function (data) {
                if($scope.register[inputName] == data[fieldName])
                {
                    if($scope.registerfastportal.selectsync)
                    {
                        $scope.registerfastportal.selectsync(inputName, data);
                    }
                }
            });
        },

        selectsync: function (inputName, selectObj) {

            if(inputName == 'itemCode')
            {
                $scope.register.itemName = selectObj.itemName;
            }
            else if(inputName == 'doctorId')
            {
                $scope.register.doctor = selectObj.personName;
            }
            else if(inputName == 'assistantDoctorId')
            {
                $scope.register.assistantDoctorName = selectObj.personName;
            }
        },

        insert: function () {
            $scope.vip = {};
            $scope.pet = {};
            $scope.register = {};

            // 生成-会员编号
            $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=会员编号").success(function (data, status, headers, config) {
                $scope.vip.gestCode = data.data;
            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger("registerfast", "生成会员编号失败");
            });

            // 生成-会员编号
            $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=宠物编号").success(function (data, status, headers, config) {

                $scope.pet.petCode = data.data;

            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger("vip", "生成宠物编号失败");
            });

            // 生成-登记编号
            $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=登记编号").success(function (data, status, headers, config) {
                $scope.register.registerNo = data.data;
            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger("register", "生成登记编号失败");
            });

            // 设置默认选项

            $scope.setSelectDefaultObject("vip", ["gestSex", "gestStyle", "status"]);

            $scope.setSelectDefaultObject("pet", ["personStatus", "petSex"]);

            $scope.setSelectDefault("pet", ["petBreed"]);

            $("#registerfast").modal('toggle');
            //
            // alert($("#registerfast").find('#gestSex').find('option[value="0"]').length);
            // // $("#registerfast").find('#gestSex').val(0);
            // $("#registerfast").find('#gestSex').find('option[value="0"]').prop("selected",true);
        },
        submit: function () {

            $scope["registerfastform"].submitted = true;

            if ($scope["registerfastform"].$valid) {

                $scope.vipportal.save();

                commons.success("保存成功")

                $("#registerfast").modal('toggle');
            }
        }
    };

    /**
     * 会员管理
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.vipportal.callback.save = function () {

        // 会员ID: gestId 会员编号: gestCode 会员姓名: gestName
        $scope.pet.gestId = $scope.vip.id;

        $scope.pet.gestCode = $scope.vip.gestCode;

        $scope.pet.gestName = $scope.vip.gestName;

        $scope.petportal.save();
    };

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.callback.save = function () {

        $scope.register.gestName = $scope.pet.gestName;
        $scope.register.petName = $scope.pet.petName;
        $scope.register.petId = $scope.pet.id;

        $scope.registerportal.save();
    };

    /**
     * 直接保存
     * ---------------------------
     * */
    $scope.registerportal.save = function () {

        $scope.register.gestName = $scope.pet.gestName;
        $scope.register.petName = $scope.pet.petName;
        $scope.register.petId = $scope.pet.id;

        $http.post(commons.getBusinessHostname() + $scope.registerportal.server, $scope.register).success(function (data, status, headers, config) {

            $scope.register = data.data;

            $scope["registers"].unshift(data.data);

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger("register", "保存失败")
        });
    };

    $scope.petportal.init();

    $scope.registerportal.filter();

});