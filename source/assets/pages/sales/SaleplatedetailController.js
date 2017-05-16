// 销售查询
angular.module('fiona').controller('SaleplatedetailController', function($scope, $http, $controller, commons) {

    $scope.dropdowns = {paymentTypeSet: [{id: "现金", valueNameCn: "现金"}, {id: "会员", valueNameCn: "会员"}, {id: "支付宝", valueNameCn: "支付宝"}, {id: "微信", valueNameCn: "微信"}, {id: "银行卡", valueNameCn: "银行卡"}] };

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

                      $scope.saleplatedetailportal.saveWithEntity(_saleplatedetail);
                });

                $scope.paymentpractical = {"operateAction": "现金", "totalSize":$scope.saleplate.totalNum, totalPrice: $scope.saleplate.totalCost, price: $scope.saleplate.totalCost};

                $('#payment').modal({backdrop: 'static', keyboard: false});

                // 清除
//                commons.success("结算成功, 销售单号[ " + $scope.saleplate.directSellCode + " ]");
//                $scope.saleplateportal.cleanup();
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
        else if(!$scope.saleplate.directSellCode || $scope.saleplate.directSellCode.length <= 0)
        {
            commons.danger("结算单号不能为空, 请重新提交!");
            $scope.serialNumber({id: "saleplate", fieldName : "directSellCode", numberName : "销售单号"});
        }
        else
        {
            $scope.saleplateportal.save();
        }
    };

    /**
     * 结算
     * ---------------------------
     * */
    $scope.balance = function()
    {
        var payobject = {gestPaidRecord: {operateAction: $scope.paymentpractical.operateAction, operateContent: $scope.paymentpractical.operateContent}, settleAccountsViews: []};

        angular.forEach($scope.saleplatedetails, function (_saleplatedetail) {

            var _data = {
                "id": "string",
                "gestId": $scope.saleplate.gestId,
                "itemCode": _saleplatedetail.itemCode,
                "itemName": _saleplatedetail.itemName,
                "itemNum": _saleplatedetail.itemNum,
                "itemCost": _saleplatedetail.sellPrice,
//                "busiTypeId": "string",
//                "businessType": "string",
//                "relationId": _saleplatedetail.sellUnit,
                "isVipDiscount": $scope.paymentpractical.isVipDiscount,
                "itemUnit": _saleplatedetail.sellUnit
//                "relationDetailId": "string"
                };

            payobject.settleAccountsViews.push(_data);
        });

        $http.post(commons.getBusinessHostname() + "/api/v2/gestpaidrecords/pay" + commons.getTimestampStr(), payobject).success(function (data, status, headers, config) {

            $scope.statement = data.data;

            $('#payment').modal('hide');

            $scope.saleplateportal.cleanup();

            $scope.saleplateportal.print();

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger("payment", "保存失败")
        });
    }

    /** 计算支付金额 */
    $scope.pay = function()
    {
        console.log("折扣: " + $scope.paymentpractical.isVipDiscount);

        if($scope.paymentpractical.operateAction == "会员")
        {
            if(!$scope.vip.prepayMoney || $scope.vip.prepayMoney <= $scope.paymentpractical.price)
            {
                $scope.allowmessage = "会员余额不足";
                $scope.allowpay = false;
            }
            else {
              if ($scope.paymentpractical.isVipDiscount){
                $scope.paymentpractical.operateContent = $scope.paymentpractical.price*$scope.paymentpractical.isVipDiscount;
              }else{
                $scope.paymentpractical.operateContent = $scope.paymentpractical.price;
              }

                $scope.allowmessage = "";
                $scope.allowpay = true;
            }
        }
        else {
          _price = $scope.paymentpractical.price;
          if($scope.paymentpractical.operateContent && $scope.paymentpractical.operateContent < $scope.paymentpractical.price){
              $scope.paymentpractical.isVipDiscount = $scope.paymentpractical.operateContent/_price;
              $scope.paymentpractical.backprice = 0;
              $scope.allowpay = true;
              $scope.allowmessage = "折扣自动计算请留意";
          }else if($scope.paymentpractical.operateContent  >= $scope.paymentpractical.price)
          {
              $scope.paymentpractical.backprice = $scope.paymentpractical.operateContent  - $scope.paymentpractical.price;
              $scope.paymentpractical.isVipDiscount = 1;
              $scope.allowmessage = "";
              $scope.allowpay = true;
          }else
          {
              $scope.allowpay = false;
          }
        }

    };

    $scope.saleplateportal.print = function () {

        $scope.nowtime = new Date();

        $('#saleplateprint').modal({backdrop: 'static', keyboard: false});
    };

    // 打印页面
    $scope.print = function () {
        document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = $('#saleplateprintbody').html();
        document.getElementById('printiframe').contentWindow.print();
        // $('#doctorprescriptprint').modal({backdrop: 'static', keyboard: false});
    }

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
     * 选择商品
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

            angular.forEach(["itemCode", "itemName", "barCode", "itemStandard"], function (name) {
                saleplatedetail[name] = _product[name];
            });

            // 处方价格
            saleplatedetail.sellPrice = _product.recipePrice;

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
    $scope.vipportal= {

        id: "vip",

        name: "选择会员",

        server: "/api/v2/gests"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipportal}); //继承

    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.setProperty = function (_pet) {

      $scope.pet = _pet;

      // 会员ID
      $scope.saleplate.gestId = _pet.gestId;

      if(_pet.gestId)
      {
        $scope.vipportal.unique(_pet.gestId);
      }
      else
      {
        $scope.vip = {gestName: '散客', gestCode: _pet.gestCode, gestSex: {dictDetailCode: 'DM00001'}, gestStyle: {levelName: '无'}, prepayMoney: 0};
      }

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

      $("#petselect").modal('hide');
    };

    $scope.petportal.purchaserType = 1;

    $scope.petportal.purchaser = function() {

//        alert("purchaserType: " + $scope.petportal.purchaserType);

        if($scope.petportal.purchaserType == 1) // 会员
        {
            $scope.petportal.setProperty({});
        }
        else if($scope.petportal.purchaserType == 2) //  散客
        {
            $scope.petportal.setProperty({ gestId: 0, gestCode: '', gestName: '散客', mobilePhone: '', petId: '', petName: '' });
        }
    };

    $scope.saleplateportal.initial();

});
