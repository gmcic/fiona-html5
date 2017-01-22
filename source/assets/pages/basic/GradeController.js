angular.module('fiona').controller('GradeController', function ($scope, $controller, $http, commons) {

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 会员等级管理
     * ---------------------------
     * */
    $scope.gradeportal = {

        id: "grade",

        name: "会员等级管理",

        server: "/api/v2/gestlevels",
        callback: {
            insert: function () {
                $scope.serialNumber({id: "grade", fieldName: "levelCode", numberName: "会员等级"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.gradeportal}); //继承

    $scope.gradeportal.search();
});