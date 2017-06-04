// 挂号查询
angular.module('fiona').controller('RegisterController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {statusSet: "会员状态",petBreedSet: "绝育状态", sickFileCodeSet: "宠物状态", paidStatusSet: "付款状态", gestSexSet: "性别",petSexSet: "动物性别", petSkinColorSet: "动物颜色", gestStyleSet: "用户级别", raceTypeSet: "种类", petRaceSet: "品种", doctorIdSet: "主治医生", operatorManSet: "业务员", assistantDoctorIdSet: "服务助理"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 挂号服务类型
    $scope.dropdownWithTable({id: "itemCode", server: "/api/v2/itemtypes", condition : {"cateNo": "ICate10"}});

    /**
     * 挂号查询
     * ---------------------------
     * */
    $scope.registerportal= {

        id: "register",

        name: "挂号查询",

        server: "/api/v2/medicregisterrecords",

        defilters: {petName: "宠物名称", gestName: "会员姓名", doctorId: "医生", itemName: "挂号类型名称"},

        isRemoves:true,

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
                if (!$scope.register.gestName){
                    $scope.register.gestName = $scope.pet.gestName;
                    $scope.register.petName = $scope.pet.petName;
                    $scope.register.petId = $scope.pet.id;
                }
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

            $("#registerfast").modal({backdrop: 'static', keyboard: false});
            //
            // alert($("#registerfast").find('#gestSex').find('option[value="0"]').length);
            // // $("#registerfast").find('#gestSex').val(0);
            // $("#registerfast").find('#gestSex').find('option[value="0"]').prop("selected",true);
        },
        submit: function () {

            $scope["registerfastform"].submitted = true;

            if ($scope["registerfastform"].$valid) {

                $scope.vipportal.save();

                $("#registerfast").modal('hide');

                commons.success("保存成功")
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

      $scope.petportal.checked = function (pet) {

        $scope.register.petId = pet.id;

        var _wheres = [{"fieldName": "petId", "operator": "EQ", "value": pet.id}];

        var _filters = [{"fieldName": "status.dictDetailCode", "operator": "EQ", "value": "SM00034"}, {"fieldName": "status.dictDetailCode", "operator": "EQ", "value": "SM00035"}, {"fieldName": "status.dictDetailCode", "operator": "EQ", "value": "SM00036"}];

        $http.post(commons.getBusinessHostname() + $scope.registerportal.server + "/page" + commons.getTimestampStr(), { 'pageSize': 10000, 'pageNumber': 1, "filters": _filters, 'andFilters': _wheres})
        .success(function (data, status, headers, config) {

            console.log(data.data.content)

            if(data.data.content.length == 0 )
            {
              $scope.pet = pet;

              $scope.vipportal.unique($scope.pet.gestId);

              $("#petselect").modal('hide');
            }
            else
            {
              var _reg = data.data.content[0];

              commons.modaldanger("petselect", "宠物 " +_reg.petName+ "(" +_reg.gestName+ ") 正在就诊中，不允许重复挂号，登记编号: " + _reg.registerNo);
            }
        });
      };

    /**
     * 直接保存
     * ---------------------------
     * */
    $scope.registerportal.save = function () {

        $scope.register.gestName = $scope.pet.gestName;
        $scope.register.petName = $scope.pet.petName;
        $scope.register.petId = $scope.pet.id;

        $http.post(commons.getBusinessHostname() + $scope.registerportal.server + commons.getTimestampStr(), $scope.register).success(function (data, status, headers, config) {

            $scope.register = data.data;

            $scope["registers"].unshift(data.data);

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger("register", "保存失败")
        });
    };

    $scope.petportal.init();

    $scope.registerportal.filter();

});
