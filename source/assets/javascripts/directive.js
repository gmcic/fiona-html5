// 指令
angular.module('fiona')

    // 搜索Bar
    .directive('faFilter', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                filters: '=',
                placeholder: '@',
                search: '&'
            },

            templateUrl: function (elem, attrs) {
                return attrs.templateurl;
            },

            controller: function ($scope, $timeout) {

                console.log("Directive: ");
                console.log($scope.filters);

                $scope.filtersCopy = $scope.filters;

                $scope.searchbar = {
                    "field": "",
                    "fieldName": "综合搜索",
                    "dataType": "",
                    "type": "",

                    "firstValue": "",
                    "lastValue": "",

                    "firstTextPlaceholder": $scope.placeholder,
                    "lastTextPlaceholder": ""
                };

                $scope.submit = function () {

                    if ((!$scope.searchbar.type && !!$scope.searchbar.firstValue)) {

                        if (!$scope.searchbar.field) {
                            // 综合搜索
                            $.each($scope.filtersCopy, function (i, filter) {
                                filter.value = $scope.searchbar.firstValue;
                            });

                            $scope.filters = $scope.filtersCopy;
                        }
                        else {
                            $scope.filters = [{
                                "fieldName": $scope.searchbar.field,
                                "operator": "EQ",
                                "value": $scope.searchbar.firstValue
                            }];
                        }

                        console.log($scope.filters);
                    }
                    else if ($scope.searchbar.type == 'between' && (!!$scope.searchbar.firstValue || !!$scope.searchbar.lastValue)) {
                        if (!$scope.searchbar.firstValue || !$scope.searchbar.lastValue) {
                            if (!!$scope.searchbar.firstValue) {
                                $scope.filters = [{
                                    "fieldName": $scope.searchbar.field,
                                    "operator": "GTE",
                                    "value": $scope.searchbar.firstValue
                                }];
                            }

                            if (!!$scope.searchbar.lastValue) {
                                $scope.filters = [{
                                    "fieldName": $scope.searchbar.field,
                                    "operator": "LTE",
                                    "value": $scope.searchbar.lastValue
                                }];
                            }
                        }
                        else {
                            $scope.filters = $scope.searchbar;
                        }
                    }
                    else {
                        $scope.filters = [];
                    }

                    // 手动触发
                    $timeout(function () {
                        $scope.$apply();
                        $scope.search();
                    });
                };

                $scope.setField = function (field, fieldName, dataType, type) {

                    $scope.searchbar.field = (!field ? '' : field);
                    $scope.searchbar.fieldName = (!fieldName ? '' : fieldName);
                    $scope.searchbar.dataType = (!dataType ? '' : dataType );
                    $scope.searchbar.type = (!type ? '' : type );

                    $scope.searchbar.firstValue = $scope.searchbar.lastValue = '';

                    if (!$scope.searchbar.field) {
                        // 综合搜索
                        $scope.searchbar.firstTextPlaceholder = $scope.placeholder;
                    }
                    else if (!!$scope.searchbar.field && $scope.searchbar.type == 'between') {
                        // 区间搜索
                        if ($scope.searchbar.dataType == 'date') {
                            $scope.searchbar.firstTextPlaceholder = "请选择最小日期";

                            $scope.searchbar.lastTextPlaceholder = "请选择最大日期";
                        }
                        else {
                            $scope.searchbar.firstTextPlaceholder = "请输入最小值";

                            $scope.searchbar.lastTextPlaceholder = "请输入最大值";
                        }
                    }
                    else {
                        $scope.searchbar.firstTextPlaceholder = "请输入" + $scope.searchbar.fieldName;
                    }
                };


                $scope.submit();
            }
        }
    })

    // 分页
    .directive('faPagination', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                component: '@',
                pagination: '=',
                search: '&'
            },

            templateUrl: "/views/pagination.html",

            controller: function ($scope, $timeout) {

                // Form 界面
                $scope.jump = function (_pagenumber) {

                    if (_pagenumber != undefined) {

                        if(!$scope.component)
                        {
                            $scope.pagination.pageNumber = _pagenumber;
                        }
                        else
                        {
                            $scope[$scope.pagination].pagination.pageNumber = _pagenumber;
                        }
                    }

                    $timeout(function () {
                        $scope.$apply();
                        $scope.search();
                    });
                };
            }
        }
    });