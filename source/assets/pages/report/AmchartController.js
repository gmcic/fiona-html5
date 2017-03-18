// 宠物管理
angular.module('fiona').controller('AmchartController', function ($scope, $http, commons) {


  // 查询模板明细
  $http.get(commons.getBusinessHostname() + "/api/v2/reports/person").success(function (data, status, headers, config) {
    $scope.legend = [];
    $scope.data = [];
    // 遍历保存所有子项
    angular.forEach(data.data, function (item) {
      console.log(item);
      var name = item.name + "(" + item.type + ")";

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
        show : true,
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


});