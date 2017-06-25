// 宠物管理
angular.module('fiona').controller('DoctorController', function ($scope, $http, commons) {
  var initReport=function(month){
    // 医生销售统计
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/doctor?month="+month+"&user=" + $scope.userName).success(function (data, status, headers, config) {
      $scope.legend = [$scope.userName];
      $scope.data = [];
      xAxisData=[];
      $scope.allTotal = 0;
      var i = 0;
      // 遍历保存所有子项
      angular.forEach(data.data[$scope.userName], function (item) {
        var total = Number(item).toFixed(2);
        $scope.allTotal += Number(total);
        xAxisData.push(i+++"日");
      });

      $scope.allTotal = Number($scope.allTotal).toFixed(2);

      // 基于准备好的dom，初始化echarts图表
      var pie = echarts.init(document.getElementById('pie'));

      // 为echarts对象加载数据
      pie.setOption({
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data:$scope.legend
          },
          xAxis: [
              {
                  type: 'category',
                  data: xAxisData,
                  start: 1,
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '元',
                  min: 0,
                  interval: 100,
                  axisLabel: {
                      formatter: '{value} 元'
                  }
              }
          ],
          series: [
              {
                  name:$scope.userName,
                  type:'bar',
                  data:data.data[$scope.userName]
              }
          ]
      });
    });

    // 医生销售统计
    $http.get(commons.getBusinessHostname() + "/api/v2/reports/doctor/inhospital?month="+month+"&user=" + $scope.userName).success(function (data, status, headers, config) {
      let inhospitalLegend = [$scope.userName];
      $scope.inhospitalTotal = 0;
      let xAxisData=[];

      var i = 0;
      // 遍历保存所有子项
      angular.forEach(data.data[$scope.userName], function (item) {
        var total = Number(item).toFixed(2);
        $scope.inhospitalTotal += Number(total);
        xAxisData.push(i+++"日");
      });

      $scope.inhospitalTotal = Number($scope.inhospitalTotal).toFixed(2);

      // 基于准备好的dom，初始化echarts图表
      var inhospital = echarts.init(document.getElementById('inhospital'));

      // 为echarts对象加载数据
      inhospital.setOption({
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data:inhospitalLegend
          },
          xAxis: [
              {
                  type: 'category',
                  data: xAxisData,
                  start: 1,
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '元',
                  min: 0,
                  interval: 100,
                  axisLabel: {
                      formatter: '{value} 元'
                  }
              }
          ],
          series: [
              {
                  name:$scope.userName,
                  type:'bar',
                  data:data.data[$scope.userName]
              }
          ]
      });
    });

  }

  $scope.currentMonth = new Date().getMonth() + 1;
  $scope.selectMonth = $scope.currentMonth;

  $scope.changeMonth = function(){
    initReport($scope.selectMonth);
  }

  $scope.selectDay=function(){
    initReport($scope.selectMonth);
  }

  initReport($scope.selectMonth);
});
