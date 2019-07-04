
(function (window, document) {
    /*function car_info(json){
        //console.log(json)
        if(json.head.status.code == 200){
            var info = json.body;
            //console.log(info)
            //设置弹出框内容，可以HTML自定义 //<p><span>型号：</span><span>${info.model_number}</span></p>
            $('#popup-content').append(`<p><span>车辆：</span><span>${info.plate_number}</span></p>
                                            <p><span>部门：</span><span>${info.department.identity_name}</span></p>
                                            
                                            <p><span>时间：</span><span>${info.gather_time}</span></p>
                                            <p><span>当前速度：</span><span>${info.velocity}km/h</span></p>
                                            <p><span>总里程：</span><span>${info.total_mileage}km&nbsp;,</span>&nbsp;&nbsp;<span>当日里程：</span><span>${info.daily_mileage}km</span></p>
                                            <p><span>经纬度：</span><span class="info_xy"></span></p>
                                            <p><span>状态：</span><span>${info.state==1?'空闲':info.state==2?'忙碌':'离线'}</span></p>`)
        }else{
            $('#popup-content').html('暂无数据')
            /!*new $Msg({
                content:json.head.status.message,
                type:"success",
            })*!/
        }

    }

    function car_info_xy(json) {

        if(json.head.status.code == 200){
            //console.log(json.body)
            var info = json.body;
            $('#popup-content .info_xy').text(`${info[0].data[0].values.longitude}, ${info[0].data[0].values.latitude}`)
        }else{
            //$('#popup-content').html('暂无数据')
        }
    }*/

    function car_info(json){

        if(json.head.status.code == 200){
            var info = json.body;

            $('#popup-content .plate_number').text(info.plate_number)
            $('#popup-content .identity_name').text(info.department.identity_name)
            $('#popup-content .gather_time').text(info.gather_time)
            $('#popup-content .velocity').text(`${info.velocity}km/h`)
            $('#popup-content .total_mileage').text(`${info.total_mileage}km,`)
            $('#popup-content .daily_mileage').text(`${info.daily_mileage}km`)
            $('#popup-content .state').text(`${info.state==1?'空闲':info.state==2?'忙碌':'离线'}`)

        }else{
            $('#popup-content').html('暂无数据')
        }

    }

    function car_info_xy(json) {

        if(json.head.status.code == 200){
            //console.log(json.body)
            var info = json.body;
            $('#popup-content .quality').text(info[0].data[0].values.quality)
            $('#popup-content .info_xy').text(`${info[0].data[0].values.longitude}, ${info[0].data[0].values.latitude}`)
        }else{
            //$('#popup-content').html('暂无数据')
        }
    }
    window.car_info = car_info
    window.car_info_xy = car_info_xy
})(window, document)