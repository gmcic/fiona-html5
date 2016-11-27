
// 宠物管理
angular.module('fiona').controller('InvaccineController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {companyTypeSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]};

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdownWithTable({id: "doctorId", server: "/api/v2/personss"}); // 主治医生
    $scope.dropdownWithTable({id: "assistantDoctorId", server: "/api/v2/personss"}); // 助理医师

    /**
     * 驱虫疫苗
     * ---------------------------
     * */
    $scope.invaccineportal = {

        id: "invaccine",

        name: "驱虫疫苗",

        defilters: { "code": "自动编号"},

        server: "/api/v2/medicvaccines",

        callback: {
            insert: function () {
                $scope.setSelectDefault("invaccine", ["doctorId", "assistantDoctorId"]);

                $scope.serialNumber({id: "invaccine", fieldName : "vaccineGroupCode", numberName : "驱虫疫苗组号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.invaccineportal}); //继承

    /**
     * 提交保存
     * ---------------------------
     * */
    $scope.invaccineportal.submit = function () {

        $scope[this.id + "form"].submitted = true;

        if ($scope[this.id + "form"].$valid) {

            angular.forEach($scope.invaccinedetails, function (_invaccinedetail) {

                $scope.invaccinedetail = _invaccinedetail;

                angular.forEach(["gestId","gestCode","gestName","mobilePhone","id","petName"], function(name){
                    $scope.invaccinedetail[name] = $scope.invaccine[name];
                });

                $scope.invaccinedetailportal.save();
            });

            $scope.invaccinedetail = {};
        }

        $scope.invaccineportal.list();

        commons.success("保存成功");
        $('#' + this.id).modal('toggle');
    };

    /**
     * 驱虫疫苗
     * ---------------------------
     * */
    $scope.invaccinedetailportal= {

        foreign: "invaccine", // 外键

        foreignkey: "vaccineGroupCode",

        id: "invaccinedetail",

        name: "驱虫疫苗",

        server: "/api/v2/medicvaccines"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.invaccinedetailportal}); //继承

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

        if (!$scope.invaccinedetails) {
            $scope.invaccinedetails = [];
        }

        if($scope.invaccinedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
            commons.modaldanger("invaccinedetails", "[ 商品" +_product.itemName+ " ]已存在");
        }
        else {
            // 未选择新添加

            var invaccinedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "itemStandard"], function (name) {
                invaccinedetail[name] = _product[name];
            });

            invaccinedetail.manufacturerCode = _product.dealerCode;
            invaccinedetail.manufacturerName = _product.dealerName;

            // 售价
            invaccinedetail.itemCost = _product.sellPrice;

            // 个数
            invaccinedetail.itemNum = 1;

            $scope.invaccinedetails.push(invaccinedetail);

            commons.modalsuccess("invaccinedetails", "成功添加[ " +invaccinedetail.itemName+ " ]商品");
        }

        $scope.productportal.resize();
    };

    // 重新计算
    $scope.productportal.resize = function () {

        $scope.invaccine.totalCost = 0;

        angular.forEach($scope.invaccinedetails, function (_invaccinedetail) {
            // 小计
            _invaccinedetail.totalCost = _invaccinedetail.itemCost * _invaccinedetail.itemNum;

            // 总金额
            $scope.invaccine.totalCost += _invaccinedetail.totalCost;
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
        $scope.invaccine.gestId = _pet.gestId;

        // 会员编号
        $scope.invaccine.gestCode = _pet.gestCode;

        // 会员姓名
        $scope.invaccine.gestName = _pet.gestName;

        // 会员手机
        $scope.invaccine.mobilePhone = "";

        // 宠物ID
        $scope.invaccine.petId = _pet.id;

        // 宠物名称
        $scope.invaccine.petName = _pet.petName;

        $("#petselect").modal('toggle');
    };

    $scope.productportal.autocompletedata();

    $scope.invaccineportal.list();

});