// 美容服务
angular.module('fiona').controller('BeautyController', function($scope, $controller, commons) {

    $scope.dropdowns = { };

    commons.findDict($scope.dropdowns, {assistantIdSet: "服务助理", hairdresserIdSet: "服务师", packageUnitSet: "物品单位"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 美容服务
     * ---------------------------
     * */
    $scope.beautyportal = {

        id: "beauty",

        name: "美容服务",

        server: "/api/v2/services",

        defilters: {serviceCode: "服务单号", gestCode: "会员编号", gestName: "会员姓名", petName: "宠物昵称", assistantName: "服务助理", hairdresserName: "服务师" },

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
            submitbefore: function(){

                if($scope.beauty.assistantId)
                {
                    $scope.beauty.assistantName = $scope.dropdowns.assistantIdSet.getObjectWithId({id: $scope.beauty.assistantId}).personName;
                }

                if($scope.beauty.hairdresserId)
                {
                    $scope.beauty.hairdresserName = $scope.dropdowns.hairdresserIdSet.getObjectWithId({id: $scope.beauty.hairdresserId}).personName;
                }
            },
             submit : function () {
                 // 遍历保存所有子项
                 angular.forEach($scope.beautydetails, function (_beautydetail) {
                     // 寄养ID
                     _beautydetail.serviceId = $scope.beauty.id;

                     $scope.beautydetailportal.saveWithEntity(_beautydetail);
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
            delete: function(){

              // 重新计算
              $scope.rearith();
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

        // 重新计算
        $scope.rearith();
    };

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

        $("#petselect").modal('hide');
    };

    // 实始化
    $scope.beautyportal.filter();

    // 计算器
    $scope.rearith = function () {

      $scope.beauty.totalNum = 0;
      $scope.beauty.totalCost = 0;

      angular.forEach($scope.beautydetails, function (_beauty) {
        // 小计
        _beauty.totalCost = _beauty.sellPrice * _beauty.inputCount;

        // 总数量
        $scope.beauty.totalNum += _beauty.inputCount;

        // 总金额
        $scope.beauty.totalCost += _beauty.totalCost;
      });
    }
});
