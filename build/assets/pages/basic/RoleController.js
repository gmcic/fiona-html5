
// 角色管理
angular.module('fiona').controller('RoleController', function($scope, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type']= 'application/json';

    // 使用日期控件
    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function() {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    $("#role_popdom").jstree({
        plugins: ["wholerow", "checkbox", "types"],
        core: {
            themes: {responsive: !1},
            data: [{
                text: "Same but with checkboxes",
                children: [{text: "initially selected", state: {selected: !0}}, {
                    text: "custom icon",
                    icon: "fa fa-warning icon-state-danger"
                }, {
                    text: "initially open",
                    icon: "fa fa-folder icon-state-default",
                    state: {opened: !0},
                    children: ["Another node"]
                }, {text: "custom icon", icon: "fa fa-warning icon-state-warning"}, {
                    text: "disabled node",
                    icon: "fa fa-check icon-state-success",
                    state: {disabled: !0}
                }]
            }, "And wholerow selection"]
        },
        types: {
            "default": {icon: "fa fa-folder icon-state-warning icon-lg"},
            file: {icon: "fa fa-file icon-state-warning icon-lg"}
        }
    });


    jQuery().datepicker && $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    });


    $scope.error= "未找到定义";

    $scope.selectedall = false;

    $scope.isRemoves = true;

    $scope.selection = {};

    $scope.selectChange = function () {
        $scope.isRemoves = true;
        angular.forEach($scope.selection, function(value, key){
            if(value == true)
            {
                $scope.isRemoves = false;
            }
        });
    };

    $scope.selectAll= function () {
        angular.forEach($scope.roles, function (role) {
            $scope.selection[role.id] = $scope.selectedall;
        })

        $scope.isRemoves = !$scope.selectedall
    };

    // 综合搜索项
    $scope.pagination = {
        'pageSize': 1,
        'pageNumber': 1,
        "first":true,
        "last":false,
        "totalElements": 1,
        "totalPages": 1
    };

    $scope.combox = {
        types: [ {'name':'猫科'}, {'name':'犬科'} ]
    };

    // 综合搜索项 // 品种
    $scope.filters = [{"fieldName": "name","operator": "EQ", "value":""}];

    $scope.placeholder = "请输入品种";

    // 检索宠物信息
    $scope.search = function () {

        console.log(" 执行搜索.... " + searchform.$dirty);

        $http.post('/business/api/v2/roles/page', {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}).success( function ( data, status, headers, config ) {
            console.log( data );

            $scope.roles = data.data.content;

            // 搜索+分页
            $scope.pagination.pageNumber = data.data.number;

            $scope.pagination.last = data.data.last;
            $scope.pagination.first = data.data.first;
            $scope.pagination.totalPages = data.data.totalPages;
            $scope.pagination.totalElements = data.data.totalElements;
        });
    };


    // Form 界面
    $scope.update = function (id) {
        // alert(id);
        if(id == undefined)
        {
            // 添加
            $scope.role = {};
        }
        else
        {
            angular.forEach($scope.roles, function(data,index,array){
                if(data.id== id)
                {
                    $scope.role = data;
                }
            });
        }

        $('#role').modal('toggle');
    };


    $scope.rolesubmit = function () {

        $scope.roleform.submitted = true;

        if ($scope.roleform.$valid) {

            console.log('submit: ' + $scope.role.id);

            $http.post('/business/api/v2/roles', $scope.role).success( function ( data, status, headers, config ) {
                console.log( data );
            }).error(function(data,status,headers,config) { //     错误
                alert("Rolesubmit Error");
            });
        } else {

            alert($scope.roleform.$error);

            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
    };

    $scope.updatetype = function (id) {
        // alert(id);
        if(id == undefined)
        {
            // 添加
            $scope.role = {};
        }
        else
        {
            // angular.forEach($scope.roles, function(data,index,array){
            //     if(data.id== id)
            //     {
            //         $scope.role = data;
            //     }
            // });
        }

        $('#type').modal('toggle');
    };

    $scope.typesubmit = function () {

        $scope.roleform.submitted = true;

        if ($scope.roleform.$valid) {

            console.log('submit: ' + $scope.role.id);

            $http.post('/business/api/v2/roles', $scope.role).success( function ( data, status, headers, config ) {
                console.log( data );
            }).error(function(data,status,headers,config) { //     错误
                alert("Rolesubmit Error");
            });
        } else {

            alert($scope.roleform.$error);

            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
    };


    // 删除功能
    $scope.removes = function () {
        angular.forEach($scope.selection, function(value, key){
            alert(key+ " = " + value);
        });
    };

    $scope.remove= function (id) {
        // console.log( $scope.xiuUser )

        alert(id);

        $http.delete('/business/api/v2/roles/' + id).success(function(data, index, array){
            commons.danger("删除成功");
        }).error(function (data) {
            commons.danger("删除失败");
        });

        // angular.forEach($scope.roles, function(data,index,array){
        //
        //     if(data.id == id)
        //     {
        //     }
        //
        // });

    };


});