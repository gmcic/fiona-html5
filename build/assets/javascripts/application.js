angular.module('fiona', ['ngRoute','fiona.services', 'blueimp.fileupload', 'ngJsTree'])
    .config(['$routeProvider','$httpProvider', 'fileUploadProvider', function($routeProvider,$httpProvider, fileUploadProvider) {
       delete $httpProvider.defaults.headers.common['X-Requested-With'];
        fileUploadProvider.defaults.redirect = window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        );

        $httpProvider.interceptors.push('UserInterceptor');

        $routeProvider
            .when('/', {
                controller: "DashboardController",
                templateUrl: "views/dashboard.html"
            })

// 业务办理 - BEGIN
    // 诊疗服务
            // 就诊管理
            .when('/curemanager/list', {
                controller: 'CuremanagerController',
                templateUrl: 'views/cure/curemanager/curemanager_list.html'
            })
            // 疫苗登记
            .when('/invaccine/list', {
                controller: 'InvaccineController',
                templateUrl: 'views/cure/invaccine/invaccine_list.html'
            })
            // 处方模板管理
            .when('/prescription/list', {
                controller: 'PrescriptionController',
                templateUrl: 'views/cure/prescription/prescription_list.html'
            })
            // 病案管理
            .when('/medicalrecord/list', {
                controller: 'MedicalrecordController',
                templateUrl: 'views/cure/medicalrecord/list.html'
            })
    // 化验影像
            // 化验检查
            .when('/analysed/list', {
                controller: 'AnalysedController',
                templateUrl: 'views/analysed/analysed/list.html'
            })
            // 影像检查
            .when('/film/list', {
                controller: 'FilmController',
                templateUrl: 'views/analysed/film/list.html'
            })
    // 拓瑞检测
            // 检测查询
            .when('/check/list', {
                controller: 'CheckController',
                templateUrl: 'views/check/check/check_list.html'
            })
            // 尿检设备
            .when('/checkdevice/formset', {
                controller: 'CheckdeviceController',
                templateUrl: 'views/check/checkdevice/formset.html'
            })
// 业务办理 - END
// 经营管理 - BEGIN
    // 结算服务
            // 收费管理
            .when('/payment/list', {
                controller: 'PaymentController',
                templateUrl: 'views/balance/payment/list.html'
            })
            // 结算单管理
            .when('/statement/list', {
                controller: 'StatementController',
                templateUrl: 'views/balance/statement/list.html'
            })
// 经营管理 - END
// Finished - BEGIN
    // 会员信息
            // 宠物管理
            .when('/pet/list', {
                controller: 'PetController',
                templateUrl: 'views/guest/pet/pet_list.html'
            })
            // 会员管理
            .when('/vip/list', {
                controller: 'VipController',
                templateUrl: 'views/guest/vip/vip_list.html'
            })
    // 经营管理
            // 支出管理
            .when('/expenditure/list', {
                controller: 'ExpenditureController',
                templateUrl: 'views/management/expenditure/expenditure_list.html'
            })
    // 销售服务
            // 直接销售
            .when('/saleplatedetail', {
                controller: 'SaleplatedetailController',
                templateUrl: 'views/sales/saleplatedetail/saleplatedetail_list.html'
            })
            // 销售查询
            .when('/saleplate', {
                controller: 'SaleplateController',
                templateUrl: 'views/sales/saleplate/saleplate_list.html'
            })
    // 直达通道
            // 预约管理
            .when('/bespeak/list', {
                controller: 'BespeakController',
                templateUrl: 'views/direct/bespeak/bespeak_list.html'
            })
            // 美容服务
            .when('/beauty/list', {
                controller: 'BeautyController',
                templateUrl: 'views/direct/beauty/beauty_list.html'
            })
            // 寄养管理
            .when('/fosterage/list', {
                controller: 'FosterageController',
                templateUrl: 'views/direct/fosterage/fosterage_list.html'
            })
            // 住院管理
            .when('/inhospital/list', {
                controller: 'InhospitalController',
                templateUrl: 'views/direct/inhospital/inhospital_list.html'
            })
            // 销售退货
            .when('/itback/list', {
                controller: 'ItbackController',
                templateUrl: 'views/direct/itback/itback_list.html'
            })
    // 挂号
            // 挂号查询
            .when('/register/search', {
                controller: 'RegisterController',
                templateUrl: 'views/registration/register/register_list.html'
            })
    // 仓库管理
            // 库存查询
            .when('/stock/list', {
                controller: 'StockController',
                templateUrl: 'views/stock/stock/stock_list.html'
            })
            // 入库管理
            .when('/instorage/list', {
                controller: 'InstorageController',
                templateUrl: 'views/stock/instorage/instorage_list.html'
            })
            // 出库管理
            .when('/outstorage/list', {
                controller: 'OutstorageController',
                templateUrl: 'views/stock/outstorage/outstorage_list.html'
            })
            // 移库管理
            .when('/movestorage/list', {
                controller: 'MovestorageController',
                templateUrl: 'views/stock/movestorage/movestorage_list.html'
            })
            // 退货管理
            .when('/backstorage/list', {
                controller: 'BackstorageController',
                templateUrl: 'views/stock/backstorage/backstorage_list.html'
            })
    // 基础数据
            // 宠物品种管理
            .when('/varietie/list', {
                controller: 'VarietieController',
                templateUrl: 'views/basic/varietie/varietie_list.html'
            })
            // 经销商与生产商
            .when('/dealer/list', {
                controller: 'DealerController',
                templateUrl: 'views/basic/dealer/dealer_list.html'
            })
            // 仓库信息管理
            .when('/storage/list', {
                controller: 'StorageController',
                templateUrl: 'views/basic/storage/storage_list.html'
            })
            // 商品与服务管理
            .when('/product/list', {
                controller: 'ProductController',
                templateUrl: 'views/basic/product/product_list.html'
            })
            // 会员等级管理
            .when('/grade/list', {
                controller: 'GradeController',
                templateUrl: 'views/basic/grade/grade_list.html'
            })
            // 业务类型
            .when('/businestype/list', {
                controller: 'BusinestypeController',
                templateUrl: 'views/basic/businestype/businestype_list.html'
            })
            // 员工管理
            .when('/personnel/list', {
                controller: 'PersonnelController',
                templateUrl: 'views/basic/personnel/personnel_list.html'
            })
            // 化验项目管理
            .when('/labwork/list', {
                controller: 'LabworkController',
                templateUrl: 'views/basic/labwork/labwork_list.html'
            })
            // 医院信息
            .when('/hospital/list', {
                controller: 'HospitalController',
                templateUrl: 'views/basic/hospital/hospital_list.html'
            })
            // 角色管理
            .when('/role/list', {
                controller: 'RoleController',
                templateUrl: 'views/basic/role/list.html'
            })
            // 数据字典管理
            .when('/execute/execute_list', {
                controller: 'DictionaryController',
                templateUrl: 'views/basic/dictionary/dictionary_list.html'
            })
            // 用户数据字典
            .when('/userdict/list', {
                controller: 'UserdictController',
                templateUrl: 'views/basic/userdict/userdict_list.html'
            })
// Finished - END

            .otherwise({redirectTo: '/'});
    }])
    // 首页面
    .controller('DashboardController', function($scope) {
        // define controller to prevent console error

        $scope.userName = 'tim';
    })

    .controller('InboxController', function($scope, $routeParams, $location) {
        $scope.name = $routeParams.name;
    });

// Role 控制器
function TempController ( $scope, $http ) {

    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function() {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    // alert("Invoke: SidebarController");
    // $http.get("server/role.json").success(function (data, status, headers, config ) {
    //     // alert('GET Success');
    // }).error(function (data, status, headers, config) {
    //     alert('GET Error');
    // });
}

function InvoiceCntl($scope)
{
    $scope.yourname= "Tim";
}
