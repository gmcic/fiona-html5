
// 销售退货
angular.module('fiona').controller('BespeakController', function($scope, $http, commons) {

    $scope.dropdowns = {};

    $controller('BaseController', {$scope: $scope}); //继承

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