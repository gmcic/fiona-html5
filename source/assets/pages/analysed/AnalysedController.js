
// 宠物管理
angular.module('fiona').controller('AnalysedController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {companyTypeSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.analysedportal= {

        id: "analysed",

        name: "经销商与生产商",

        defilters: { "code": "自动编号" , "name": "经销商名称" , "contractMan": "联系人" , "mobilePhone": "手机" , "analysedAddress": "地址"  },

        server: "/api/v2/analyseds",

        callback: {
            insert: function () {
                $scope.setSelectDefault("analysed", ["companyType"]);

                $scope.serialNumber({id: "analysed", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.analysedportal}); //继承

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

        $("#petselect").modal('hide');
    };

    $scope.analysedportal.list();
});