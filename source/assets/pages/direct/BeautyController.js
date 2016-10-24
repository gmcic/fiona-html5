// 美容服务
angular.module('fiona').controller('BeautyController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

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
                $scope.petportal.get($scope.beauty.gestId);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.beautyportal}); //继承

    /**
     * 服务项目
     * ---------------------------
     * */
    $scope.beautydetailportal = {

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
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承
});
