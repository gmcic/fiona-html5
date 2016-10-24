
// 销售退货
angular.module('fiona').controller('BespeakController', function($scope, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
//        typesSet: [{id: "1", va'': "经销商"}, {id: "2", va'': "生产商"}, {id: "3", va'': "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

//    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 销售退货
     * ---------------------------
     * */
    $scope.bespeakportal = {

        id: "bespeak",

        name: "销售退货",

        server: "/api/v2/",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.bespeakportal}); //继承

});