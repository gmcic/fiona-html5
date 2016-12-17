
// 销售退货
angular.module('fiona').controller('ItbackController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {assistantIdSet: "服务助理", hairdresserIdSet: "服务师"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 直接销售
     * ---------------------------
     * */
    $scope.itbackportal = {

        id: "itback",

        name: "销售退货",

        server: "/api/v2/services",

        defilters: { "gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {
            save: function() {
                angular.forEach($scope.itbackdetails, function(_itbackdetail){
                      // 直销id
                      _itbackdetail.directSellId = $scope.itback.id;

                      // 直销编号
                      _itbackdetail.directSellCode = $scope.itback.directSellCode;

                      $scope.itbackdetailportal.saveWithEntity(_itbackdetail);
                });

                // 清除
                commons.success("结算成功, 销售单号[ " + $scope.itback.directSellCode + " ]");
                $scope.itbackportal.cleanup();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itbackportal }); //继承

    /**
     * 退货商品明细
     * ---------------------------
     * */

    $scope.itbackdetailportal = {

        id: "itbackdetail",

        name: "销售退货",

        server: "/api/v2/returncommoditydetails",

        defilters: { "gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {
            save: function() {
                angular.forEach($scope.itbackdetaildetails, function(_itbackdetaildetail){
                      // 直销id
                      _itbackdetaildetail.directSellId = $scope.itbackdetail.id;

                      // 直销编号
                      _itbackdetaildetail.directSellCode = $scope.itbackdetail.directSellCode;

                      // 业务类型ID
                      // _itbackdetaildetail.busiTypeId = $scope.itbackdetail.id;

                      $scope.itbackdetaildetailportal.saveWithEntity(_itbackdetaildetail);
                });

                // 清除
                commons.success("结算成功, 销售单号[ " + $scope.itbackdetail.directSellCode + " ]");
                $scope.itbackdetailportal.cleanup();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itbackdetailportal }); //继承

    /**
     * 选择会员
     * ---------------------------
     * */

    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

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
            itbackdetail.sellUnit = _product.recipeUnit;

            // 生产商
            itbackdetail.manufacturerCode = _product.dealerCode;

            itbackdetail.manufacturerName = _product.dealerName;

//            if(_product.itemStandard)
//            {
//                itbackdetail.itemName = itbackdetail.itemName + "(" +  _product.itemStandard + ")";
//            }

            // 个数
            itbackdetail.itemNum = 1;

            // 小计
            itbackdetail.totalCost = itbackdetail.itemNum * itbackdetail.sellPrice;

            // {'totalNum' : 0, 'totalCost': 0};
            $scope.saleplate.totalNum += itbackdetail.itemNum;
            $scope.saleplate.totalCost += itbackdetail.totalCost;

            $scope.itbackdetails.push(itbackdetail);

            commons.success("成功添加[ " +itbackdetail.itemName+ " ]商品");
        }
    };

    $scope.productportal.autocompletedata();

    $scope.itbackportal.filter();
});