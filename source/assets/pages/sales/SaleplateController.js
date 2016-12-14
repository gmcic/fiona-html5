
// 销售查询
angular.module('fiona').controller('SaleplateController', function($scope, $controller) {

    $scope.dropdowns = { };

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 销售查询
     * ---------------------------
     * */
    $scope.saleplateportal = {

        id: "saleplate",

        name: "销售查询",

        server: "/api/v2/storedirectsells",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplateportal}); //继承


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

        $('#' + $scope.productportal.id + "select").modal({backdrop: 'static', keyboard: false});
    };

    $scope.producttypeportal.init();

    $scope.productportal.filter();

});
