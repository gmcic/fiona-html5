// 宠物管理
angular.module('fiona').controller('AmchartController', function ($scope, $http, commons) {
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
      var table = $('#sample_2');

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
  var initItemsData = function(company, year,month, day){
    $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/item?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {
        if ($scope.reportItemData.length === 0){
            $scope.reportItemData = data.data;
        }else{
            $scope.reportItemData = $scope.reportItemData.concat(data.data);
        }
        showItemsData();
    });
  }

  var showPerson = function(){
      // 基于准备好的dom，初始化echarts图表
      var pie = echarts.init(document.getElementById('pie'));

      // 为echarts对象加载数据
      pie.setOption({
          title : {
              text: '销售统计',
              subtext: '月销售',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient : 'vertical',
              x : 'left',
              data:$scope.legend
          },
          toolbox: {
              show : false,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel'],
                      option: {
                          funnel: {
                              x: '25%',
                              width: '50%',
                              funnelAlign: 'left',
                              max: 1548
                          }
                      }
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : [
              {
                  name:'销量统计',
                  type:'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:$scope.data
              }
          ]
      });
  }

  var initPersonData = function(company, year,month, day){
      $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/person?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {
          // 遍历保存所有子项
          angular.forEach(data.data, function (item) {
              var total = Number(item.total).toFixed(2);
              $scope.allTotal += Number(total);
              console.log(item);
              var name = item.name + "(" + item.type + ")" + "[" + total + "]";

              $scope.legend[$scope.legend.length] = name;
              $scope.data[$scope.data.length] = {value:total, name:name};
          });

          $scope.allTotal = Number(Number($scope.allTotal).toFixed(2));

          console.log('$scope.allTotal', $scope.allTotal)

          showPerson();
      });
  }

  var showAction = function(){
      // 基于准备好的dom，初始化echarts图表
      var paidDiv = echarts.init(document.getElementById('paidDiv'));

      // 为echarts对象加载数据
      paidDiv.setOption({
          title : {
              text: '支付统计',
              subtext: '',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient : 'vertical',
              x : 'left',
              data:$scope.paiLegend
          },
          toolbox: {
              show : false,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel'],
                      option: {
                          funnel: {
                              x: '25%',
                              width: '50%',
                              funnelAlign: 'left',
                              max: 1548
                          }
                      }
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : [
              {
                  name:'支付统计',
                  type:'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:$scope.paidData
              }
          ]
      });
  }

  var initReportAction = function(company, year,month, day){
      // 查询模板明细
      $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/gest/paid/action?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {
          // 遍历保存所有子项
          angular.forEach(data.data, function (item) {
              var total = Number(item[0]).toFixed(2);
              $scope.paidAllTotal += Number(total);
              console.log(item);
              var name = item[1];

              $scope.paiLegend[$scope.paiLegend.length] = company.label + ':' + name;
              $scope.paidData[$scope.paidData.length] = {value: total, name: company.label + ':' + name};
          });

          $scope.paidAllTotal = Number(Number($scope.paidAllTotal).toFixed(2));

          showAction();

      });
  }

  var shoRegister = function () {
      // 基于准备好的dom，初始化echarts图表
      var registerRecordPie = echarts.init(document.getElementById('RegisterRecordPie'));

      // 为echarts对象加载数据
      registerRecordPie.setOption({
          title : {
              text: '挂号统计('+$scope.registerRecordCount + ")",
              subtext: '',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient : 'vertical',
              x : 'left',
              data:$scope.registerRecordLegend
          },
          toolbox: {
              show : false,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel'],
                      option: {
                          funnel: {
                              x: '25%',
                              width: '50%',
                              funnelAlign: 'left',
                              max: 1548
                          }
                      }
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : [
              {
                  name:'挂号统计',
                  type:'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:$scope.registerRecordData
              }
          ]
      });
  }

  var initReportRegister = function (company, year,month, day) {
      // 查询模板明细-挂号
      $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/medic/register/record?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {

          // 遍历保存所有子项
          angular.forEach(data.data, function (item) {
              var total = Number(Number(item[0]).toFixed(2));
              $scope.registerRecordAllTotal += Number(total);
              $scope.registerRecordCount += item[2];
              console.log(item);
              var name = item[1] + "(" + item[2] + ")";

              $scope.registerRecordLegend[$scope.registerRecordLegend.length] = name;
              $scope.registerRecordData[$scope.registerRecordData.length] = {value: total, name: name};
          });

          $scope.registerRecordAllTotal = Number(Number($scope.registerRecordAllTotal).toFixed(2));

          shoRegister();
      });
  }

  var initReportTotal = function (company, year,month, day) {
      // 查询模板明细-挂号
      $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/gest/vip?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {


          if (data.data){
              $scope.gestCount+=Number(data.data.gestCount);
              $scope.vipCount+=Number(data.data.vipCount)
              $scope.vipMoneyTotal+=Number(data.data.vipMoneyTotal)
              $scope.inputMoneyTotal+=Number(data.data.inputMoneyTotal)
              $scope.outputMoneyTotal+=-Number(data.data.outputMoneyTotal)
          }

      });

      //寄养押金
      $http.get(commons.getBusinessHostnameByCompany(company) + "/api/v2/reports/foster?year="+year+"&month="+month+"&day=" + day).success(function (data, status, headers, config) {

          if (data.data){
              $scope.fosterMoneyTotal+=Number(data.data.fosterMoneyTotal);
              $scope.fosterCount+=Number(data.data.fosterCount);
          }
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
  $scope.compays = [{'label':'-','value':'-'}, {'label':'亦庄','value':'bj'}, {'label':'廊坊','value':'lf'}];
  $scope.currentCompany = $scope.compays[0];
  $scope.reportItemData = [];

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
          $scope.compays.forEach(function (c) {
              if (c.value != '-'){
                  initItemsData(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
                  initPersonData(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
                  initReportAction(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
                  initReportRegister(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
                  initReportTotal(c, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
              }
          });
      }else{
          initItemsData($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          initPersonData($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          initReportAction($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          initReportRegister($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
          initReportTotal($scope.currentCompany, $scope.selectYear,$scope.selectMonth,$scope.currentDay)
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
