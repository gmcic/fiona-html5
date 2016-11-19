angular.module('fiona.services', [])
.filter("dropdown", function () {
    return function (name, comboxs) {

        var value = "";

        if (name == true || name == value || !!name) {
            angular.forEach(comboxs, function (combox) {
                if(combox.id == name || combox.dictDetailCode == name)
                {
                    value = combox.valueNameCn;
                }
            });
        }

        return value;
    };
}).factory('commons', function() {

    function formatnumber(num) {
        if(num <= 9)
        {
            return "0" + num
        }

        return num;
    };
    return {
        setAuthorization: function (auth) {
            // console.log( "保存用户凭证" + auth );

            authorization = auth;
        },
        serialNumber: function () {
            var date = new Date();

            // date.getMilliseconds();

            return date.getFullYear() + "" + formatnumber(date.getMonth() + 1) + "" + formatnumber(date.getDate()) + "" + formatnumber(date.getHours()) + "" + formatnumber(date.getMinutes()) + "" + formatnumber(date.getSeconds());
        },
        getAuthorization : function () {
            // console.log( "当前用户凭证: " + authorization );
//            return  'fc5db3b3-4063-4a12-a511-880ba19e4b58';
            return sessionStorage.getItem("authorization");
        },
        getBusinessHostname : function () {
            return "http://127.0.0.1:8080/business";
        },
        getAccountHostname : function () {
            return "http://127.0.0.1:8080/account";
        },
        modaldanger: function (alert_id, msg) {
            App.alert({
                container: "#" + alert_id + "_alert",
                place: "append",
                type: "danger",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });
        },
        modalsuccess: function (alert_id, msg) {
            App.alert({
                container: "#" + alert_id + "_alert",
                place: "append",
                type: "success",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });
        },
        success: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "success",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "check"
            });
        },
        danger: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "danger",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });
        },
        warning: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "warning",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "warning"
            });
        },
        info: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "info",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "info"
            });
        }
    };
});