// 住院管理
angular.module('fiona').controller('InhospitalController', function ($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 住院管理
     * ---------------------------
     * */
    $scope.inhospitalportal = {

        id: "inhospital",

        name: "住院管理",

        server: "/api/v2/inhospitalrecords",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalportal}); //继承

    /**
     * 寄养期间消费
     * ---------------------------
     * */
    $scope.inhospitaldetailportal = {

        foreign: "inhospital", // 外键

        foreignkey: "serviceId", // 外键

        id: "inhospitaldetail",

        name: "寄养期间消费",

        server: "/api/v2/inhospitalrecorddetails",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitaldetailportal}); //继承

    /**
     * 预付金额
     * ---------------------------
     * */
    $scope.vipprepayportal = {

        foreign: "inhospital", // 外键

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
    $scope.inhospitalhealthportal = {

        foreign: "inhospital", // 外键

        foreignkey: "relationId", // 外键

        id: "inhospitalhealth",

        name: "健康状态记录",

        server: "/api/v2/inhospitalhealths",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalhealthportal}); //继承

    /**
     * 住院处方
     * ---------------------------
     * */
    $scope.inhospitalprescriptiondetailportal = {
        slave: {
            name: "处方",
            server: "/api/v2/inhospitalprescriptions"
        },

        // 主数据加载地址
        master: {
            id: "inhospitalprescriptiondetail",
            name: "住院处方",
            foreignkey: "dictTypeId",
            server: "/api/v2/inhospitalprescriptiondetails",
        }
    };

    $controller('SidePortalController', {$scope: $scope, component: $scope.inhospitalprescriptiondetailportal}); //继承

    $scope.inhospitalprescriptiondetailportal.init();

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

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

});
