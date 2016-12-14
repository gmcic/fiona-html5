// 住院管理
angular.module('fiona').controller('InhospitalController', function ($scope, $controller, $http, commons) {

    $scope.dropdowns = { };

    commons.findDict($scope.dropdowns, {managerIdSet: "主管人员"});

    $controller('BaseController', {$scope: $scope}); //继承

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
            update: function () {
                $scope.petportal.unique($scope.inhospital.petId);

                $scope.inhospitaldetailportal.search();

                $scope.inhospitalprescriptionportal.search();

                $scope.vipprepayportal.search();
            },
            insert: function() {
                $scope.inhospital.totalMoney = 0;

                $scope.serialNumber({id: "inhospital", fieldName : "inHospitalNo", numberName : "住院编号"});

                $scope.setSelectDefault("inhospital", ["itemCode", "managerId", "manufacturerId"]);
            },
            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.inhospitaldetails, function (_inhospitaldetail) {
                    $scope.inhospitaldetail = _inhospitaldetail;

                    // 寄养ID
                    $scope.inhospitaldetail.inHospitalId = $scope.inhospital.id;

                    // 寄养编号
                    $scope.inhospitaldetail.inHospitalNo = $scope.inhospital.inHospitalNo;

                    $scope.inhospitaldetailportal.save();
                });
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

        foreignkey: "inHospitalId", // 外键

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
    $scope.inhospitalprescriptionportal = {
        id: "inhospitalprescription",

        name: "住院处方",

        server: "/api/v2/inhospitalprescriptions",

        callback: {
            submitbefore: function () {

                $scope.inhospitalprescription.inHospitalNo = $scope.inhospital.inHospitalNo;

                $scope.inhospitalprescription.inHospitalId = $scope.inhospital.id;

                // 病例号
                $scope.inhospitalprescription.sickFileCode = $scope.inhospital.id;

                $scope.inhospitalprescription.gestName = $scope.inhospital.gestName;

                $scope.inhospitalprescription.petName = $scope.inhospital.petName;
            },

            submit: function () {
                angular.forEach($scope.inhospitalprescriptiondetails, function (_inhospitalprescriptiondetail) {

                    $scope.inhospitalprescriptiondetail = _inhospitalprescriptiondetail;
                    $scope.inhospitalprescriptiondetail.prescriptionId = $scope.inhospitalprescription.id;

                    $scope.inhospitalprescriptiondetailportal.save();
                });

                $scope.inhospitalprescriptiondetail = {};
            },

            delete: function () {
                $scope.inhospitalprescriptiondetails = [];
            },

            switched: function () {
                $scope.inhospitalprescriptiondetailportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.inhospitalprescriptionportal}); //继承

    /**
    * 住院处方明细
    * ---------------------------
    * */
    $scope.inhospitalprescriptiondetailportal = {

        foreign: "inhospitalprescription", // 外键

        foreignkey: "prescriptionId",

        id: "inhospitalprescriptiondetail",

        name: "住院处方明细",

        server: "/api/v2/inhospitalprescriptiondetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalprescriptiondetailportal}); //继承

    $scope.inhospitalprescriptionportal.insert = function () {

        $scope.inhospitalprescriptionportal.selectedId = null;

        $scope.inhospitalprescription = {};
        $scope.inhospitalprescriptiondetails = [];

        $scope.serialNumber({id: "inhospitalprescription", fieldName : "prescriptionCode", numberName : "处方流水"});

        $("#inhospitalprescription").modal({backdrop: 'static', keyboard: false});
    };

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

        if (!$scope.inhospitalprescriptiondetails) {
            $scope.inhospitalprescriptiondetails = [];
        }

        if($scope.inhospitalprescriptiondetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.modaldanger("inhospitalprescriptiondetails", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var inhospitalprescriptiondetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
                inhospitalprescriptiondetail[name] = _product[name];
            });

            inhospitalprescriptiondetail.manufacturerCode = _product.dealerCode;
            inhospitalprescriptiondetail.manufacturerName = _product.dealerName;

            // 售价
            inhospitalprescriptiondetail.itemCost = _product.sellPrice;

            // 个数
            inhospitalprescriptiondetail.itemNum = 1;

            $scope.inhospitalprescriptiondetails.push(inhospitalprescriptiondetail);

            commons.modalsuccess("inhospitalprescriptiondetails", "成功添加[ " +inhospitalprescriptiondetail.itemName+ " ]商品");
        }

        $scope.productportal.resize();
    };

    // 重新计算
    $scope.productportal.resize = function () {

        $scope.inhospitalprescription.prescriptionCost = 0;

        angular.forEach($scope.inhospitalprescriptiondetaildetails, function (_inhospitalprescriptiondetail) {
            // 小计
            var _totalCost = _inhospitalprescriptiondetail.itemCost * _inhospitalprescriptiondetail.itemNum;

            // 总金额
            $scope.inhospitalprescription.prescriptionCost += _totalCost;
        });
    }

    /**
     * 住院期间消费
     * ---------------------------
     * */

    // 商品选择
    $scope.onselectinhospital = function() {

        $http.get(commons.getBusinessHostname() + $scope.productportal.server + "/" + $scope.selectedProduct.originalObject.id).success(function (data, status, headers, config) {

            $scope.inhospitaldetailportal.checked(data.data);

        }).error(function (data, status, headers, config) {
            commons.modaldanger($scope.productportal.id, "加载惟一的记录失败")
        });

        // 清除选中
        $scope.selectedProduct = {};

        $scope.searchStr = "";

        $('#inhospitalautocomplete_value').val("");
    };


    $scope.inhospitaldetailportal.checked = function (_product) {

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

            angular.forEach(["itemCode", "itemName", "recipeUnit", "useUnit", "frequency", "dose", "sellPrice",  "useWay", "itemStandard"], function (name) {
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

    $scope.inhospitaldetailportal.resize = function () {

        $scope.inhospital.totalMoney = 0;

        angular.forEach($scope.inhospitaldetails, function (_inhospitaldetail) {
            // 小计
            _inhospitaldetail.totalCost = _inhospitaldetail.sellPrice * _inhospitaldetail.itemNum;

            // 总金额
            $scope.inhospital.totalMoney += _inhospitaldetail.totalCost;
        });
    }

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.checked = function (_pet) {

        $scope.pet = _pet;

        // 会员ID
        $scope.inhospital.gestId = _pet.gestId;

        // 会员编号
        $scope.inhospital.gestCode = _pet.gestCode;

        // 会员姓名
        $scope.inhospital.gestName = _pet.gestName;

        // 会员手机
        $scope.inhospital.mobilePhone = "";

        // 宠物ID
        $scope.inhospital.petId = _pet.id;

        // 宠物名称
        $scope.inhospital.petName = _pet.petName;

        $("#petselect").modal({backdrop: 'static', keyboard: false});
    };

    $scope.productportal.autocompletedata();

    $scope.inhospitalportal.filter();
});
