// 住院管理
angular.module('fiona').controller('InhospitalController', function ($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);


    $scope.dropdownWithTable({id: "managerId", server: "/api/v2/personss"}); // 主管人员
    $scope.dropdownWithTable({id: "manufacturerId", server: "/api/v2/personss"}); // 业务员

    // 挂号服务类型
    $scope.dropdownWithTable({id: "itemCode", server: "/api/v2/itemtypes", condition : {"cateNo": "7b3fe252-bddd-4ffe-9527-468aaa6629b7"}});

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
            insert: function() {
                $scope.serialNumber({id: "inhospital", fieldName : "inHospitalNo", numberName : "住院编号"});

                $scope.setSelectDefault("inhospital", ["itemCode", "managerId", "manufacturerId"]);
            }
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

//    /**
//     * 住院处方
//     * ---------------------------
//     * */
//    $scope.inhospitalprescriptiondetailportal = {
//        slave: {
//            name: "处方",
//            server: "/api/v2/inhospitalprescriptions"
//        },
//
//        // 主数据加载地址
//        master: {
//            id: "inhospitalprescriptiondetail",
//            name: "住院处方",
//            foreignkey: "dictTypeId",
//            server: "/api/v2/inhospitalprescriptiondetails",
//        }
//    };
//
//    $controller('SidePortalController', {$scope: $scope, component: $scope.inhospitalprescriptiondetailportal}); //继承
//
//    $scope.inhospitalprescriptiondetailportal.init();

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 自动补全选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.inhospitaldetails) {
            $scope.inhospitaldetails = [];
        }

        if($scope.inhospitaldetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.modaldanger("doctorprescript", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var inhospitaldetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "recipeUnit", "sellPrice",  "useWay", "itemStandard"], function (name) {
                inhospitaldetail[name] = _product[name];
            });

            inhospitaldetail.manufacturerCode = _product.dealerCode;
            inhospitaldetail.manufacturerName = _product.dealerName;

            // 个数
            inhospitaldetail.itemNum = 1;

            inhospitaldetail.totalCost = inhospitaldetail.itemNum * inhospitaldetail.sellPrice;


            $scope.inhospitaldetails.push(inhospitaldetail);

            commons.modalsuccess("doctorprescript", "成功添加[ " +inhospitaldetail.itemName+ " ]商品");
        }
    };

    $scope.productportal.autocompletedata();


});
