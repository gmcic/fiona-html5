// 美容服务
angular.module('fiona').controller('BeautyController', function($scope, $controller) {

    $scope.dropdowns = { };

    commons.findDict($scope.dropdowns, {assistantIdSet: "服务助理", hairdresserIdSet: "服务师"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 美容服务
     * ---------------------------
     * */
    $scope.beautyportal = {

        id: "beauty",

        name: "美容服务",

        server: "/api/v2/services",

        defilters: { },

        callback: {
            update: function(){
                $scope.petportal.unique($scope.beauty.petId);

                $scope.beautydetailportal.search();
            },

            insert: function() {
                 $scope.beauty.totalNum = 0;
                 $scope.beauty.totalCost = 0;

                 $scope.serialNumber({id: "beauty", fieldName : "serviceCode", numberName : "服务编号"});

                 $scope.setSelectDefault("beauty", ["itemCode", "hairdresserId", "assistantId"]);
            },
             submit : function () {
                 // 遍历保存所有子项
                 angular.forEach($scope.beautydetails, function (_beautydetail) {
                     $scope.beautydetail = _beautydetail;

                     // 寄养ID
                     $scope.beautydetail.serviceId = $scope.beauty.id;

                     $scope.beautydetailportal.save();
                 });
             }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.beautyportal}); //继承

    /**
     * 服务项目
     * ---------------------------
     * */
    $scope.beautydetailportal = {

        foreign: "beauty",

        foreignkey: "serviceId", // 外键

        id: "beautydetail",

        name: "服务项目",

        server: "/api/v2/servicedetails",

        defilters: { },

        callback: {
            update: function(){

            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.beautydetailportal}); //继承

    /**
     * 自动补全选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.beautydetails) {
            $scope.beautydetails = [];
        }

        if($scope.beautydetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var beautydetail = $scope.beautydetails.unique('itemCode', _product.itemCode);

//            commons.modaldanger("beauty", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var beautydetail= {};

            angular.forEach(["itemCode", "itemName", "packageUnit", "sellPrice",  "itemStandard", "barCode"], function (name) {
                beautydetail[name] = _product[name];
            });

            // 个数
            beautydetail.inputCount = 1;

            beautydetail.totalCost = beautydetail.inputCount * beautydetail.sellPrice;

            $scope.beautydetails.push(beautydetail);

//            commons.modalsuccess("beauty", "成功添加[ " +beautydetail.itemName+ " ]商品");
        }
    };

    $scope.productportal.resize = function () {

        $scope.beauty.totalNum = 0;
        $scope.beauty.totalCost = 0;

        angular.forEach($scope.beautydetails, function (_beautydetail) {

            $scope.beauty.totalNum += _beautydetail.inputCount;

            // 小计
            _beautydetail.totalCost = _beautydetail.sellPrice * _beautydetail.inputCount;

            // 总金额
            $scope.beauty.totalCost += _beautydetail.totalCost;
        });
    }

    $scope.productportal.autocompletedata();


    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.checked = function (_pet) {

        $scope.pet = _pet;

        // 会员ID
        $scope.beauty.gestId = _pet.gestId;

        // 会员编号
        $scope.beauty.gestCode = _pet.gestCode;

        // 会员姓名
        $scope.beauty.gestName = _pet.gestName;

        // 会员手机
        $scope.beauty.mobilePhone = "";

        // 宠物ID
        $scope.beauty.petId = _pet.id;

        // 宠物名称
        $scope.beauty.petName = _pet.petName;

        $("#petselect").modal({backdrop: 'static', keyboard: false});
    };

    // 实始化
    $scope.beautyportal.filter();
});
