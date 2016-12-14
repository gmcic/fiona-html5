
// 业务类型
angular.module('fiona').controller('BusinestypeController', function($scope, $controller, commons) {

    $scope.dropdowns= {};

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.businestypeportal= {

        id: "businestype",

        name: "业务类型",

        defilters: { "code": "自动编号" , "name": "经销商名称" , "contractMan": "联系人" , "mobilePhone": "手机" , "businestypeAddress": "地址"  },

        server: "/api/v2/businescates"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.businestypeportal}); //继承

    $scope.businestypeportal.list();
});