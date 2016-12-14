// 销售查询
angular.module('fiona').controller('SaleplatedetailController', function($scope, $controller, commons) {

    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {sellUnitSet: "物品单位"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 直接销售
     * ---------------------------
     * */
    $scope.saleplateportal = {

        id: "saleplate",

        name: "直接销售",

        server: "/api/v2/storedirectsells",

        defilters: { "gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {
            save: function() {
                angular.forEach($scope.saleplatedetails, function(_saleplatedetail){
                      // 直销id
                      _saleplatedetail.directSellId = $scope.saleplate.id;

                      // 直销编号
                      _saleplatedetail.directSellCode = $scope.saleplate.directSellCode;

                      // 业务类型ID
                      // _saleplatedetail.busiTypeId = $scope.saleplate.id;

                      $scope.saleplatedetail = _saleplatedetail;

                      $scope.saleplatedetailportal.save();
                });

                // 清除
                commons.success("结算成功, 销售单号[ " + $scope.saleplate.directSellCode + " ]");
                $scope.saleplateportal.cleanup();
            }
        }
    };

    $scope.saleplateportal.initial  = function() {

        $scope.saleplate = {'totalNum' : 0, 'totalCost': 0};

        $scope.serialNumber({id: "saleplate", fieldName : "directSellCode", numberName : "销售单号"});
    }

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplateportal }); //继承

    // 结算
    $scope.saleplateportal.balance = function() {

        if($scope.petportal.purchaserType == 1 && !$scope.saleplate.gestId)
        {
            commons.danger("未选择会员, 不能结算!");
        }
        else if(!$scope.saleplatedetails || $scope.saleplatedetails.length <= 0)
        {
            commons.danger("没有添加销售的商品, 不能结算!");
        }
        else
        {
            $scope.saleplateportal.save();

        }
    };

    $scope.saleplateportal.cleanup = function() {
        $scope.saleplateportal.initial();
        $scope.pet = {};
        $scope.saleplatedetail = {};
        $scope.saleplatedetails = [];
    };

    /**
     * 直接销售明细
     * ---------------------------
     * */
    $scope.saleplatedetailportal = {

        id: "saleplatedetail",

        name: "直接销售明细",

        server: "/api/v2/storedirectselldetails",

        defilters: { "gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplatedetailportal}); //继承

    $scope.saleplatedetailportal.callback.delete = function()
    {
        $scope.saleplate = {'totalNum' : 0, 'totalCost': 0};

        angular.forEach($scope.saleplatedetails, function(_saleplatedetail){
            $scope.saleplate.totalNum += _saleplatedetail.itemNum;
            $scope.saleplate.totalCost += _saleplatedetail.totalCost;
        });
    }

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.resize = function () {

        $scope.saleplate = {'totalNum' : 0, 'totalCost': 0};

        angular.forEach($scope.saleplatedetails, function(_saleplatedetail){

            _saleplatedetail.totalCost = _saleplatedetail.itemNum * _saleplatedetail.sellPrice;

            $scope.saleplate.totalNum += _saleplatedetail.itemNum;
            $scope.saleplate.totalCost += _saleplatedetail.totalCost;
        });
    }

    $scope.productportal.checked = function (_product) {

        if (!$scope.saleplatedetails) {
            $scope.saleplatedetails = [];
        }

        if($scope.saleplatedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.danger("[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var saleplatedetail= {};

            angular.forEach(["itemCode", "itemName", "barCode", "sellPrice", "itemStandard"], function (name) {
                saleplatedetail[name] = _product[name];
            });

            // 单位
            saleplatedetail.sellUnit = _product.recipeUnit;

            // 生产商
            saleplatedetail.manufacturerCode = _product.dealerCode;

            saleplatedetail.manufacturerName = _product.dealerName;

//            if(_product.itemStandard)
//            {
//                saleplatedetail.itemName = saleplatedetail.itemName + "(" +  _product.itemStandard + ")";
//            }

            // 个数
            saleplatedetail.itemNum = 1;

            // 小计
            saleplatedetail.totalCost = saleplatedetail.itemNum * saleplatedetail.sellPrice;

            // {'totalNum' : 0, 'totalCost': 0};
            $scope.saleplate.totalNum += saleplatedetail.itemNum;
            $scope.saleplate.totalCost += saleplatedetail.totalCost;

            $scope.saleplatedetails.push(saleplatedetail);

            commons.success("成功添加[ " +saleplatedetail.itemName+ " ]商品");
        }
    };

    $scope.productportal.autocompletedata();

    /**
     * 选择会员
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.setProperty = function (_pet) {

      $scope.pet = _pet;

      // 会员ID
      $scope.saleplate.gestId = _pet.gestId;

      // 会员编号
      $scope.saleplate.gestCode = _pet.gestCode;

      // 会员姓名
      $scope.saleplate.gestName = _pet.gestName;

      // 会员手机
      $scope.saleplate.mobilePhone = "";

      // 宠物ID
      $scope.saleplate.petId = _pet.id;

      // 宠物名称
      $scope.saleplate.petName = _pet.petName;

    };

    $scope.petportal.checked = function (_pet) {

        $scope.petportal.setProperty(_pet);

      $("#petselect").modal({backdrop: 'static', keyboard: false});
    };

    $scope.petportal.purchaserType = 1;

    $scope.petportal.purchaser = function() {

//        alert("purchaserType: " + $scope.petportal.purchaserType);

        if($scope.petportal.purchaserType == 1)
        {
            $scope.petportal.setProperty({});
        }
        else if($scope.petportal.purchaserType == 2)
        {
            $scope.petportal.setProperty({ gestId: 0, gestCode: '', gestName: '', mobilePhone: '', petId: '', petName: '' });
        }
    };

    $scope.saleplateportal.initial();

});
