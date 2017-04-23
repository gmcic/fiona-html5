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
  var initReport=function(month, day){
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/item?month="+month+"&day=" + day).success(function (data, status, headers, config) {
      // $scope.items = data.data;
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
        ,data: data.data,columns: [
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
    });

    // 查询模板明细
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/person?month="+month+"&day=" + day).success(function (data, status, headers, config) {
      $scope.legend = [];
      $scope.data = [];
      $scope.allTotal = 0;
      // 遍历保存所有子项
      angular.forEach(data.data, function (item) {
        var total = Number(item.total).toFixed(2);
        $scope.allTotal += Number(total);
        console.log(item);
        var name = item.name + "(" + item.type + ")" + "[" + total + "]";

        $scope.legend[$scope.legend.length] = name;
        $scope.data[$scope.data.length] = {value:total, name:name};
      });

      $scope.allTotal = Number($scope.allTotal).toFixed(2);

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
    });


  // 查询模板明细
  $http.get(commons.getBusinessHostname() + "/api/v2/reports/gest/paid/action?month="+month+"&day=" + day).success(function (data, status, headers, config) {
      $scope.paiLegend = [];
      $scope.paidData = [];
      $scope.paidAllTotal = 0;
      // 遍历保存所有子项
      angular.forEach(data.data, function (item) {
        var total = Number(item[0]).toFixed(2);
        $scope.paidAllTotal += Number(total);
        console.log(item);
        var name = item[1] ;

        $scope.paiLegend[$scope.paiLegend.length] = name;
        $scope.paidData[$scope.paidData.length] = {value:total, name:name};
      });

      $scope.paidAllTotal = Number($scope.paidAllTotal).toFixed(2);

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
    });

    // 查询模板明细-挂号
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/medic/register/record?month="+month+"&day=" + day).success(function (data, status, headers, config) {
        $scope.registerRecordLegend = [];
        $scope.registerRecordData = [];
        $scope.registerRecordAllTotal = 0;
        $scope.registerRecordCount = 0;
        // 遍历保存所有子项
        angular.forEach(data.data, function (item) {
          var total = Number(item[0]).toFixed(2);
          $scope.registerRecordAllTotal += Number(total);
          $scope.registerRecordCount += item[2];
          console.log(item);
          var name = item[1]+"("+item[2]+")" ;

          $scope.registerRecordLegend[$scope.registerRecordLegend.length] = name;
          $scope.registerRecordData[$scope.registerRecordData.length] = {value:total, name:name};
        });

        $scope.registerRecordAllTotal = Number($scope.registerRecordAllTotal).toFixed(2);

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
      });

      // 查询模板明细-挂号
      $http.get(commons.getBusinessHostname() + "/api/v2/reports/gest/vip?month="+month+"&day=" + day).success(function (data, status, headers, config) {
          $scope.gestCount = 0;
          $scope.vipCount = 0;
          $scope.vipMoneyTotal = 0;
          $scope.inputMoneyTotal = 0;
          $scope.outputMoneyTotal = 0;

          if (data.data){
            $scope.gestCount=data.data.gestCount;
            $scope.vipCount=data.data.vipCount
            $scope.vipMoneyTotal=data.data.vipMoneyTotal
            $scope.inputMoneyTotal=data.data.inputMoneyTotal
            $scope.outputMoneyTotal=-data.data.outputMoneyTotal
          }

        });
  }

  var daysNumOfMonth = function(){
    var days = ['-'];
    var date = new Date();
    date.setMonth($scope.selectMonth);
    if ($scope.currentMonth != $scope.selectMonth){
      date.setDate(0);
    }

    for (var i = 1; i < date.getDate() + 1; i++)
      days.push(i);
    return days;
  }

  $scope.currentDay = '-';
  $scope.currentMonth = new Date().getMonth() + 1;
  $scope.selectMonth = $scope.currentMonth;
  $scope.maxDays=daysNumOfMonth();


  $scope.changeMonth = function(){
    initReport($scope.selectMonth,$scope.currentDay);
    $scope.maxDays=daysNumOfMonth();
  }

  $scope.selectDay=function(){
    console.log($scope.currentDay);
    initReport($scope.selectMonth,$scope.currentDay);
  }

  initReport($scope.selectMonth,$scope.currentDay);
});
