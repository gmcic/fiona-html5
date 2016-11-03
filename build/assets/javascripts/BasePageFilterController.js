angular.module('fiona').controller('BasePageFilterController', function ($scope, $http, commons) {
    // I'm the sibling, but want to act as parent

    $scope.error = "未找到定义";

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // 使用日期控件
    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function () {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    jQuery().datepicker && $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    });

    // 页面搜索
    $scope.pageFilterText = "";

    // 复选框
    $scope.selectedall = false;

    $scope.isRemoves = true;

    $scope.selection = {};

    $scope.selectChange = function () {
        $scope.isRemoves = true;
        angular.forEach($scope.selection, function (value, key) {
            if (value == true) {
                $scope.isRemoves = false;
            }
        });
    };

    $scope.selectAll = function () {
        angular.forEach($scope[$scope.master.id + 's'], function (data) {
            $scope.selection[data.id] = $scope.selectedall;
        })

        $scope.isRemoves = !$scope.selectedall
    };

    /**
     * 执行搜索
     */
    $scope.search = function () {

        console.log("$scope.search()");

        $http.get(commons.getBusinessHostname() + $scope.master.server).success( function ( data, status, headers, config ) {
            $scope[$scope.master.id + 's'] = data.data;
        });
    };

    // Form 界面
    $scope.detail = function (id) {
        $http.post(commons.getBusinessHostname() + '/api/v2/dicttypedetails', {
            'pageSize': 0,
            'pageNumber': 0,
            'filters': [{"fieldName": "dictTypeId", "value": id, "operator": "EQ"}]
        }).success(function (data, status, headers, config) {
            $scope.userdicts = data;
        });
    };


    /**
     * 添加
     */
    $scope.insert = function () {

        $scope[$scope.master.id + 'form'].submitted = false;

        // 添加
        $scope[$scope.master.id] = {"createUserId": "1", "updateUserId": "1"};

        if (!!$scope.master.insert) {
            $scope.master.insert();
        }

        $('#' + $scope.master.id).modal('toggle');
    };

    /**
     * 修改
     */
    $scope.update = function (id) {

        $scope[$scope.master.id + 'form'].submitted = false;

        angular.forEach($scope[$scope.master.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[$scope.master.id] = data;
            }
        });

        if (!!$scope.master.update) {
            $scope.master.update();
        }

        $('#' + $scope.master.id).modal('toggle');
    };

    /**
     * 保存表单
     */
    $scope[$scope.master.id + 'submit'] = function () {

        $scope[$scope.master.id + 'form'].submitted = true;

        if ($scope[$scope.master.id + 'form'].$valid) {

            $http.post(commons.getBusinessHostname() + $scope.master.server, $scope[$scope.master.id]).success(function (data, status, headers, config) {

                $('#' + $scope.master.id).modal('toggle');

                $scope.search();

                if (!!$scope.master.submit) {
                    $scope.master.submit();
                }
                
                commons.success("保存成功")

            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger($scope.master.id, "保存表单失败");
            });
        }
        else {
            alert('ValidError');
        }
    };

    // 删除功能
    $scope.removes = function () {
        var size = 0;

        angular.forEach($scope.selection, function (value, key) {
            if (value == true) {
                size++;
            }
        });

        if (confirm("您确定要删除选中[" + size + "]条记录吗?")) {
            angular.forEach($scope.selection, function (value, key) {
                if (value == true) {
                    $scope.delete(key);
                }
            });
        }
    };

    $scope.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            $scope.delete(id);
        }
    };

    // 具体的删除逻辑
    $scope.delete = function (id) {
        $http.delete(commons.getBusinessHostname() + $scope.master.server + "/" + id).success(function (data, index, array) {

            $scope.search();

            commons.success("删除成功")

        }).error(function (data) {
            commons.danger("删除失败");
        });
    }
});