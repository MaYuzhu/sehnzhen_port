/**
 * ajax 请求封装
 * @param type  请求类型
 * @param url   请求路径
 * @param data  请求参数
 * @param succFunc 成功回调
 * @param errFunc  失败回调
 * @returns
 */

function getAjaxRequest(type, url, data, succFunc, errFunc){
    data ? data['_v_time'] = new Date().getTime() : data = {'_v_time':new Date().getTime()}   //兼容IE cookies 失效的问题
	$.ajax({
	    type: type,
	    url: url,
	    data: data,
	    dataType: 'json',
	    xhrFields:{
	        withCredentials:true
	    },
	    traditional: true,
	    crossDomain: true,
	    cache:true,
	    async: true,
	    success: function (json) {
	    	succFunc(json);
	    },
	    error: errFunc
	})
}

//有时候需要同步请求
function getAsyncAjaxRequest(type, url, data, async, succFunc, errFunc){
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: 'json',
        xhrFields:{
            withCredentials:true
        },
        traditional: true,
        crossDomain: true,
        cache:true,
        async: async,
        success: function (json) {
            succFunc(json);
        },
        error: errFunc
    })
}

/**
 * 
 * @param features 几何数据集
 * @param vdata 传感器数据
 * @param fid feature编号
 * @returns
 */
function insertMapPoint(features, vdata, fid ){

	var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(vdata.longitude),Number(vdata.latitude)]))
        //geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(117.78341435166347),Number(38.98634291683676)]))
    });
    var feature1 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(vdata.longitude),Number(vdata.latitude)]))
        //geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(117.78341435166347),Number(38.98634291683676)]))
    });
    //console.log(vdata.direction)
    feature.setId(fid);
    feature.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon({
                rotation: Math.PI/180 * Number(vdata.direction), //vdata.direction
                color: "white",
                src: '/img/icon/1.png',
                //scale:0.15
            }),
        })
    );
    features.push(feature);
    getAsyncAjaxRequest("GET", interface_url+"vehicle/get", {'vehicleId':fid}, false, getCarPoint, null)
    function getCarPoint(json, features, vdata) {
        var carName = json.body.plate_number
        feature1.setStyle(
            new ol.style.Style({
                /*image:new ol.style.Icon({
                    //rotation: Math.PI/180 * Number(vdata.direction), //vdata.direction
                    color: "white",
                    src:'/img/icon/1.png',
                    //scale:0.15
                }),*/

                text: new ol.style.Text({
                    font: 'Normal ' + 24 + 'px ',
                    //text: json.body.plate_number,
                    text: carName,
                    fill: new ol.style.Fill({ color: '#efff55'}),
                    stroke: new ol.style.Stroke({color: 'black', width: 3}),
                    textBaseline: 'bottom',
                    offsetY:-14
                })
            })
        )

        //features.push(feature);
    }
    features.push(feature1);
}

/**
 * map定位
 * @param lon 经度
 * @param lat 纬度
 * @returns
 */

// 坐标转换：var pos = ol.proj.transform([113.87346268, 22.48496128], 'EPSG:4326', 'EPSG:3857');
function setMapView(lon, lat){
	/*var duration = 2000   openlayers3 适用
	var start = new Date()
	var pan = ol.animation.pan({
        duration:duration,
		source:view.getCenter(),
		start:start
	})*/

	/*var ctPoint = new ol.View({
        //center: ol.proj.transform([lon, lat],'EPSG:4326', 'EPSG:3857'),
        //center: [lon, lat],
        zoom: 15
    });
    ctPoint.animate({duration:2000},{center: ol.proj.transform([lon, lat],'EPSG:4326', 'EPSG:3857')});
    map.setView(ctPoint);*/ //ok的 没有动画效果
}
//向左移动地图
function moveTo(lon, lat) {//普通平移，我设置的lonlat值是0.06,具体lonlat值需要自己配置
    var view = map.getView();
    view.animate({
        center: ol.proj.transform([lon, lat],'EPSG:4326', 'EPSG:3857'),
        duration: 500
    })
}
function zoomIn() {
    var view = map.getView();
    view.animate({
        zoom: view.getZoom() + 1,
        duration: 250
    })
}

