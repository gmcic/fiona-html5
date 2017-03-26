// 宠物管理
angular.module('fiona').controller('AmchartController', function ($scope, $http, commons) {
  var initReport=function(month){
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/item?month="+month).success(function (data, status, headers, config) {
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
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/person?month="+month).success(function (data, status, headers, config) {
      $scope.legend = [];
      $scope.data = [];
      // 遍历保存所有子项
      angular.forEach(data.data, function (item) {
        console.log(item);
        var name = item.name + "(" + item.type + ")" + "[" + item.total + "]";

        $scope.legend[$scope.legend.length] = name;
        $scope.data[$scope.data.length] = {value:item.total, name:name};
      });

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
  }

  $scope.currentMonth = new Date().getMonth() + 1;

  $scope.changeMonth = function(month){
    $scope.currentMonth = month;
    initReport($scope.currentMonth);
  }

  initReport($scope.currentMonth);
});