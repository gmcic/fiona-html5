
angular.module('fiona').controller('GradeController', function($scope, $controller, $http, commons) {

    /**
     * 会员等级管理
     * ---------------------------
     * */
    $scope.gradeportal= {

        id: "grade",

        name: "会员等级管理",

        server: "/api/v2/gestlevels"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.gradeportal}); //继承

    $scope.gradeportal.search();
});