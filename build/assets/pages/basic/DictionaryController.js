
// 数据字典管理
angular.module('fiona').controller('DictionaryController', function($scope, $controller) {

    /**
     * 数据字典
     * ---------------------------
     * */
    $scope.dictionaryportal= {

        foreign: "dictionarytype", // 外键

        foreignkey: "dictTypeId",

        id: "dictionary",

        name: "数据字典",

        server: "/api/v2/dicttypedetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dictionaryportal}); //继承

    /**
     * 字典分类
     * ---------------------------
     * */
    $scope.dictionarytypeportal = {
        id: "dictionarytype",

        name: "字典分类",

        server: "/api/v2/dicttypes",

        callback: {
            switched: function () {
                $scope.dictionaryportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.dictionarytypeportal}); //继承

    $scope.dictionarytypeportal.init();

});