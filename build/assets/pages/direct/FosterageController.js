
// 寄养管理

// 住院管理
angular.module('fiona').controller('FosterageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

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

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.fosteragedetailportal}); //继承

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
