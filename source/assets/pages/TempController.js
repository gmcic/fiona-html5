// 宠物管理
angular.module('fiona')
.controller('TempController', function($scope, $http, userService) {

    // 使用日期控件
    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function() {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    jQuery().datepicker && $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    });
    
    // 综合搜索项
    $scope.pagination = {
        'pageSize': 10,
        'pageNumber': 1,
        "first":true,
        "last":false,
        "totalElements": 1,
        "totalPages": 1
    };

    $scope.filters = [
        // 宠物病例号
        {"fieldName": "name","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员编号
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员名称
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员电话
        {"fieldName": "name","operator": "EQ", "value":""}
    ];

    $scope.placeholder = "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话";

    // 搜索条
    // $scope.searchbar = {"pageSize": 3, "pageNumber": 1};

    // 检索宠物信息
    $scope.search = function () {

        alert(" 执行搜索.... " + "" + ", array: " + $scope.filters.length);
        
        // $.each($scope.filters, function(i, filter){
        //     alert("综合搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");
        // });

        // console.log(" 执行搜索.... " + searchform.$dirty);

        // 搜索条有修改
        // $scope.setSearchData();
        // if($scope.searchform != null && $scope.searchform.$dirty)
        // {
        //
        //     // $scope.pagination.data
        //     alert($scope.searchform.$dirty);
        // }

        // 分页查询
        $http.get( 'server/api/v2/pets/page.json' ).success( function ( data, status, headers, config ) {
            console.log( data );

            $scope.pets = data.data.content;

            // 搜索+分页
            // $scope.pagination.data.pageNumber = data.data.number;
            // $scope.pagination.bar.last = data.data.last;
            // $scope.pagination.bar.first = data.data.first;
            // $scope.pagination.bar.totalPages = data.data.totalPages;
            // $scope.pagination.bar.totalElements = data.data.totalElements;
        });
    };

    // 初始化
    // $scope.search();

    // Form 界面
    $scope.submitform = function () {

        $scope.petform.submitted = true;

        if ($scope.petform.$valid) {
            alert('submit: ' + $scope.pet.gestCode);
        } else {
            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
        // alert($scope.pet.gestCode);
    };

    $scope.update = function (id) {
        angular.forEach($scope.pets, function(data,index,array){
            if(data.gestCode == id)
            {
                $scope.pet = data;
            }
        });

        $('#large').modal('toggle');
    };

    // 删除功能
    $scope.remove= function () {
        // console.log( $scope.xiuUser )
        $http.get( 'server/user/remove/1', { params: $scope.data } );
    };

    // alert("Invoke: SidebarController");
    // $http.get("server/role.json").success(function (data, status, headers, config ) {
    //     // alert('GET Success');
    // }).error(function (data, status, headers, config) {
    //     alert('GET Error');
    // });
})
//
.controller('CaseController', function($scope, $http, userService) {

    // 使用日期控件
    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function() {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    jQuery().datepicker && $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    });

    // 综合搜索项
    $scope.filters = [
        // 宠物病例号
        {"fieldName": "name","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员编号
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员名称
        {"fieldName": "name","operator": "EQ", "value":""},

        // 会员电话
        {"fieldName": "name","operator": "EQ", "value":""}
    ];

    $scope.searchplaceholder = "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话";

    // 搜索条
    // $scope.searchbar = {"pageSize": 3, "pageNumber": 1};

    // 分页信息
    $scope.pagination = {
        "data":{"pageSize": 3, "pageNumber": 1},

        "bar": {
            "firstTextPlaceholder":$scope.searchplaceholder, "lastTextPlaceholder":"",
            "first":false, "last":false, "totalElements": 1, "totalPages": 1,

            "links": [{"num":1, active:true}, {"num":2}, {"num":3}]
        }
    };

    // 搜索Bar
    $scope.searchbar = { "field":"", "fieldName":"综合搜索", "dataType":"", "type": "", "valueBegin":"", "valueEnd":"" };

    // 检索宠物信息
    $scope.search = function () {

        console.log(" 执行搜索.... " + searchform.$dirty);

        // 搜索条有修改
        $scope.setSearchData();
        // if($scope.searchform != null && $scope.searchform.$dirty)
        // {
        //
        //     // $scope.pagination.data
        //     alert($scope.searchform.$dirty);
        // }

        // 分页查询
        $http.get( 'server/api/v2/pets/page.json' ).success( function ( data, status, headers, config ) {
            console.log( data );

            $scope.pets = data.data.content;

            // 搜索+分页
            $scope.pagination.data.pageNumber = data.data.number;

            $scope.pagination.bar.last = data.data.last;
            $scope.pagination.bar.first = data.data.first;
            $scope.pagination.bar.totalPages = data.data.totalPages;
            $scope.pagination.bar.totalElements = data.data.totalElements;
        });
    };

    // 设置搜索数据
    $scope.setSearchData = function () {

        // alert($scope.searchbar.fieldName + ", " + $scope.searchbar.field + ", " + $scope.searchbar.firstValue + ", " + $scope.searchbar.firstValue) ;

        if(($scope.searchbar.type == '' && $scope.searchbar.firstValue != ''))
        {
            if($scope.searchbar.field == '')
            {
                // 综合搜索
                $.each($scope.filters, function(i, filter){
                    filter.value = $scope.searchbar.firstValue;

                    // alert("综合搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");
                });

                $scope.pagination.data.filter = $scope.filters;
            }
            else {
                // alert("单值搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");

                $scope.pagination.data.filter = [{"fieldName": $scope.searchbar.field,"operator": "EQ", "value":$scope.searchbar.firstValue}];
            }
        }
        else if($scope.searchbar.type == 'between' && ($scope.searchbar.firstValue != ''|| $scope.searchbar.lastValue != ''))
        {
            if($scope.searchbar.firstValue == ''|| $scope.searchbar.lastValue == '')
            {
                if($scope.searchbar.firstValue != '')
                {
                    //  alert("区间搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");
                    $scope.pagination.data.filter = [{"fieldName": $scope.searchbar.field,"operator": "GTE", "value":$scope.searchbar.firstValue}];
                }
                else {
                    // alert("区间搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");
                    $scope.pagination.data.filter = [{"fieldName": $scope.searchbar.field,"operator": "LTE", "value":$scope.searchbar.lastValue}];
                }
            }
            else
            {
                // alert("区间搜索: '" + filter.fieldName + "', '" + filter.operator + "', '" + filter.value + "' ");
                $scope.pagination.data.filter = $scope.filters;
            }
        }
    };

    // 设置检索字段
    $scope.setSearchField= function (field, fieldName, dataType, type) {

        $scope.searchbar.field = (!field?'':field);
        $scope.searchbar.fieldName = (!fieldName?'':fieldName);
        $scope.searchbar.dataType = (!dataType?'':dataType );
        $scope.searchbar.type= (!type?'':type );

        $scope.searchbar.firstValue = $scope.searchbar.lastValue = '';

        if($scope.searchbar.field == '')
        {
            $scope.pagination.bar.firstTextPlaceholder = $scope.searchplaceholder;
        }
        else if($scope.searchbar.field != '' && $scope.searchbar.type == 'between')
        {
            if($scope.searchbar.dataType == 'date')
            {
                $scope.pagination.bar.firstTextPlaceholder = "请选择" + $scope.searchbar.fieldName + "最小日期";

                $scope.pagination.bar.lastTextPlaceholder = "请选择" + $scope.searchbar.fieldName + "最大日期";
            }
            else
            {
                $scope.pagination.bar.firstTextPlaceholder = "请输入" + $scope.searchbar.fieldName + "最小值";

                $scope.pagination.bar.lastTextPlaceholder = "请输入" + $scope.searchbar.fieldName + "最大值";
            }
        }
        else {
            $scope.pagination.bar.firstTextPlaceholder = "请输入" + $scope.searchbar.fieldName;
        }

        // alert($scope.pagination.bar.firstTextPlaceholder);
        // alert($scope.searchbar.field + ", " + $scope.searchbar.fieldName  + ", " + $scope.searchbar.dataType + ", " + $scope.searchbar.type );
    }

    // 初始化
    $scope.search();

    // Form 界面
    $scope.submitform = function () {

        $scope.petform.submitted = true;

        if ($scope.petform.$valid) {
            alert('submit: ' + $scope.pet.gestCode);
        } else {
            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
        // alert($scope.pet.gestCode);
    };

    $scope.update = function (id) {
        angular.forEach($scope.pets, function(data,index,array){
            if(data.gestCode == id)
            {
                $scope.pet = data;
            }
        });

        $('#large').modal('toggle');
    };

    // 删除功能
    $scope.remove= function () {
        // console.log( $scope.xiuUser )
        $http.get( 'server/user/remove/1', { params: $scope.data } );
    };


    // alert("Invoke: SidebarController");
    // $http.get("server/role.json").success(function (data, status, headers, config ) {
    //     // alert('GET Success');
    // }).error(function (data, status, headers, config) {
    //     alert('GET Error');
    // });
});