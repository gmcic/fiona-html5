// 收费管理
angular.module('fiona').controller('PaymentController', function($scope, $http, commons, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
        paymentTypeSet: [{id: "现金", valueNameCn: "现金"}, {id: "支付宝", valueNameCn: "支付宝"}, {id: "微信", valueNameCn: "微信"}, {id: "银行卡", valueNameCn: "银行卡"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 结算
     * ---------------------------
     * */
    $scope.balance = function()
    {
        var payobject = {gestPaidRecord: {operateAction: $scope.paymentpractical.operateAction, operateContent: $scope.paymentpractical.operateContent}, settleAccountsViews: []};

        angular.forEach($scope.paymentdetailportal.selection, function (value, key) {
            if(value == true)
            {
                var _paymentdetail = $scope["paymentdetails"].getObjectWithIdValue(key);

                delete _paymentdetail.sumprice;

                _paymentdetail.isVipDiscount = $scope.paymentpractical.isVipDiscount;

                payobject.settleAccountsViews.push(_paymentdetail);
            }
        });

        console.log(payobject.settleAccountsViews);

        $http.post(commons.getBusinessHostname() + "/api/v2/gestpaidrecords/pay", payobject).success(function (data, status, headers, config) {

            $scope.statement = data.data;

            $scope.statementdetailportal.searchByWhere({settleAccountsDetailId: $scope.statement.id}, function(){

                angular.forEach($scope.statementdetails, function(_statementdetail){
                    _statementdetail.sumprice =  _statementdetail.totalNum * _statementdetail.totalCost;
                })

            });

            $('#payment').modal('toggle');

            $scope.payments = [];

            $scope.paymentportal.list();

            $scope.paymentportal.print();

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger("payment", "保存失败")
        });

    }

    $scope.allowpay = false;

    $scope.allowmessage = "";

    /** 计算支付金额 */
    $scope.pay = function()
    {

//        alert($scope.paymentpractical.price + ",  " + $scope.paymentpractical.operateContent);

//        if($scope.paymentpractical.price <= 0)
//        {
//            $scope.allowmessage = "请支付金额为空,请要选择结算的项目!";
//        }

        if($.isEmptyObject($scope.paymentdetailportal.selection))
        {
            $scope.allowmessage = "请选择要支付的项目";
        }
        else if(!$scope.paymentpractical.operateContent)
        {
            $scope.allowmessage = "请输入支付金额";
        }
        else if(!$scope.paymentpractical.operateContent || $scope.paymentpractical.operateContent <= $scope.paymentpractical.price)
        {
            $scope.allowmessage = "支付金额不足";
        }
        else
        {
            $scope.allowmessage = "";
        }

        // $scope.paymentpractical.price > 0 && $scope.paymentpractical.operateContent > 0  &&
        if($scope.paymentpractical.operateContent  >= $scope.paymentpractical.price)
        {
           $scope.paymentpractical.backprice = $scope.paymentpractical.operateContent  - $scope.paymentpractical.price;

            $scope.allowmessage = "";
           $scope.allowpay = true;
        }
        else
        {
            $scope.allowpay = false;
        }
    };

    /**
     * 收费管理
     * ---------------------------
     * */
    $scope.paymentportal = {

        id: "payment",

        name: "收费管理",

        server: "/api/v2/gestpaidrecords/billList",

        callback: {
            update: function(){
                $scope.paymentpractical = {"operateAction": "现金"};
                $scope.vipportal.unique($scope.payment.gestId);
                $scope.paymentdetailportal.list();
            }
        }
    };


    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentportal}); //继承

    $scope.paymentportal.print = function () {

        $scope.nowtime = new Date();

        $('#paymentprint').modal('toggle');
    };

    // 打印页面
    $scope.print = function () {
        document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = $('#paymentprintbody').html();
        document.getElementById('printiframe').contentWindow.print();
        // $('#doctorprescriptprint').modal('toggle');
    }

    /**
     * 收费明细
     * ---------------------------
     * */
    $scope.paymentdetailportal = {

        id: "paymentdetail",

        name: "收费管理",

        server: "/api/v2/gestpaidrecords/billDetail",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentdetailportal}); //继承

    $scope.paymentdetailportal.list = function() {

        $http.get(commons.getBusinessHostname() + this.server + "/" + $scope.payment.gestId).success(function (data, status, headers, config) {
            $scope['paymentdetails'] = data.data;

            angular.forEach($scope['paymentdetails'], function(_paymentdetail){
                _paymentdetail.sumprice = _paymentdetail.itemCost * _paymentdetail.itemNum;
            });

            $scope.paymentdetailportal.selectChange();

            if(this.callback && this.callback.list)
            {
                this.callback.list();
            }
        });
    }

    $scope.paymentdetailportal.selectChange = function () {

        $scope.paymentdetailportal.isRemoves = true;

        angular.forEach($scope.paymentdetailportal.selection, function (value, key) {
            if (value == true) {
                $scope.paymentdetailportal.isRemoves = false;
            }
        });

        var _totalSize = 0;

        var _totalPrice = 0;

        var _price = 0;

        angular.forEach($scope.paymentdetails, function (_paymentdetail) {
            if($scope.paymentdetailportal.selection[_paymentdetail.id])
            {
                _price += _paymentdetail.sumprice;
            }

            _totalSize++;

            _totalPrice += _paymentdetail.sumprice;
        });

        console.log("折扣: " + $scope.paymentpractical.isVipDiscount);

        if($scope.paymentpractical.isVipDiscount)
        {
            _price = Math.round(Math.floor(parseFloat(_price*100 * $scope.paymentpractical.isVipDiscount))/100);
        }

        $scope.paymentpractical.totalSize = _totalSize;

        $scope.paymentpractical.totalPrice = _totalPrice;

        $scope.paymentpractical.price = _price;

        $scope.pay();
    };

    $scope.paymentdetailportal.selectAll = function () {

        angular.forEach($scope[$scope.paymentdetailportal.id + 's'], function (data) {
            $scope.paymentdetailportal.selection[data.id] = $scope.paymentdetailportal.selectedall;
        });

        $scope.paymentdetailportal.isRemoves = !$scope.paymentdetailportal.selectedall

        $scope.paymentdetailportal.selectChange();
    };


    /**
     * 结算单明细
     * ---------------------------
     * */
    $scope.statementdetailportal = {

        id: "statementdetail",

        name: "结算单明细",

        server: "/api/v2/financesettleaccountsdetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementdetailportal}); //继承

    /**
     * 支付流水
     * ---------------------------
     * */
    $scope.paymentlogportal = {

        id: "paymentlog",

        name: "支付流水",

        server: "/api/v2/gestpaidrecords"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentlogportal}); //继承

    /**
     * 会员管理
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.paymentportal.list();
});
