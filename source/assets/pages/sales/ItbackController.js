
// 销售退货
angular.module('fiona').controller('ItbackController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {assistantIdSet: "服务助理", hairdresserIdSet: "服务师", packageUnit: "物品单位"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 直接销售
     * ---------------------------
     * */
    $scope.itbackportal = {

        id: "itback",

        name: "销售退货",

        server: "/api/v2/returncommoditys",

        defilters: { "gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {
            update: function () {
              $scope.itbackdetailportal.searchAll();
            },
            insert: function () {
              $scope.itback.countNum = 0;
              $scope.itback.totalCost = 0;

              $scope.vip = {};

              $scope.petportal.purchaserType = 1;

              $scope.serialNumber({id: "itback", fieldName : "rcCode", numberName : "销售退货单号"});
            },

            submit: function() {
                angular.forEach($scope.itbackdetails, function(_itbackdetail){
                     // 退货单ID
                      _itbackdetail.rcId = $scope.itback.id;

                      $scope.itbackdetailportal.saveWithEntity(_itbackdetail);
                });

                // 清除
                commons.success("结算成功, 销售单号[ " + $scope.itback.directSellCode + " ]");
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itbackportal }); //继承

    /**
     * 退货商品明细
     * ---------------------------
     * */
    $scope.itbackdetailportal = {

        foreignkey : 'rcId', // 表关联使用的字段

        foreign: "itback",

        id: "itbackdetail",

        name: "销售退货",

        server: "/api/v2/returncommoditydetails",

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itbackdetailportal }); //继承

    /**
     * 弹出选择商品
     * ---------------------------
     * */

    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    // 重新计算
    $scope.productportal.resize = function () {

        $scope.itback.countNum = 0;
        $scope.itback.totalCost= 0;

        angular.forEach($scope.itbackdetails, function(_itbackdetail){

          _itbackdetail.returnTotalCost = _itbackdetail.sellCountNum * _itbackdetail.sellPrice;

            $scope.itback.countNum  += _itbackdetail.sellCountNum;
            $scope.itback.totalCost += _itbackdetail.returnTotalCost;
        });
    }

    // 商品选择
    $scope.productportal.checked = function (_product) {

        if (!$scope.itbackdetails) {
            $scope.itbackdetails = [];
        }

        if($scope.itbackdetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.danger("[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加
            var itbackdetail= {};

            angular.forEach(["itemCode", "itemName", "barCode", "sellPrice", "itemStandard"], function (name) {
                itbackdetail[name] = _product[name];
            });

            // 单位
            itbackdetail.packageUnit = _product.recipeUnit;

            // 生产商
            itbackdetail.manufacturerCode = _product.dealerCode;

            itbackdetail.manufacturerName = _product.dealerName;

            // 个数
            itbackdetail.sellCountNum = 1;

            // 小计
            itbackdetail.returnTotalCost = itbackdetail.sellCountNum * itbackdetail.sellPrice;

            $scope.itbackdetails.push(itbackdetail);

            commons.success("成功添加[ " +itbackdetail.itemName+ " ]商品");
        }

        $scope.productportal.resize();
    };

    /**
    * 销售查询
    * ---------------------------
    * */
    $scope.saleplateportal = {

        foreign: "saleplatedetail", // 外键

        foreignkey: "directSellCode",

        id: "saleplate",

        name: "销售查询",

        server: "/api/v2/storedirectsells",

        defilters: { directSellCode: "销售单号", gestCode: "会员编号", gestName: "会员姓名", petName: "宠物名称"},

            pupupselect: function () {
                $scope.saleplateportal.list();

                $("#saleplateselect").modal('show');
            },
            checked: function (_saleplate) {

                $scope.itback.cashId = _saleplate.id;
                $scope.itback.cashCode= _saleplate.directSellCode;

                $("#saleplateselect").modal('hide');
            },
            callback: {
              view: function(){
                $scope.saleplatedetailportal.searchAll();
              }
            }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplateportal}); //继承

    /**
    * 直接销售明细
    * ---------------------------
    * */
    $scope.saleplatedetailportal = {

        foreign: "saleplate", // 外键

        foreignkey: "directSellCode",

        id: "saleplatedetail",

        name: "直接销售明细",

        server: "/api/v2/storedirectselldetails",

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplatedetailportal}); //继承


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
        $scope.itback.gestId = _pet.gestId;

        if(_pet.gestId)
        {
          $scope.vipportal.unique(_pet.gestId);
        }
        else
        {
          $scope.vip = {gestName: '散客', gestCode: _pet.gestCode, gestSex: {dictDetailCode: 'DM00001'}, gestStyle: {levelName: '无'}, prepayMoney: 0};
        }

        // 会员姓名
        $scope.itback.gestName = _pet.gestName;

        // 会员手机
        $scope.itback.gestPhone = "";
    };

    $scope.petportal.checked = function (_pet) {
        $scope.petportal.setProperty(_pet);

        $("#petselect").modal('hide');
    };

    $scope.petportal.purchaser = function() {
        if($scope.petportal.purchaserType == 1) // 会员
        {
          $scope.petportal.setProperty({});
        }
        else if($scope.petportal.purchaserType == 2) //  散客
        {
          $scope.petportal.setProperty({ gestId: 0, gestCode: '', gestName: '散客', mobilePhone: '', petId: '', petName: '' });
        }
    };

    $scope.productportal.autocompletedata();

    $scope.itbackportal.filter();


});