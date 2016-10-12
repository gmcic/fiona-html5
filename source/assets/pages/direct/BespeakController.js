
// 宠物管理
angular.module('fiona').controller('BespeakController', function($scope, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type']= 'application/json';

    // alert(commons.getAuthorization());

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
        angular.forEach($scope.bespeaks, function (bespeak) {
            $scope.selection[bespeak.id] = $scope.selectedall;
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

    // 综合搜索项
    $scope.filters = [
        // 宠物病例号
        // {"fieldName": "name","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "bespeakCode","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "bespeakName","operator": "EQ", "value":""},

        // 会员编号
        {"fieldName": "gestCode","operator": "EQ", "value":""},

        // 会员名称
        {"fieldName": "gestName","operator": "EQ", "value":""},

        // 会员电话
        // {"fieldName": "mobilePhone","operator": "EQ", "value":""}
    ];

    $scope.placeholder = "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话";

    // 检索宠物信息
    $scope.search = function () {

        // alert(" 执行搜索.... ");

        console.log(" 执行搜索.... " + searchform.$dirty);

        angular.forEach($scope.filters, function (data) {
            console.log(" 执行搜索.... " + data.fieldName + ", " + data.operator + ", " + data.value);
        });

        // 分页查询  /business/api/v2/bespeaks
        // $http.get('/server/api/v2/bespeaks/page.json', {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}).success( function ( data, status, headers, config ) {

        // alert('pageSize: '+ $scope.pagination.pageSize  +'pageNumber: ' + $scope.pagination.pageNumber + ", " + $scope.filters.length);

        // angular.forEach($scope.filters, function (data, index) {
        //     alert(data.fieldName);
        // });

        $scope.bespeaks = [{'name':'name'}];

        $http.post('/server/api/v2/bespeaks/page.json', {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}).success( function ( data, status, headers, config ) {
            console.log( data );

            $scope.bespeaks = data.data.content;



            // $http.post('/business/api/v2/bespeaks', data).success( function ( data, status, headers, config ) {
            //     console.log( data );
            //     alert("Submit OK");
            // }).error(function(data,status,headers,config) { //     错误
            //     alert("保存失败,请确认后重试" + status);
            // });

            // angular.forEach($scope.bespeaks, function (bespeak, i) {
            //     alert(bespeak.id);
            // });

            // 搜索+分页
            $scope.pagination.pageNumber = data.data.number+1;

            $scope.pagination.last = data.data.last;
            $scope.pagination.first = data.data.first;
            $scope.pagination.totalPages = data.data.totalPages;
            $scope.pagination.totalElements = data.data.totalElements;
        });
    };


    // Form 界面
    $scope.bespeaksubmit = function () {

        $scope.bespeakform.submitted = true;

        if ($scope.bespeakform.$valid) {
            alert('submit: ' + $scope.bespeak.id);
            $http.post('/business/api/v2/bespeaks', $scope.bespeak).success( function ( data, status, headers, config ) {
                console.log( data );
                alert("Submit OK");
            }).error(function(data,status,headers,config) { //     错误
                alert(status);
            });
        } else {

            alert($scope.bespeakform.$error);

            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
    };

    $scope.update = function (id) {

        if(id == undefined)
        {
            // 添加
            $scope.bespeak = {};
        }
        else
        {
            angular.forEach($scope.bespeaks, function(data,index,array){
                if(data.id== id)
                {
                    $scope.bespeak = data;
                }
            });
        }

        $('#bespeak').modal('toggle');
    };

    // 住院登记
    $scope.inhospitalmodal = function (id) {

        if(id == undefined)
        {
            // 添加
            $scope.bespeak = {};
        }
        else
        {
            angular.forEach($scope.bespeaks, function(data,index,array){
                if(data.id== id)
                {
                    $scope.bespeak = data;
                }
            });
        }

        $('#inhospital').modal('toggle');
    };

    // 寄养登记
    $scope.fosteragemodal = function (id) {

        if(id == undefined)
        {
            // 添加
            $scope.bespeak = {};
        }
        else
        {
            angular.forEach($scope.bespeaks, function(data,index,array){
                if(data.id== id)
                {
                    $scope.bespeak = data;
                }
            });
        }

        $('#fosterage').modal('toggle');
    };

    // 确认
    $scope.confirm = function (id) {
        if(confirm("您确定要发送确认短信吗?")) {
            alert("确认短信已经发送,确认成功");
        }
    };

    // 取消
    $scope.cancel = function (id) {
        if(confirm("您确定要取消该条预约吗?"))
        {
            alert("预约已成功取消");
        }
    };

    // 重发短信
    $scope.cancel = function (id) {

    };

    // 重发短信
    $scope.resend = function (id) {

        if(id == undefined)
        {

        }
        else
        {

        }

        $('#resend').modal('toggle');
    };

    // 重发短信
    $scope.detail = function (id) {

        if(id == undefined)
        {

        }
        else
        {

        }

        $('#detail').modal('toggle');
    };

    // 会员挂号
    $scope.registervipmodal = function (id) {

        if(id == undefined)
        {
            // 添加
            $scope.register = {};
        }
        else
        {
            angular.forEach($scope.registers, function(data,index,array){
                if(data.id== id)
                {
                    $scope.register = data;
                }
            });
        }

        $('#registervip').modal('toggle');
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

        $http.delete('/business/api/v2/bespeaks/' + id).success(function(data, index, array){
            commons.danger("删除成功");
        }).error(function (data) {
            commons.danger("删除失败");
        });

        // angular.forEach($scope.bespeaks, function(data,index,array){
        //
        //     if(data.id == id)
        //     {
        //     }
        //
        // });

    };


});