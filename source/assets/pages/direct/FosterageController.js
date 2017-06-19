
// 寄养管理
angular.module('fiona').controller('FosterageController', function($scope, $controller, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {managerIdSet: "主管人员", manufacturerIdSet: "业务员"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 寄养管理
     * ---------------------------
     * */
    $scope.fosterageportal = {

        id: "fosterage",

        name: "寄养管理",

        server: "/api/v2/fosterrecords",

        defilters: {fosterNo:"寄养号", gestCode:"会员编号", gestName:"会员姓名", petName:"宠物昵称"},

        callback: {
            update: function () {
                $scope.petportal.unique($scope.fosterage.petId);

                $scope.fosteragedetailportal.searchAll();

                $scope.vipprepayportal.searchAll();
            },
            unique: function () {
                $scope.fosterageportal.filter();
            },
            insert: function() {
                $scope.fosterage.totalMoney = 0;

                $scope.serialNumber({id: "fosterage", fieldName : "fosterNo", numberName : "寄养编号"});

                $scope.setSelectDefault("fosterage", ["itemCode", "managerId", "manufacturerId"]);
            },
            submitbefore: function(){

                if($scope.fosterage.itemCode)
                {
                    $scope.fosterage.itemName = $scope.dropdowns.itemCodeSet.findObjectWithProperty("itemCode", $scope.fosterage.itemCode).itemName;
                }

                if($scope.fosterage.managerId)
                {
                    $scope.fosterage.managerBy = $scope.dropdowns.managerIdSet.getObjectWithId({id: $scope.fosterage.managerId}).personName;
                }

                if($scope.fosterage.manufacturerId)
                {
                    $scope.fosterage.manufacturerName = $scope.dropdowns.manufacturerIdSet.getObjectWithId({id: $scope.fosterage.manufacturerId}).personName;
                }

            },
            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.fosteragedetails, function (_fosteragedetail) {
                    // 寄养ID
                    _fosteragedetail.fosterId = $scope.fosterage.id;

                    // 寄养编号
                    _fosteragedetail.fosterNo = $scope.fosterage.fosterNo;

                    $scope.fosteragedetailportal.saveWithEntity(_fosteragedetail);
                });
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.fosterageportal}); //继承

    /**
     * 寄养期间消费
     * ---------------------------
     * */
    $scope.fosteragedetailportal = {

        foreign: "fosterage",

        foreignkey: "fosterId", // 外键

        id: "fosteragedetail",

        name: "寄养期间消费",

        server: "/api/v2/fosterrecorddetails",

        defilters: { },

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.fosteragedetailportal}); //继承

    /**
     * 自动补全选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.fosteragedetails) {
            $scope.fosteragedetails = [];
        }

        if($scope.fosteragedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var fosteragedetail = $scope.fosteragedetails.unique('itemCode', _product.itemCode);

//            commons.modaldanger("fosterage", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var fosteragedetail= {};

            angular.forEach(["itemCode", "itemName", "recipeUnit", "sellPrice",  "useWay", "itemStandard"], function (name) {
                fosteragedetail[name] = _product[name];
            });

            fosteragedetail.manufacturerCode = _product.dealerCode;
            fosteragedetail.manufacturerName = _product.dealerName;

            // 个数
            fosteragedetail.itemNum = 1;

            fosteragedetail.totalCost = fosteragedetail.itemNum * fosteragedetail.sellPrice;

            $scope.fosteragedetails.push(fosteragedetail);

//            commons.modalsuccess("fosterage", "成功添加[ " +fosteragedetail.itemName+ " ]商品");
        }

        $scope.productportal.resize();
    };

    // 计算 数量和金额
    $scope.productportal.resize = function () {

        $scope.fosterage.totalMoney = 0;

        angular.forEach($scope.fosteragedetails, function (_fosteragedetail) {
            // 小计
            _fosteragedetail.totalCost = _fosteragedetail.sellPrice * _fosteragedetail.itemNum;

            // 总金额
            $scope.fosterage.totalMoney += _fosteragedetail.totalCost;
        });
    }

    $scope.productportal.autocompletedata();

    /**
     * 预付金额
     * ---------------------------
     * */
    $scope.vipprepayportal = {

        foreign: "fosterage",

        foreignkey: "relationId", // 外键

        id: "vipprepay",

        name: "预付金额",

        server: "/api/v2/prepaymoneys",

        defilters: { },

        callback: {
            submit: function () {
                $scope.fosterageportal.unique($scope.fosterage.id);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipprepayportal}); //继承

    /**
     * 健康状态记录
     * ---------------------------
     * */
    $scope.fosteragehealthportal = {

        id: "fosteragehealth",

        name: "健康状态记录",

        server: "/api/v2/fosterhealths",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.fosteragehealthportal}); //继承

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.checked = function (_pet) {

        $scope.pet = _pet;

        // 会员ID
        $scope.fosterage.gestId = _pet.gestId;

        // 会员编号
        $scope.fosterage.gestCode = _pet.gestCode;

        // 会员姓名
        $scope.fosterage.gestName = _pet.gestName;

        // 会员手机
        $scope.fosterage.mobilePhone = "";

        // 宠物ID
        $scope.fosterage.petId = _pet.id;

        // 宠物名称
        $scope.fosterage.petName = _pet.petName;


        $("#petselect").modal('hide');
    };

    // 实始化
    $scope.fosterageportal.filter();
});
