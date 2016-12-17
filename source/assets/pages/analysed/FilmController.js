
// 宠物管理
angular.module('fiona').controller('FilmController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.filmportal= {

        id: "film",

        name: "经销商与生产商",

        defilters: { "code": "自动编号" , "name": "经销商名称" , "contractMan": "联系人" , "mobilePhone": "手机" , "filmAddress": "地址"  },

        server: "/api/v2/films",

        callback: {
            insert: function () {
                $scope.setSelectDefault("film", ["companyType"]);

                $scope.serialNumber({id: "film", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.filmportal}); //继承

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

    $scope.filmportal.list();

});