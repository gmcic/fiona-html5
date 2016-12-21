
// 预约管理
angular.module('fiona').controller('AppointmentController', function($scope, $controller, $http, commons) {

    $scope.dropdowns = {};

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 预约管理
     * ---------------------------
     * */
    $scope.appointmentportal = {

        id: "appointment",

        name: "预约管理",

        server: "/api/v2/personsappointments",

        defilters: { },

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.appointmentportal}); //继承

    $scope.appointmentportal.filter();
});