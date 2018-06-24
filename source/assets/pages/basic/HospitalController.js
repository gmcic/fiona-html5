
// 化验项目管理
angular.module('fiona').controller('HospitalController', function($scope, $http, $controller, commons) {

    $scope.hospital = {};
    $scope.isSellShow='所有';

    $http.get(commons.getBusinessHostname() + "/api/v2/enterprises" + commons.getTimestampStr()).success(function (data, status, headers, config) {
        angular.forEach(data.data, function (item) {
            $scope.hospital = item;
        });
    });

    $scope.onChange = function(){
        commons.setIsSellShow($scope.isSellShow);
    }

    $scope.hospitalsubmit = function () {
        $scope["hospitalform"].submitted = true;

        if ($scope["hospitalform"].$valid) {

            $http.post(commons.getBusinessHostname() + "/api/v2/enterprises" + commons.getTimestampStr(), $scope['hospital']).success(function (data, status, headers, config) {
                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误
                commons.danger("hospital", "保存失败")
            });
        }
    };
});