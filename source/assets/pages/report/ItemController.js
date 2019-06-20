// 商品报表
angular.module('fiona').controller('ItemController', function ($scope, $http, commons) {
  // Handles counterup plugin wrapper
  var handleCounterup = function() {
      if (!$().counterUp) {
          return;
      }

      $("[data-counter='counterup']").counterUp({
          delay: 10,
          time: 1000
      });
  };


  var showItemsData = function(){
      var table = $('#item_day');

      table.dataTable({
          "ordering": true,
          searching:true,
          autoWidth:false,
          language: {
              aria: {
                  sortAscending: ": activate to sort column ascending",
                  sortDescending: ": activate to sort column descending"
              },
              emptyTable: "无记录",
              info: "显示 _START_ 到 _END_ 总 _TOTAL_ 记录",
              infoEmpty: "没有找到记录",
              infoFiltered: "(从 _MAX_ 条记录过滤)",
              lengthMenu: "每页 _MENU_ 条记录",
              search: "搜索:",
              zeroRecords: "未找到匹配记录",
              paginate: {
                  previous: "上一页",
                  next: "下一页",
                  last: "尾页",
                  first: "首页"
              }
          },destroy:true
          ,data: $scope.reportItemData,columns: [
              { title: "名称",data: 'itemName',"width": "20%" },
              { title: "销售数量",data: 'totalNum' },
              { title: "销售均价",data: 'avgPrice' },
              { title: "销售金额",data: 'total' ,orderable:true},
              { title: "平均进价",data: 'avgInputPrice' },
              { title: "总成本",data: 'totalCost' },
              { title: "库存",data: 'inventory' },
              { title: "时间",data: 'createDate' },
          ],columnDefs:[
              {
                  targets:[2,3,4,5],
                  render:function(data, type, full){
                      return Number(data).toFixed(2);
                  }
              }

          ],"order": [
              [3, "desc"]
          ]
      });
  }

var showItemsMonthData = function(){
      var table = $('#item_month');

      table.dataTable({
          "ordering": true,
          searching:true,
          autoWidth:false,
          language: {
              aria: {
                  sortAscending: ": activate to sort column ascending",
                  sortDescending: ": activate to sort column descending"
              },
              emptyTable: "无记录",
              info: "显示 _START_ 到 _END_ 总 _TOTAL_ 记录",
              infoEmpty: "没有找到记录",
              infoFiltered: "(从 _MAX_ 条记录过滤)",
              lengthMenu: "每页 _MENU_ 条记录",
              search: "搜索:",
              zeroRecords: "未找到匹配记录",
              paginate: {
                  previous: "上一页",
                  next: "下一页",
                  last: "尾页",
                  first: "首页"
              }
          },destroy:true
          ,data: $scope.reportItemMonthData,columns: [
              { title: "名称",data: 'itemName',"width": "20%" },
              { title: "销售数量",data: 'totalNum' },
              { title: "销售均价",data: 'avgPrice' },
              { title: "销售金额",data: 'total' ,orderable:true},
              { title: "平均进价",data: 'avgInputPrice' },
              { title: "总成本",data: 'totalCost' },
              { title: "库存",data: 'inventory' },
              { title: "时间",data: 'createDate' },
          ],columnDefs:[
              {
                  targets:[2,3,4,5],
                  render:function(data, type, full){
                      return Number(data).toFixed(2);
                  }
              }

          ],"order": [
              [3, "desc"]
          ]
      });
  }

  var initItemsData = function(company, year,month, day){
    $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/item/day?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {
        $scope.reportItemData = data.data;
        showItemsData();
    });
  }

  var initItemsMonthData = function(company, year,month){
    $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/item/month?year="+year+"&month="+month).success(function (data, status, headers, config) {
        $scope.reportItemMonthData = data.data;
        showItemsMonthData();
    });
  }

  var initReport=function(month, day){
      $scope.changeCompany()
  }

  var daysNumOfMonth = function(){
    var days = ['-'];
    var date = new Date();

    if ($scope.currentMonth != $scope.selectMonth){
      date = new Date(date.getYear(), $scope.selectMonth, 0)
    }

    console.log('daysNumOfMonth', date);

    for (var i = 1; i < date.getDate() + 1; i++)
      days.push(i);
    return days;
  }

  $scope.currentDay = '-';
  $scope.currentYear = new Date().getFullYear();
  $scope.selectYear = $scope.currentYear;
  $scope.currentMonth = new Date().getMonth() + 1;
  $scope.selectMonth = $scope.currentMonth;
  $scope.compays = [{'label':'亦庄','value':'bj'}, {'label':'廊坊','value':'lf'}];
  $scope.currentCompany = $scope.compays[0];
  $scope.reportItemData = [];
  $scope.reportItemMonthData = [];

  $scope.maxDays=daysNumOfMonth();

  $scope.changeCompany=function(){
      $scope.reportItemData = [];

      //person
      $scope.legend = [];
      $scope.data = [];
      $scope.allTotal = 0;

      //action
      $scope.paiLegend = [];
      $scope.paidData = [];
      $scope.paidAllTotal = 0;

      //register
      $scope.registerRecordLegend = [];
      $scope.registerRecordData = [];
      $scope.registerRecordAllTotal = 0;
      $scope.registerRecordCount = 0;

      //gest vip
      $scope.gestCount = 0;
      $scope.vipCount = 0;
      $scope.vipMoneyTotal = 0;
      $scope.inputMoneyTotal = 0;
      $scope.outputMoneyTotal = 0;

      // foster
      $scope.fosterMoneyTotal=0;
      $scope.fosterCount=0;

      if ($scope.currentCompany.value === '-'){
          // $scope.compays.forEach(function (c) {
          //     if (c.value != '-'){
          //         initItemsData(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          //     }
          // });
      }else{
          initItemsData($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          initItemsMonthData($scope.currentCompany, $scope.selectYear,$scope.selectMonth)
      }
  }

  $scope.changeMonth = function(){
    initReport($scope.selectYear,$scope.selectMonth,$scope.currentDay);
    $scope.maxDays=daysNumOfMonth();
  }

  $scope.changeYear = function(){
    initReport($scope.selectYear,$scope.selectYear,$scope.selectMonth,$scope.currentDay);
    $scope.maxDays=daysNumOfMonth();
  }

  $scope.selectDay=function(){
    console.log($scope.currentDay);
    initReport($scope.selectYear,$scope.selectMonth,$scope.currentDay);
  }

  initReport($scope.selectYear,$scope.selectMonth,$scope.currentDay);
});
