
// 处方模板管理
angular.module('fiona').controller('PrescriptionController', function ($scope, $controller, $http, commons) {

    /**
     * 目录树（处方分类）
     * ---------------------------
     * */
    $scope.prescriptiontypeportal= {

        text: "typeName", // 树标签-字段名

        parent: "parentId", // 父引用-字段名

        foreignkey: "typeNo", //

        id: "prescriptiontype",

        name: "模板类型",

        server: "/api/v2/prescriptiontemplatetypes"
    };

    $controller('TreeSidePanelController', {$scope: $scope, component: $scope.prescriptiontypeportal}); //继承

    $scope.prescriptiontype = {};

    /**
     * 处方模版
     * ---------------------------
     * */
    $scope.prescripttemplateportal= {

        foreign: "prescripttemplatetype", // 外键

        foreignkey: "cateNo",

        id: "prescripttemplate",

        name: "处方模版",

        defilters: { "templateNo" :"编号","templateName" :"名称"},

        server: "/api/v2/prescriptiontemplates",

        filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""} ],// 综合搜索项 // 品种

        placeholder : "请输入品种",

        callback: {
            insert: function () {
                $scope.prescripttemplate.typeId = $scope.prescriptiontype.id;
                $scope.prescripttemplate.typeNo = $scope.prescriptiontype.typeNo;
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.prescripttemplateportal}); //继承

    /**
     * 处方模版明细
     * ---------------------------
     * */
    $scope.prescripttemplatedetailportal= {

        id: "prescripttemplatedetail",

        name: "处方模版明细",

        server: "/api/v2/prescriptiontemplatedetails",

        filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""} ],// 综合搜索项 // 品种

        placeholder : "请输入品种"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.prescripttemplatedetailportal}); //继承


    /**
     * 自动补全选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    /**
     * 添加处方明细
     * ---------------------------
     * */
    $scope.productportal.checked = function (_product) {

        if (!$scope.prescripttemplatedetails) {
            $scope.prescripttemplatedetails = [];
        }

        if($scope.prescripttemplatedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.modaldanger("prescripttemplatedetails", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var prescripttemplatedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                prescripttemplatedetail[name] = _product[name];
            });

            prescripttemplatedetail.manufacturerCode = _product.dealerCode;
            prescripttemplatedetail.manufacturerName = _product.dealerName;

            // 售价
            prescripttemplatedetail.itemCost = _product.sellPrice;

            // 个数
            prescripttemplatedetail.itemNum = 1;

            $scope.prescripttemplatedetails.push(prescripttemplatedetail);

            commons.modalsuccess("prescripttemplatedetails", "成功添加[ " +prescripttemplatedetail.itemName+ " ]商品");
        }

        $scope.productportal.resize();
    };

    // 重新计算
    $scope.productportal.resize = function () {

        $scope.inhospitalprescription.prescriptionCost = 0;

        angular.forEach($scope.prescripttemplatedetaildetails, function (_prescripttemplatedetail) {
            // 小计
            var _totalCost = _prescripttemplatedetail.itemCost * _prescripttemplatedetail.itemNum;

            // 总金额
            $scope.inhospitalprescription.prescriptionCost += _totalCost;
        });
    }

    // 初始化商品数据
    $scope.productportal.autocompletedata();

    // 初始化
    $scope.prescriptiontypeportal.init();
});
