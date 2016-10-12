
// 宠物管理
angular.module('fiona').controller('CuremanagerController', function($scope, $http, commons) {


    /**
     *  诊断信息
     * ---------------------------
     * */


    $scope.curemanagerportal = {
        id: "curemanager",

        name: "诊断信息",

        server: "/api/v2/medicmedictreatrecords",

        callback: {
            switched: function () {
                $scope.expenditureportal.search();
            }
        }
    };

    $controller('TablePaginationPanelController', {$scope: $scope, component: $scope.curemanagerportal}); //继承


    /**
    * 就诊列表（挂号）
    * ---------------------------
    * */
    $scope.registerportal = {
        id: "register",

        name: "支出分类",

        server: "/api/v2/medicregisterrecords",

        callback: {
            switched: function () {
                $scope.expenditureportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.registerportal}); //继承

    /**
     *  选择宠物
     * ---------------------------
     * */
    $scope.petportal = {
        dropdowns: {},
        dropboxargs : [],

        master: {
            id: "pet",

            name: "宠物",

            server: "/api/v2/pets",

            checked: function () {
                // 主人ID
                $scope.beauty.gestId = $scope.pet.id;

                // 主人编号
                $scope.beauty.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.beauty.gestName = $scope.pet.gestName;
            },
            submit: function () {
                // 主人ID
                $scope.beauty.gestId = $scope.pet.id;

                // 主人编号
                $scope.beauty.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.beauty.gestName = $scope.pet.gestName;
            },
            insert: function () {
                angular.forEach($scope.petportal.dropdowns, function (value, key) {
                    $scope.pet[key.substr(0, key.length - 3)] = value[0];
                });
            }
        },

        parent: {
            id: "beauty"
        }
    };

    $controller('CommonVipController', {$scope: $scope, component: $scope.petportal}); //继承




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

    $("#tree_2").jstree({
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
        angular.forEach($scope.curemanagers, function (curemanager) {
            $scope.selection[curemanager.id] = $scope.selectedall;
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
        types: [ {'name':'猫科'}, {'name':'犬科'} ],
        sex:[{'code':'1', cnname: '男', enname:''}, {'code':'0', cnname: '女', enname:''}]
    };

    // 综合搜索项
    $scope.filters = [
        // 宠物病例号
        // {"fieldName": "name","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "curemanagerCode","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "curemanagerName","operator": "EQ", "value":""},

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

        // 分页查询  /business/api/v2/curemanagers
        // $http.get('/server/api/v2/curemanagers/page.json', {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}).success( function ( data, status, headers, config ) {

        // alert('pageSize: '+ $scope.pagination.pageSize  +'pageNumber: ' + $scope.pagination.pageNumber + ", " + $scope.filters.length);

        // angular.forEach($scope.filters, function (data, index) {
        //     alert(data.fieldName);
        // });

        $http.post('/server/api/v2/curemanagers/page.json', {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}).success( function ( data, status, headers, config ) {
            console.log( data );

            $scope.curemanagers = data.data.content;

            // $http.post('/business/api/v2/curemanagers', data).success( function ( data, status, headers, config ) {
            //     console.log( data );
            //     alert("Submit OK");
            // }).error(function(data,status,headers,config) { //     错误
            //     alert("保存失败,请确认后重试" + status);
            // });

            // angular.forEach($scope.curemanagers, function (curemanager, i) {
            //     alert(curemanager.id);
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
    $scope.curemanagersubmit = function () {

        $scope.curemanagerform.submitted = true;

        alert("CuremanagerSex: " + $scope.curemanager.curemanagerSex.valueNameCn);

        // angular.forEach($scope.curemanager.curemanagerSex, function (data, key) {
        //     alert(key + ": "  + data);
        // });


        if ($scope.curemanagerform.$valid) {
            // alert('submit: ' + $scope.curemanager.id);
            $http.post('/business/api/v2/curemanagers', $scope.curemanager).success( function ( data, status, headers, config ) {
                console.log( data );
                alert("Submit OK");
            }).error(function(data,status,headers,config) { //     错误
                alert("Status: " + status);
            });
        } else {

            alert("Error: " + $scope.curemanagerform.$error);

            // $scope.message = "请输入用户名和密码.";

            // $scope.signup_form.submitted = true;
        }
    };

    $scope.update = function (id) {

        if(id == undefined)
        {
            // 添加
            $scope.curemanager = {};
        }
        else
        {
            angular.forEach($scope.curemanagers, function(data,index,array){
                if(data.id== id)
                {
                    $scope.curemanager = data;
                }
            });
        }

        $('#curemanager').modal('toggle');
    };

    // 增加检查
    $scope.testingmodal = function (id) {

        // if(id == undefined)
        // {
        //     // 添加
        //     $scope.curemanager = {};
        // }
        // else
        // {
        //     angular.forEach($scope.curemanagers, function(data,index,array){
        //         if(data.id== id)
        //         {
        //             $scope.curemanager = data;
        //         }
        //     });
        // }

        $('#testing').modal('toggle');
    };

    // 增加影像检查
    $scope.filmmodal = function (id) {

        // if(id == undefined)
        // {
        //     // 添加
        //     $scope.curemanager = {};
        // }
        // else
        // {
        //     angular.forEach($scope.curemanagers, function(data,index,array){
        //         if(data.id== id)
        //         {
        //             $scope.curemanager = data;
        //         }
        //     });
        // }

        $('#film').modal('toggle');
    };

    // 增加处方
    $scope.recipemodal = function (id) {

        // if(id == undefined)
        // {
        //     // 添加
        //     $scope.curemanager = {};
        // }
        // else
        // {
        //     angular.forEach($scope.curemanagers, function(data,index,array){
        //         if(data.id== id)
        //         {
        //             $scope.curemanager = data;
        //         }
        //     });
        // }

        $('#recipe').modal('toggle');
    };
    

    // 就诊
    $scope.curepet = function (id) {
        $('#curelist a[href="//#cure_pet"]').tab('show') // Select tab by


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

        $http.delete('/business/api/v2/curemanagers/' + id).success(function(data, index, array){
            commons.danger("删除成功");
        }).error(function (data) {
            commons.danger("删除失败");
        });

        // angular.forEach($scope.curemanagers, function(data,index,array){
        //
        //     if(data.id == id)
        //     {
        //     }
        //
        // });

    };


});