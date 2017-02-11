// 会员管理
angular.module('fiona').controller('VipController', function ($scope, $controller, $http, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {petBreedSet: "绝育状态",statusSet: "宠物状态", statusSet: "会员状态", petSexSet: "动物性别",petSkinColorSet: "动物颜色", gestSexSet: "性别", gestStyleSet: "用户等级", petRaceSet: "宠物品种", raceTypeSet: "宠物种类"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

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

                $scope.pets = [];

                $scope.serialNumber({id: "vip", fieldName : "gestCode", numberName : "会员编号"});

                $scope.setSelectDefaultObject("vip", ["gestSex", "gestStyle", "status"]);
            },

            update: function () {
                $scope.petportal.searchByWhere({gestId: $scope.vip.id});

                $scope.local.recount();

                $scope.replaceLocalObject("vip", ["gestSex", "gestStyle", "status"]);
            },

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.pets, function (pet, index, array) {
                    // 会员ID: gestId 会员编号: gestCode 会员姓名: gestName
                    pet.gestId = $scope.vip.id;

                    pet.gestCode = $scope.vip.gestCode;

                    pet.gestName = $scope.vip.gestName;

                    $scope.petportal.saveWithEntity(pet);
                });
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipportal}); //继承

    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.foreign =  "vip";
    $scope.petportal.foreignkey =  "gestId";

    $scope.petportal.callback.update = function () {
      $scope.replaceLocalObject("pet", ["petSkinColor", "petSex", "petRace", "status"]);
    }

    $scope.petportal.submit = function(){

        $scope["petform"].submitted = true;

        if (!!this.callback && !!this.callback.submitbefore) {
            this.callback.submitbefore();
        }

        if ($scope["petform"].$valid) {
            $scope["pets"].unshift($scope.pet);
        }

        $('#' + this.id).modal('hide');
    };


    // 充值
    $scope.vipportal.recharge  = function (_vip) {
        $scope.vip = _vip;

        $scope.vipprepay  = {gestId: _vip.id};

        $('#vipprepay').modal({backdrop: 'static', keyboard: false});
    };

    $scope.vipprepayportal = {
        submit: function () {
            $http.get(commons.getBusinessHostname() + "/api/v2/gests/" +$scope.vipprepay.gestId+ "/recharge?money="+ $scope.vipprepay.inputMoney).success(function (data, status, headers, config) {
                console.log(data.data);

                $scope.vipprepaydata = data.data;

                $scope.vipprepayportal.print();

                $('#vipprepay').modal('hide');

            }).error(function (data, status, headers, config) {
                commons.modaldanger("vipprepay", "充值失败!!!")
            });
        }
    };

    $scope.vipprepayportal.print = function () {

        $scope.nowtime = new Date();

        $('#vipprepayprint').modal({backdrop: 'static', keyboard: false});
    };

    // 打印页面
    $scope.print = function () {
        document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = $('#vipprepayprintbody').html();
        document.getElementById('printiframe').contentWindow.print();
        // $('#doctorprescriptprint').modal({backdrop: 'static', keyboard: false});
    };

    $scope.vipportal.filter();
});



