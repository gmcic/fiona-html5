
// 宠物管理
angular.module('fiona')
.controller('CuremanagerController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {statusSet: "会员状态",petBreedSet: "绝育状态", sickFileCodeSet: "宠物状态", doctorStatusSet : "就诊状态", paidStatusSet: "付款状态"},
        userdicts: {gestSexSet: "性别",petSexSet: "动物性别", petSkinColorSet: "动物颜色", frequencySet: "用药频次", useWaySet: "药品使用方法", useUnitSet: "物品单位"},
        callback : {
            userdicts : function () {
                // 处方单位
                $scope.dropdowns.recipeUnitSet = $scope.dropdowns.useUnitSet;
            },

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
        $http.post(commons.getBusinessHostname() + $scope.curemanagerportal.server + commons.getTimestampStr(), {registerNo: $scope.register.registerNo}).success(function (data, status, headers, config) {
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
        //页面切换
        valid: function(){
            var info= "";
            var show = false;
            console.log('valid',$scope.curemanager);

  //           主述: rheme
  // 临床检查: examination
  // 医生诊断: diagnosed
  // 医嘱: doctorAdvice
            if (!$scope.curemanager.weight){
                info += "请补体重！" 
                show = true;
            }
            if (!$scope.curemanager.doctorAdvice){
                info += "请补全医嘱！" 
                show = true;
            }
            if (!$scope.curemanager.rheme){
                info += "请补全主述！" 
                show = true;
            }
            if (!$scope.curemanager.examination){
                info += "请补全临床检查！" 
                show = true;
            }
            if (!$scope.curemanager.diagnosed){
                info += "请补全医生诊断查！" 
                show = true;
            }
            if(show){
                alert(info);
            }

        },
        underway: function(){
            $scope.curemanager= {};
           $scope.play($scope.register);
           $scope.historyview = "pet";
        },

        switched: function(_curemanager){

            $scope.curemanager = _curemanager;
            $scope.doctorprescripts = [];
            $scope.doctorprescriptdetails = [];

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
     * 库存变更
     * ---------------------------
     * */
    $scope.itemcountsportal = {

        id: "itemcounts",

        name: "库存变更",

        server: "/api/v2/itemcounts",

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itemcountsportal}); //继承

    /**
     * 搜索
     * ---------------------------
     * */
    $scope.itemcountsportal.searchByWhere = function(condition, source){

        var filters = [];

        angular.forEach(condition, function(data, key){
            filters.push({"fieldName": key, "operator": "EQ", "value": data});
        });

        $http.post(commons.getBusinessHostname() + this.server + "/page" + commons.getTimestampStr(), { 'pageSize': 10000, 'pageNumber': 1,"filters":[], 'andFilters': filters})
            .success(function (data, status, headers, config) {
                var items = data.data.content;

                if (items && items.length > 0)
                {
                    var data = items[0];

                    if ((data.itemBulk > 1 ? (data.itemCountNum * data.itemBulk + data.scatteredCountNum): data.itemCountNum) - source.itemCount <= 0){
                        commons.modaldanger("doctorprescript", "抱歉 ，[ 商品" +source.itemName + "(" + source.itemCode +")"+ " ]库存数量不足,请确认后再开方!");
                    }
                }

            });
    };

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

                $scope.doctorprescript.sickFileCode = $scope.pet.sickFileCode;

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

                    data.prescriptionId = $scope.doctorprescript.id;

                    $scope.doctorprescriptdetailportal.saveWithEntity(data);
                });

                $scope.doctorprescriptdetail = {};
            },



            delete: function () {
                $scope.doctorprescriptdetails = [];
            },

            switched: function () {
                $scope.doctorprescriptdetailportal.search();
            },

            update: function () {
                $scope.doctorprescriptdetails = [];
                $scope.doctorprescriptdetailportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.doctorprescriptportal}); //继承

//    $scope.doctorprescriptportal.update = function (id){
//
//
//        $scope[this.id + 'form'].submitted = false;
//
//        $scope[this.id] = $scope[this.id + 's'].getObjectWithIdValue(id);
//
//        if (!!this.callback && !!this.callback.update) {
//            this.callback.update();
//        }
//
//        $('#' + this.id).modal({backdrop: 'static', keyboard: false});
//
//       $scope.doctorprescriptdetailportal.search();
//    }

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

    $scope.doctorprescriptdetailportal.pagination.pageSize = 100000;

    $scope.doctorprescriptportal.print = function () {

        $scope.nowtime = new Date();

        var $first = 28; // 首页行数

        var $middle = 34; // 中间页行数

        var $last = 34; // 最后页行数

        $scope.doctorprescriptdetail2ds = [];

        var size = $scope.doctorprescriptdetails.length;

        // 首页
        $scope.doctorprescriptdetail2ds.push($scope.doctorprescriptdetails.slice(0, size > $first ? $first : size));

        if(size > $first)
        {
            var $index = $first;

            var size = size - $first;

            // 中间页
            while(size > $middle)
            {
               $scope.doctorprescriptdetail2ds.push($scope.doctorprescriptdetails.slice($index, $index + $middle));

               $index = $index + $middle;

               size = size - $middle;
            }

            // 尾页
            if(size > 0)
            {
                $scope.doctorprescriptdetail2ds.push($scope.doctorprescriptdetails.slice($index));

                $scope.lastpagebreak = size > $last;
            }
            else
            {
                $scope.lastpagebreak = true;
            }
        }

        // $scope.pet.age = $scope.getAgeByBirthday($scope.pet.petBirthday);

        $('#doctorprescriptprint').modal({backdrop: 'static', keyboard: false});
    };

    /**
     * 查询
     * ---------------------------
     * */
    $scope.doctorprescriptportal.search = function () {

        $http.post(commons.getBusinessHostname() + $scope.doctorprescriptportal.server + "/page" + commons.getTimestampStr(), {'pageSize': 10000,'pageNumber': '1','filters': [{"fieldName": "medicRecordCode", "operator": "EQ", "value": $scope.curemanager.mediTreatmentCode}]}).success(function (data, status, headers, config) {
            $scope.doctorprescripts = data.data.content;

            if($scope.doctorprescripts.length > 0) {
                $scope.doctorprescriptportal.switched($scope.doctorprescripts[0].id);

                if (!!$scope.doctorprescriptportal.callback && !!$scope.doctorprescriptportal.callback.search) {
                    $scope.doctorprescriptportal.callback.search();
                }
            }
        });
    };

    /**
     * 复制处方单
     * ---------------------------
     * */
    $scope.doctorprescriptportal.clonedoctorprescript = function () {
        // 查询就诊信息
        $http.post(commons.getBusinessHostname() + $scope.curemanagerportal.server, {registerNo: $scope.register.registerNo}).success(function (data, status, headers, config) {
            var _curemanager = data.data;
            $http.get(commons.getBusinessHostname() + $scope.doctorprescriptportal.server + "/copy/" +$scope.doctorprescript.prescriptionCode+ "?medicRecordCode=" + _curemanager.mediTreatmentCode).success(function (data, status, headers, config) {
                $scope.curemanagerportal.switched($scope.curemanager);
            });
        });

    };

    $scope.doctorprescriptportal.insert = function () {

        $scope.doctorprescriptportal.selectedId = null;

        $scope.doctorprescript = {};
        $scope.doctorprescriptdetails = [];

        $scope.serialNumber({id: "doctorprescript", fieldName : "prescriptionCode", numberName : "处方流水"});

        $("#doctorprescript").modal({backdrop: 'static', keyboard: false});
    };

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
     * 自动补全选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_selectObject) {

        var _products;

        if(_selectObject.dataType == 'template')
        {
            _products = commons.findTemplateDetails(_selectObject.templateNo);
        }
        else
        {
            _products = [_selectObject];
        }

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }

        angular.forEach(_products, function (_product) {

            var doctorprescriptdetail= {};

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                doctorprescriptdetail[name] = _product[name];
            });

            if (_product.recipeUnit){
                var recipeUnit = $scope.dropdowns.recipeUnitSet.findObjectWithProperty('dictDetailCode',_product.recipeUnit);
                if (!recipeUnit){
                    recipeUnit = $scope.dropdowns.recipeUnitSet.findObjectWithProperty('id',_product.recipeUnit);
                }

                if (recipeUnit){
                    doctorprescriptdetail.recipeUnit = recipeUnit.valueNameCn;
                }
            }

            if(_product.itemStandard)
            {
                doctorprescriptdetail.itemName = doctorprescriptdetail.itemName + "(" +  _product.itemStandard + ")";
            }

            doctorprescriptdetail.itemCost = _product.recipePrice;

            doctorprescriptdetail.itemNum = _product.$itemNum || 1;

            delete _product.$itemNum;

            // 分组序号自增
//            doctorprescriptdetail.groupName = $scope.doctorprescriptdetails.length + 1;
            doctorprescriptdetail.groupName = (($scope.doctorprescriptdetails[$scope.doctorprescriptdetails.length -1]) || {groupName: 1} ).groupName;

            doctorprescriptdetail.createDate = Date.parse(new Date());

//            $scope.productchecked[doctorprescriptdetail.itemCode] = doctorprescriptdetail;

            $scope.doctorprescriptdetails.push(doctorprescriptdetail);

            $scope.itemcountsportal.searchByWhere({"itemCode": _product.itemCode}, doctorprescriptdetail);
        });

        // if(_selectObject.dataType == 'template')
        // {
        //     _products = commons.findTemplateDetails(_selectObject.templateNo);
        // }
        // else
        // {
        //     _products = [_selectObject];
        // }

        // commons.modalsuccess("doctorprescript", "成功添加[ " +doctorprescriptdetail.itemName+ " ]商品");

//        if($scope.productchecked[_product.itemCode]) {   // 是否已选择
//         if($scope.doctorprescriptdetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
//
//             commons.modaldanger("doctorprescript", "[ 商品" +_product.itemName+ " ]已存在");
//         }
//         else {
            // 未选择新添加

        // }

    };

    $scope.productportal.submit = function () {

        angular.forEach($scope[$scope.productportal.id + "s"], function (_product) {
            if($scope.productportal.selection[_product.id])
            {
                $scope.productportal.checked(_product);
            }
        });

        $('#' + $scope.productportal.id + "select").modal({backdrop: 'static', keyboard: false});
    };

    // 初始化查找商品
    $scope.productportal.autocompletetemplatedata();

    // 打印页面
    $scope.print = function () {

         $('#doctorprescriptprintbody').find(':text').each(function(i, node){
            var _text = $(node);
            _text.parent().html(_text.val());
         });

        var html = '';

         $('#doctorprescriptprintbody').find('.print-body-html').each(function(i, node){
            html += "<p></p>";
            html += node.outerHTML;
            html += "<p style='page-break-after:always;both: clean'>&nbsp;</p>";
         });

        document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = html;
        document.getElementById('printiframe').contentWindow.print();

        $('#doctorprescriptprint').modal('hide');
    }

    /**
     * 加载待诊信息
     * ---------------------------
     * */

    // 查询等诊列表
//    $scope.registerportal.searchByWhere({"status": "SM00034"});
//    $scope.registerportal.list();

    $scope.themap = {};

    $http.get(commons.getBusinessHostname() + $scope.registerportal.server + commons.getTimestampStr()).success(function (data, status, headers, config) {

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
    $http.get(commons.getBusinessHostname() + "/api/v2/enterprises" + commons.getTimestampStr()).success(function (data, status, headers, config) {
        angular.forEach(data.data, function (item) {
            $scope.hospital = item;
        });
    });

});