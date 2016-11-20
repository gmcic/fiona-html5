
// 寄养管理
angular.module('fiona').controller('FosterageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {};

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "managerId", server: "/api/v2/personss"}); // 主管人员
    $scope.dropdownWithTable({id: "manufacturerId", server: "/api/v2/personss"}); // 业务员

    // 挂号服务类型
    $scope.dropdownWithTable({id: "itemCode", server: "/api/v2/itemtypes", condition : {"cateNo": "d7079dde-f3b0-4db6-b693-a78ddb33d02d"}});

    /**
     * 寄养管理
     * ---------------------------
     * */
    $scope.fosterageportal = {

        id: "fosterage",

        name: "寄养管理",

        server: "/api/v2/fosterrecorddetails",

        defilters: { },

        callback: {
            insert: function() {
                $scope.serialNumber({id: "fosterage", fieldName : "fosterNo", numberName : "寄养编号"});

                $scope.setSelectDefault("fosterage", ["itemCode", "managerId", "manufacturerId"]);
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

        foreignkey: "serviceId", // 外键

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
            commons.modaldanger("doctorprescript", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var fosteragedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "recipeUnit", "sellPrice",  "useWay", "itemStandard"], function (name) {
                fosteragedetail[name] = _product[name];
            });

            fosteragedetail.manufacturerCode = _product.dealerCode;
            fosteragedetail.manufacturerName = _product.dealerName;

            // 个数
            fosteragedetail.itemNum = 1;

            fosteragedetail.totalCost = fosteragedetail.itemNum * fosteragedetail.sellPrice;


            $scope.fosteragedetails.push(fosteragedetail);

            commons.modalsuccess("doctorprescript", "成功添加[ " +fosteragedetail.itemName+ " ]商品");
        }
    };

    $scope.productportal.list();

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


        $("#petselect").modal('toggle');
    };

});
