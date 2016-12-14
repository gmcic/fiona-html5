
// 宠物管理
angular.module('fiona').controller('InvaccineController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= { };

    commons.findDict($scope.dropdowns, {companyTypeSet: "厂家类型", doctorIdSet: "主治医生", assistantDoctorIdSet: "助理医师"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 驱虫疫苗
     * ---------------------------
     * */
    $scope.invaccineportal = {

        id: "invaccine",

        name: "驱虫疫苗",

        defilters: {"gestName": "会员姓名", "petName": "宠物昵称"},

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

                angular.forEach(["gestId","gestCode","gestName","mobilePhone", "id", "petId", "petName", "vaccineGroupCode", "doctorId", "doctorName", "assistantDoctorId", "assistantDoctorName"], function(name){
                    $scope.invaccinedetail[name] = $scope.invaccine[name];
                });

                if($scope.invaccine.doctorId)
                {
                    $scope.invaccinedetail.doctorName = $scope.dropdowns.doctorIdSet.getObjectWithId({id: $scope.invaccine.doctorId}).personName;
                }

                if($scope.invaccine.assistantDoctorId)
                {
                    $scope.invaccinedetail.assistantDoctorName = $scope.dropdowns.assistantDoctorIdSet.getObjectWithId({id: $scope.invaccine.assistantDoctorId}).personName;
                }

                $scope.invaccinedetailportal.save();
            });

            $scope.invaccinedetail = {};

            $scope.invaccineportal.list();

            commons.success("保存成功");

            $('#' + this.id).modal({backdrop: 'static', keyboard: false});
        }

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

        defilters: {"gestName": "会员姓名", "petName": "宠物昵称"},

        server: "/api/v2/medicvaccines",

        callback : {
            save: function(data){
                console.log(data);
                $scope.invaccines.unshift(data);
            }
        }
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

        $("#petselect").modal({backdrop: 'static', keyboard: false});
    };

    $scope.productportal.autocompletedata();

    $scope.invaccineportal.list();
});