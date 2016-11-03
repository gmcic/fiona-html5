
// 宠物管理
angular.module('fiona').controller('CuremanagerController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {statusSet: "会员状态",petBreedSet: "绝育状态", sickFileCodeSet: "宠物状态", doctorStatusSet : "就诊状态"},
        userdicts: {gestSexSet: "性别",petSexSet: "动物性别", petSkinColorSet: "动物颜色", frequencySet: "用药频次", useWaySet: "药品使用方法", useUnitSet: "物品单位"},
        callback : {
            dicts: function()
            {
                $scope.dropdowns.recipeUnitSet = $scope.dropdowns.useUnitSet;
//                console.log($scope.dropdowns.recipeUnitSet);

                // SM00036	已中止
                angular.forEach($scope.dropdowns.doctorStatusSet, function(data){

                    if(data.dictDetailCode == 'SM00034') // 待就诊
                    {
                        $scope.waitStatus = data;
                    }
                    else if(data.dictDetailCode == 'SM00035') // 就诊中
                    {
                        $scope.playStatus = data;
                    }
                    else if(data.dictDetailCode == 'SM00036') // 已中止
                    {
                        $scope.pauseStatus = data;
                    }
                    else if(data.dictDetailCode == 'SM00037') // 已就诊
                    {
                        $scope.stopStatus = data;
                    }
                });
            }
        }
    };

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

     $scope.isPlayList= function(data) {
        return (data.status.dictDetailCode == 'SM00034' || data.status.dictDetailCode == 'SM00035')
     };

    /**
     *  开始诊断 | 结束诊断 | 完成诊断
     * ---------------------------
     * */
    $scope.play = function (entity) {

        $scope.register = entity;

//        console.log("Play");
//        console.log($scope.register);

        // 查询挂号信息
        $scope.petportal.unique($scope.register.petId);

        // 查询就诊信息
        $http.post(commons.getBusinessHostname() + $scope.curemanagerportal.server, {registerNo: $scope.register.registerNo}).success(function (data, status, headers, config) {
            $scope.curemanager = data.data;
            $scope.doctorprescriptportal.search();

            if(entity.status.dictDetailCode == 'SM00034')
            {
                $scope.register.status = $scope.playStatus;
                $scope.curemanager.status = $scope.playStatus;

                $scope.registerportal.save();
                $scope.curemanagerportal.save();
            }
        });

//
//        angular.forEach($scope.registers, function(data){
//            alert(data.status.dictDetailCode + ", " + data.status.valueNameCn);
//        });

        $('#curelist a[href="//#cure_pet"]').tab('show') // Select tab by
    };

    // 暂停就诊
    $scope.pause= function () {

//        console.log("Pause");
        // SM00036	已中止
        $scope.register.status = $scope.pauseStatus;
        $scope.curemanager.status = $scope.pauseStatus;

        $scope.registerportal.save();
        $scope.curemanagerportal.save();

        console.log("pause.register");
        console.log($scope.register);

        $scope.plays.removeById($scope.register);
        $scope.pauses.push($scope.register);

    };

    // 重新诊断
    $scope.replay= function () {

        $scope.register.status = $scope.playStatus;
        $scope.curemanager.status = $scope.playStatus;

        $scope.registerportal.save();
        $scope.curemanagerportal.save();

        $scope.pauses.removeById($scope.register);
        $scope.plays.push($scope.register);

        $('#curelist a[href="//#cure_pet"]').tab('show') // Select tab by
    };

    // 结束就诊
    $scope.stop = function () {

        // SM00037	已就诊
        $scope.register.status = $scope.stopStatus;
        $scope.curemanager.status = $scope.stopStatus;

        $scope.registerportal.save();
        $scope.curemanagerportal.save();
    };

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
                // $scope.setSelectDefault("register", ["doctorId", "operatorMan", "assistantDoctorId", "itemCode"]);
            },
            update: function () {
                // $scope.petportal.get($scope.beauty.gestId);
                // $scope.vipportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.registerportal}); //继承

    /**
     *  诊断信息
     * ---------------------------
     * */
    $scope.curemanagerportal = {
        id: "curemanager",

        name: "诊断信息",

        server: "/api/v2/medicmedictreatrecords",

        history: function(){
           $scope.curemanagerportal.searchByWhere({"petId" : $scope.pet.id});

           $scope.historyview = "view";
        },

        underway: function(){
            $scope.curemanager= {};
           $scope.play($scope.register);
           $scope.historyview = "pet";
        },

        switched: function(_curemanager){
            $scope.curemanager = _curemanager;
            $scope.doctorprescriptportal.search();
        },

        callback: {
            submitbefore: function () {
                angular.forEach(["petId", "petName", "gestName", "doctor", "registerNo", "assistantDoctorName", "assistantDoctorId"], function (name) {
                    $scope.curemanager[name] = $scope.register[name];
                });
            },
            switched: function () {
                $scope.expenditureportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.curemanagerportal}); //继承

    // $scope.curemanagerportal.insert = function () {
    //
    //     $scope.curemanager = {};
    //
    //     // // 生成-登记编号
    //     $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=登记编号").success(function (data, status, headers, config) {
    //         $scope.register.registerNo = data.data;
    //     }).error(function (data, status, headers, config) { //     错误
    //         commons.danger("生成登记编号失败");
    //     });
    // };

    /**
     * 会员管理
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.callback.unique = function () {
        $scope.vipportal.unique($scope.pet.gestId);
    };

    /**
    * 化验单分类
    * ---------------------------
    * */
    $scope.testsheetportal = {
        id: "testsheet",

        name: "化验单",

        server: "/api/v2/medicchemicalexams",

        callback: {
            switched: function () {
                $scope.testsheetdetailportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.testsheetportal}); //继承

    /**
    * 化验单明细
    * ---------------------------
    * */
    $scope.testsheetdetailportal = {

        foreign: "dictionarytype", // 外键

        foreignkey: "dictTypeId",

        id: "testsheetdetail",

        name: "化验单明细",

        server: "/api/v2/medicchemicalexamdetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.testsheetdetailportal}); //继承

    /**
    * 医生处方
    * ---------------------------
    * */
    $scope.doctorprescriptportal = {
        id: "doctorprescript",

        name: "医生处方",

        server: "/api/v2/medicprescriptions",

        callback: {
            submitbefore: function () {

                $scope.doctorprescript.medicRecordCode = $scope.curemanager.mediTreatmentCode;

                $scope.doctorprescript.medicRecordId = $scope.curemanager.id;

                $scope.doctorprescript.gestName = $scope.curemanager.gestName;

                $scope.doctorprescript.petName = $scope.curemanager.petName;

                $scope.doctorprescript.doctor = $scope.curemanager.doctor;

                // 处方编号
                // $scope.doctorprescript.prescriptionCode = '';

                // 处方价格  - 计算总价格
                var cost = 0;

                angular.forEach($scope.doctorprescriptdetails, function (data) {
                    cost += data.itemCost * data.itemNum;
                });

                $scope.doctorprescript.prescriptionCost = cost;
            },

            submit: function () {
                angular.forEach($scope.doctorprescriptdetails, function (data) {

                    $scope.doctorprescriptdetail =data;
                    $scope.doctorprescriptdetail.prescriptionId = $scope.doctorprescript.id;

                    $scope.doctorprescriptdetailportal.save();
                });

                $scope.doctorprescriptdetail = {};
            },

            delete: function () {
                $scope.doctorprescriptdetails = [];
            },

            switched: function () {
                $scope.doctorprescriptdetailportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.doctorprescriptportal}); //继承

    $scope.doctorprescriptportal.print = function () {

        $scope.nowtime = new Date();

        // $scope.pet.age = $scope.getAgeByBirthday($scope.pet.petBirthday);

        $('#doctorprescriptprint').modal('toggle');
    };

    /**
     * 查询
     * ---------------------------
     * */
    $scope.doctorprescriptportal.search = function () {

        $http.post(commons.getBusinessHostname() + $scope.doctorprescriptportal.server + "/page", {'pageSize': 10000,'pageNumber': '1','filters': [{"fieldName": "medicRecordId", "operator": "EQ", "value": $scope.curemanager.id}]}).success(function (data, status, headers, config) {
            $scope.doctorprescripts = data.data.content;

            if($scope.doctorprescripts.length > 0) {
                $scope.doctorprescriptportal.switched($scope.doctorprescripts[0].id);

                if (!!$scope.doctorprescriptportal.callback && !!$scope.doctorprescriptportal.callback.search) {
                    $scope.doctorprescriptportal.callback.search();
                }
            }
        });
    };

    $scope.doctorprescriptportal.insert = function () {

        $scope.doctorprescriptportal.selectedId = null;

        $scope.doctorprescript = {};
        $scope.doctorprescriptdetails = [];

        // // 生成-登记编号
        $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=处方流水").success(function (data, status, headers, config) {
            $scope.doctorprescript.prescriptionCode = data.data;
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger("doctorprescript", "生成处方流水编号失败");
        });

        $("#doctorprescript").modal('toggle');
    };

    /**
    * 医生处方明细
    * ---------------------------
    * */
    $scope.doctorprescriptdetailportal = {

        foreign: "doctorprescript", // 外键

        foreignkey: "prescriptionId",

        id: "doctorprescriptdetail",

        name: "医生处方明细",

        server: "/api/v2/medicprescriptiondetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.doctorprescriptdetailportal}); //继承

    /**
     * 弹出选择处方模版
     * ---------------------------
     * */
    $scope.prescripttemplateportal= {

        id: "prescripttemplate",

        name: "选择会员",

        server: "/api/v2/prescriptiontemplates",

        defilters: {"gestCode": "会员编号",  "gestName": "会员名称",  "mobilePhone": "会员电话"},

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.prescripttemplateportal}); //继承

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $scope.productchecked = {}; // 已选择的商品

    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        console.log(this);

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }

        if($scope.productchecked[_product.itemCode]) {   // 是否已选择

        }
        else {
            // 未选择新添加

            var doctorprescriptdetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                doctorprescriptdetail[name] = _product[name];
            });

            doctorprescriptdetail.itemCost = _product.recipePrice;

            // 个数
            doctorprescriptdetail.itemNum = 1;

            $scope.productchecked[doctorprescriptdetail.itemCode] = doctorprescriptdetail;

            $scope.doctorprescriptdetails.push(doctorprescriptdetail);
        }

        commons.modalsuccess("product", "成功添加[ " +doctorprescriptdetail.itemName+ " ]商品");
    };

    $scope.productportal.submit = function () {

        angular.forEach($scope[$scope.productportal.id + "s"], function (_product) {
            if($scope.productportal.selection[_product.id])
            {
                $scope.productportal.checked(_product)
            }
        });

        $('#' + $scope.productportal.id + "select").modal('toggle');
    };

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    // 打印页面
    $scope.print = function () {

         $('#doctorprescriptprintbody').find(':text').each(function(i, node){
            var _text = $(node);
            _text.parent().html(_text.val());
         });

        document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML =$('#doctorprescriptprintbody').html();
        document.getElementById('printiframe').contentWindow.print();
    }

    /**
     * 弹出选择商品
     * ---------------------------
     * */

    // 查询等诊列表
//    $scope.registerportal.searchByWhere({"status": "SM00034"});
//    $scope.registerportal.list();

    $scope.themap = {};

    $http.get(commons.getBusinessHostname() + $scope.registerportal.server).success(function (data, status, headers, config) {

        if(!$scope.plays)
        {
            $scope.plays = [];
        }

        if(!$scope.pauses)
        {
            $scope.pauses = [];
        }

        angular.forEach(data.data, function(reg){

            if(!$scope.themap[reg.id])
            {
//                alert(reg.id + ", " + reg.status.dictDetailCode );

                $scope.themap[reg.id] = true;

                if(reg.status.dictDetailCode == 'SM00034')
                {
                    //  待诊
                    $scope.plays.push(reg);
                }
                else if(reg.status.dictDetailCode == 'SM00035')
                {
                    //  就诊中
                    $scope.plays.push(reg);
                }
                else if(reg.status.dictDetailCode == 'SM00036')
                {
                    //已暂停
                    $scope.pauses.push(reg);
                }
            }
        });

    });


    // 查询医院信息
    $http.get(commons.getBusinessHostname() + "/api/v2/enterprises").success(function (data, status, headers, config) {
        angular.forEach(data.data, function (item) {
            $scope.hospital = item;
        });
    });

});