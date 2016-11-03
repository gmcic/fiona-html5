
// 处方模板管理
angular.module('fiona').controller('PrescriptionController', function ($scope, $controller, $http, commons) {

    /**
     * 目录树（商品与服务）
     * ---------------------------
     * */
    $scope.prescriptiontypeportal= {

        text: "cateName", // 树标签-字段名

        parent: "parentId", // 父引用-字段名

        foreignkey: "cateNo", //

        id: "prescriptiontype",

        name: "模板类型",

        server: "/api/v2/prescriptiontemplatetypes",

        selectNode: function () {
            alert("selectNode");
        }
    };

    $controller('TreePanelController', {$scope: $scope, component: $scope.prescriptiontypeportal}); //继承

    // 初始化
    $scope.prescriptiontypeportal.init();

    $scope.prescriptiontype = {};

    /**
     * 主数据加载地址
     * ---------------------------
     * */
    $scope.prescriptionportal= {

        foreign: "prescriptiontype", // 外键

        foreignkey: "cateNo",

        id: "prescription",

        name: "处方模版",

        server: "/api/v2/prescriptiontemplates",

        filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""} ],// 综合搜索项 // 品种

        placeholder : "请输入品种"
    };

    $controller('TablePaginationPanelController', {$scope: $scope, component: $scope.prescriptionportal}); //继承

    /**
     * 处方模板明细
     * ---------------------------
     * */
    $scope.prescriptiondetailportal= {

        foreign: "prescriptiontype", // 外键

        foreignkey: "cateNo",

        id: "prescriptiondetail",

        name: "处方模版",

        server: "/api/v2/prescriptiontemplatedetails"
    };

    $controller('TablePaginationPanelController', {$scope: $scope, component: $scope.prescriptiondetailportal}); //继承

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductPopupSelectController', {$scope: $scope}); //继承

    $scope.productportal.master.submit = function (selected) {
        if (!$scope.prescriptiondetails) {
            $scope.prescriptiondetails = [];
        }

        angular.forEach(selected, function (_data) {
            var prescriptiondetail = {createUserId: 1, updateUserId: 1};

            // 服务ID
            // prescriptiondetail.serviceId = $scope.inhospital.id;

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                prescriptiondetail[name] = _data[name];
            });

            // 个数
            prescriptiondetail.inputCount = 1;
            // 总价
            prescriptiondetail.totalCost = 1;

            $scope.prescriptiondetails.push(prescriptiondetail);
            //
            // // 备
            // inhospitaldetail.remark = _data.remark;
        });

        // 总项
        // $scope.inhospital.totalNum = $scope.inhospitaldetails.length;

        // 总金额
        //
        // $scope.inhospital.totalCost = $scope.inhospitaldetail.length;
    };

    $scope.productportal.init();
});
