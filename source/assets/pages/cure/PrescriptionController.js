
// 处方模板管理
angular.module('fiona').controller('PrescriptionController', function ($scope, $controller, $http, commons) {

    // 是否打折: isVipDiscount, 是否销售: isSell, 是否记库: isCount
    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {recipeUnitSet: "物品单位"});

    $controller('BaseController', {$scope: $scope}); //继承

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

        server: "/api/v2/prescriptiontemplatetypes",

        callback: {
            insert: function () {
                $scope.serialNumber({id: "prescriptiontype", fieldName : "typeNo", numberName : "个人处方模板"});
            }
        }
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

        defilters: {templateNo:"模板编号",templateName:"模板名称"},

        server: "/api/v2/prescriptiontemplates",

        callback: {
            update: function () {
                $scope.prescripttemplatedetails = [];

                $scope.prescripttemplatedetailportal.searchByWhere({templateNo: $scope.prescripttemplate.templateNo}, function (_details) {
                    angular.forEach(_details, function (_detail) {
                        _detail.itemNum = parseInt(_detail.itemNum);
                    });
                });

                $scope.prescriptiontypeportal.unique($scope.prescripttemplate.typeId);
            },
            insert: function () {
                $scope.prescripttemplate.typeId = $scope.prescriptiontype.id;
                $scope.prescripttemplate.typeNo = $scope.prescriptiontype.typeNo;

                $scope.prescripttemplatedetails = [];

                $scope.serialNumber({id: "prescripttemplate", fieldName : "templateNo", numberName : "个人处方"});
            },
            submit : function () {
                angular.forEach($scope.prescripttemplatedetails, function (_prescripttemplatedetail) {
                    _prescripttemplatedetail.templateId = $scope.prescripttemplate.id;
                    _prescripttemplatedetail.templateNo = $scope.prescripttemplate.templateNo;

                    $scope.prescripttemplatedetailportal.saveWithEntity(_prescripttemplatedetail);
                })
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
            var _prescripttemplatedetail= {};

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                _prescripttemplatedetail[name] = _product[name];
            });

            // 售价
            _prescripttemplatedetail.sellPrice = _product.recipePrice;

            // 个数
            _prescripttemplatedetail.itemNum = 1;

            $scope.prescripttemplatedetails.push(_prescripttemplatedetail);

            commons.modalsuccess("prescripttemplatedetails", "成功添加[ " +_prescripttemplatedetail.itemName+ " ]商品");
        }
    };


    // 初始化商品数据
    $scope.productportal.autocompletedata();

    // 初始化
    $scope.prescriptiontypeportal.init();

    $scope.prescripttemplateportal.filter();
});
