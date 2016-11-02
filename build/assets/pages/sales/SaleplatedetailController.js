// 销售查询
angular.module('fiona').controller('SaleplatedetailController', function($scope, $controller) {


    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);


//    $scope.saleplate = {directSellCode:"单号0019192838473", totalNum: 0, totalCost: 0};

    /**
     * 直接销售
     * ---------------------------
     * */
    $scope.saleplatedetailportal = {

        id: "saleplatedetail",

        name: "直接销售",

        server: "/api/v2/storedirectselldetails",

        defilters: { "petCode" :"宠物编号","petName" :"宠物昵称","gestCode" :"会员编号","gestName" :"会员名称"},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplatedetailportal}); //继承


    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $scope.productchecked = {}; // 已选择的商品

    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.productportal.submit = function () {

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                if($scope.productchecked[product.itemCode]) {    // 是否已选择

                }
                else {
                    // 未选择新添加

                    var doctorprescriptdetail= {};

                    //  "inputCount",

                    angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                        doctorprescriptdetail[name] = product[name];
                    });

                    doctorprescriptdetail.itemCost = product.recipePrice;

                    // 个数
                    doctorprescriptdetail.itemNum = 1;

                    $scope.productchecked[doctorprescriptdetail.itemCode] = doctorprescriptdetail;

                    $scope.doctorprescriptdetails.push(doctorprescriptdetail);
                }
            }
        });

        $('#' + $scope.productportal.id + "select").modal('toggle');
    };

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    /**
     * 选择会员
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

});
