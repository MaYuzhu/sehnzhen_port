
$(function () {
    laydate.render({
        elem: '#add_in_time'
        , type: 'datetime'
    })
    laydate.render({
        elem: '#edit_in_time'
        , type: 'datetime'
    })

    //添加车辆拖动
    function _move(dom,e) {
        dom.css("cursor","move");//改变鼠标指针的形状
        e.preventDefault()
        var offset = dom.offset();//DIV在页面的位置
        var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
        var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
        $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
            dom.stop();//加上这个之后

            var _x = ev.pageX - x;//获得X轴方向移动的值
            var _y = ev.pageY - y;//获得Y轴方向移动的值
            if(_x<0){
                _x = 0
            }else if(_x > $(document).width() - (dom.width() + 4)){
                _x = $(document).width() - (dom.width() + 4)
            }
            if(_y<0){
                _y = 0
            }else if(_y > $(document).height() - (dom.height() + 4)){
                _y = $(document).height() - (dom.height() + 4)
            }
            dom.animate({left:_x+"px",top:_y+"px"},5);
        });
    }
    $('.show').mousedown(function (e) {
        _move($('.show'),e)
    })
    $('.show_01').mousedown(function (e) {
        _move($('.show_01'),e)
    })
    $(document).mouseup(function(){
        //$(".show").css("cursor","default");
        $(".show").css("cursor","move");
        $(".show1").css("cursor","move");
        $(this).unbind("mousemove");
    });
    //输入框可以拖动选择内容
    $(".show input,.show select,.show textarea").mousedown(function(event){
        event.stopPropagation();
    });
    //添加按钮
    $('.add_vehicle').on('click',function () {
        //增加车辆弹窗需要的部门列表
        getAjaxRequest("GET",interface_url+'department/search',null,car_departmentList,errorFunc);
        $('.show').css('display','block');
        $('input').val('');
        $('h6').text('');
    })
    //取消
    $('.add_car_quxiao').on('click',function () {
        $('.show').css('display','none')
    })
    $('.update_car_cancel').on('click',function () {
        $('.show_01').css('display','none')
    })
    $('.edit_car_quxiao').on('click',function () {
        $('.show_01').css('display','none')
    });

    //出厂时间
    laydate.render({
        elem: '#chuchang_time'
    });

    let pageNumber = 1;//当前页数
    let pageCount;//总页数
    let pageSize = 8; //每页显示条数

    getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);

    //点击上一页
    $('.trailer_footer>:nth-child(1)').on('click',function () {
        if(pageNumber>1){
            pageNumber--;
            getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
            $('.trailer_footer>:nth-child(2)').addClass('trailer_on').removeClass('trailer_on_not');
        }
        if(pageNumber==1){
            $('.trailer_footer>:nth-child(1)').removeClass('trailer_on').addClass('trailer_on_not');

        }
    });

    //点击下一页
    $('.trailer_footer>:nth-child(2)').on('click',function () {
        if(pageNumber<pageCount){
            pageNumber++;
            getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
            $('.trailer_footer>:nth-child(1)').addClass('trailer_on').removeClass('trailer_on_not');
        }
        if(pageNumber==pageCount){
            $('.trailer_footer>:nth-child(2)').removeClass('trailer_on').addClass('trailer_on_not');

        }
        if(pageCount==1){
            $('.trailer_footer>:nth-child(2)').removeClass('trailer_on').addClass('trailer_on_not');
        }
    });

    //车辆数据
    function getVehicleList(json){
        //console.log(json);
        if(json.head.status.code == 200){
            pageCount = json.body.pages;
            if(pageCount==1){
                $('.trailer_footer>:nth-child(2)').removeClass('trailer_on').addClass('trailer_on_not')
            }
            $('.vehicleList').html(`<tr>
                <th style="width:41px;">
                        <label for="checkItems">
                            <input style="margin-top:4px;margin-left:-17px;display:none;"  type="checkbox" name="checkItems" id="checkItems" value="" >
                            <span style="cursor: pointer">全选</span>
                        </label>
                </th>
                <th>序号</th>
                <th>车辆编号</th>
                <!--<th>品牌型号</th>-->
                <th>车载设备</th>
                <!--<th>设备编号</th>-->
                <th>车辆状态</th>
                <th>单位部门</th>
                <th>联系人</th>
                <th>权限</th>
                <th>出厂时间</th>
                <th>操作</th>
            </tr>`);
                let vehicleList = json.body.list;
                for(let i=0;i<vehicleList.length;i++){
                    $('.vehicleList').append(`<tr>
                <!--<td>${vehicleList[i].vehicle_id}</td>-->
                <td>
                    <input style="margin-top:1px;" value=${json.body.results[i].vehicle_id} id="" type="checkbox" name="items" class="ccc"/>
                </td>
                <td>${i+1+(json.body.number-1)*(json.body.size)}</td>
                <td>${vehicleList[i].plate_number}</td>
                <!--<td>-</td>-->
                <td>-</td>
                <!--<td>-</td>-->
                <td>${vehicleList[i].state==2?'忙碌':vehicleList[i].state==1?'空闲':'离线'}</td>
                <td>XXX</td>
                <td>未知</td>
                <td class="quan_xian_01" id="quan_xian_${i+1}">启用中</td>
                <td>2018年07月</td>
                <td>
                    <a  class="edit_car" value=${json.body.results[i].vehicle_id}>修改</a>
                    <!--<a  class="jinyong_car">禁用</a>-->
                    <!--<a  class="qiyong_car">启用</a>-->
                    <a  class="delete_car" value=${json.body.results[i].vehicle_id}>删除</a>
                </td>
            </tr>`)

                    var disable_01 = json.body.list[i].disable;
                    // console.log(disable_01);
                    if(disable_01==0){
                        $(`#quan_xian_${i+1}`).html("启用中");
                    }else{
                        $(`#quan_xian_${i+1}`).html("已禁用").css('color','#e4393c');

                    }

                }
            //全选
            document.getElementById('checkItems').onclick=function()
            {
                // 获取所有的复选框
                var checkElements=document.getElementsByName('items');
                if (this.checked) {
                    for(var i=0;i<checkElements.length;i++){
                        var checkElement=checkElements[i];
                        checkElement.checked="checked";
                    }
                }
                else{
                    for(var i=0;i<checkElements.length;i++){
                        var checkElement=checkElements[i];
                        checkElement.checked=null;
                    }
                }
            };
            //修改弹出
            $('.edit_car').on('click',function () {
                $('.show_01').css('display','block');
                //修改车辆弹窗需要的部门列表
                getAjaxRequest("GET",interface_url+'department/search',null,car_departmentList_edit,errorFunc);
                $('input').val('');
                $('h6').text('');
                vehicle_echo =$(this).attr("value");

                getAjaxRequest("GET",interface_url+'vehicle/get',{vehicleId:vehicle_echo},carEcho,errorFunc);
                function carEcho(json) {
                    $('.show_01 input[name="carEcho_numberPlate"]').val(json.body.plate_number);
                    $('.show_01 input[name="travel_time"]').val(json.body.travel_time);
                    $(`#edit_car_select1 option[value=${json.body.state}]`).prop("selected",true);
                    $(`#edit_car_select2 option[value=${json.body.disable}]`).prop("selected",true);
                    $(`#select2 option[value=${json.body.department.department_id}]`).prop("selected",true);
                }
            });
            //删除
            $(".delete_car").on('click',function(){
                /*var r = confirm("确定删除此车辆？");
                if (r == true){
                    let deleteCar_id = $(this).attr('value');
                    getAjaxRequest("POST", interface_url+'vehicle/remove', {vehiclesId:deleteCar_id}, delCarFunc, errorFunc)
                    function delCarFunc(json) {
                        if(json.head.status.code == 200){
                            alert('删除成功！')
                            getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
                        }else {
                            alert(json.head.status.message)
                        }
                    }
                }*/
                new $Msg({
                    content:"确定删除此车辆？",
                    type:"success",
                    cancle:function(){},
                    confirm:()=>{
                        let deleteCar_id = $(this).attr('value');
                        getAjaxRequest("POST", interface_url+'vehicle/remove', {vehiclesId:deleteCar_id}, delCarFunc, errorFunc)
                        function delCarFunc(json) {
                            if(json.head.status.code == 200){
                                new $Msg({
                                    content:"删除成功！",
                                    type:"success",
                                })
                                getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
                            }else {
                                new $Msg({
                                    content:json.head.status.message,
                                    type:"success",
                                })
                            }
                        }
                    }
                })
            });
        }

    }
    //启用
    $('.car_start_using').on('click',function (qiyong_id) {

        var qiyong_id = [];

        $.each($('.ccc:checked'),function () {
            qiyong_id.push($(this).val());
        });

        if(qiyong_id.length<1){
            new $Msg({
                content:"您未勾选，请勾选！",
                type:"success",
            })
            return;
        }else{
            new $Msg({
                content:"确认要启用吗？",
                type:"success",
                cancle:function(){},
                confirm:function(){
                        getAjaxRequest("POST", interface_url+"vehicle/disable", {vehiclesId:qiyong_id,
                            disable:0}, startCar, errorFunc)
                        function startCar(json){
                            if (json.head.status.code == 200) {
                                getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
                            } else {
                                new $Msg({
                                    content:json.head.status.message,
                                    type:"success",
                                })
                            }
                        }
                }
            })
        }

    });
    //禁用
    $('.car_forbid').on('click',function (jinyong_id) {
        var jinyong_id = [];
        $.each($('.ccc:checked'),function () {
            jinyong_id.push($(this).val());
        });
        if(jinyong_id.length<1){
            new $Msg({
                content:"您未勾选，请勾选！",
                type:"success",
            })
            return;
        }else{
            new $Msg({
                content:"确认要禁用吗？",
                type:"success",
                cancle:function(){},
                confirm:function(){
                    getAjaxRequest("POST", interface_url+"vehicle/disable", {vehiclesId:jinyong_id,
                        disable:1}, endUser, errorFunc)
                    function endUser(json){
                        if (json.head.status.code == 200) {
                            getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
                        } else {
                            new $Msg({
                                content:json.head.status.message,
                                type:"success",
                            })
                        }
                    }
                }
            })
        }
    });

    //部门数据
    function car_departmentList(json) {
        // console.log(json);
        $('#select1').html('');
        for(let i = 0;i<json.body.results.length;i++){
            $('#select1').append(`
                                <option value="${json.body.results[i].department_id}" class="add_option_department">
                                    ${json.body.results[i].identity_name}
                                </option>
                                `);
        }
    }
    function car_departmentList_edit(json) {
        // console.log(json);
        $('#select2').html('');
        for(let i = 0;i<json.body.results.length;i++){
            $('#select2').append(`
                                <option value="${json.body.results[i].department_id}" class="add_option_department">
                                    ${json.body.results[i].identity_name}
                                </option>
                                `);
        }
    }

    //新增
      //校验
      function isLicensePlate(licence) {
        let lic = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
        return lic.test(licence);
    }
      $("input[name='add_numberPlate']").blur(function () {
        let licence = $("input[name='add_numberPlate']").val()
        if ($.trim(licence) == '') {
            $('.add_truck_licence + h6').text('请填写车牌号')
            return false
        }
        else {
            if (isLicensePlate(licence) == false) {
                $('.add_truck_licence + h6').text('请输入正确的车牌号')
                return false
            }else {
                $('.add_truck_licence + h6').text('')
            }
        }
      });
      $("input[name='add_numberPlate']").change(function () {
        let recarData = {plateNumber:$("input[name='add_numberPlate']").val()}
        getAjaxRequest("GET", interface_url+"vehicle/search", recarData, renameCar, errorFunc)
        function renameCar(json){
            if(json.head.status.code==200){
                if(json.body.list.length==1){
                    $('.add_truck_licence + h6').text('该车辆已存在')
                }else {
                    $('.add_truck_licence + h6').text('')
                }

            }
        }
    });
      //提交
      $('.add_car_commit').on('click',function(){
        let addcarData = {};
        //车辆编号
        addcarData.plateNumber = $("input[name='add_numberPlate']").val();
        //部门ID
        addcarData.departmentId = $('.add_option_department').val();
        if(!addcarData.plateNumber){
            // $('.add_truck_licence + h6').text("请填写车牌号");
            new $Msg({
                content:"请填写车牌号",
                type:"success",
            })
            return
        }
        var h6_add_car = $('.show h6').text();
        if(h6_add_car=='') {
            getAjaxRequest("POST", interface_url + "vehicle/add", addcarData, addCar, errorFunc);
            function addCar(json) {
                if (json.head.status.code == 200) {
                    new $Msg({
                        content:"新增车辆成功！",
                        type:"success",
                    })
                    $('.show').css('display','none');
                    getAjaxRequest("GET", interface_url + 'vehicle/search', {'page.number': pageNumber, 'page.size': pageSize}, getVehicleList, errorFunc);
                } else {
                    new $Msg({
                        content:"添加失败，" + json.head.status.message,
                        type:"success",
                    })
                }
            }
        }else{
            return false
        }
    });
    //修改
      //校验
      $("input[name='carEcho_numberPlate']").blur(function () {
        amend_licence = $("input[name='carEcho_numberPlate']").val()
        if ($.trim(amend_licence) == '') {
            $('.amend_truck_licence + h6').text('请填写车牌号')
            return false
        }
        else {
            if (isLicensePlate(amend_licence) == false) {
                $('.amend_truck_licence + h6').text('请输入正确的车牌号')
                return false
            }else {
                $('.amend_truck_licence + h6').text('')
            }
        }
    });
      $("input[name='carEcho_numberPlate']").change(function () {
        let amend_recarData = {plateNumber:$("input[name='carEcho_numberPlate']").val()}
        getAjaxRequest("GET", interface_url+"vehicle/search", amend_recarData, renameCar, errorFunc)
        function renameCar(json){
            if(json.head.status.code==200){
                if(json.body.list.length==1){
                    $('.amend_truck_licence + h6').text('该车辆已存在')
                }else {
                    $('.amend_truck_licence + h6').text('')
                }

            }
        }
      });
      //通过回显拿到修改
      let vehicle_echo;
      let amend_licence;
      //提交
      $('.update_car_commit').on('click',function(){
        let updateCarData = {};
        //车辆ID
        updateCarData.vehicleId=vehicle_echo;
        //车辆编号
        updateCarData.plateNumber=$("input[name='carEcho_numberPlate']").val();
        updateCarData.disable=$('#edit_car_select2').val();
        updateCarData.departmentId=$('#select2').val();
        // updateCarData.state=$('#edit_car_select1').val();车辆状态

        if(!updateCarData.plateNumber){
            $('.amend_truck_licence + h6').text("请填写车牌号");
            return
        }
        if (isLicensePlate(amend_licence) == false) {
            $('.amend_truck_licence + h6').text('请输入正确的车牌号。')
            return
        }
        var h6_amend_car = $('.show_01 h6').text();
        if(h6_amend_car==''){
            //修改车辆弹窗需要的部门列表
            getAjaxRequest("GET",interface_url+'department/search',null,car_departmentList_edit,errorFunc);
            getAjaxRequest("POST", interface_url+'vehicle/edit', updateCarData, editCarFunc, errorFunc)
            function editCarFunc(json){
                // console.log(json);
                if(json.head.status.code == 200){
                    new $Msg({
                        content:"修改成功！",
                        type:"success",
                    })
                    $('.show_01').css('display','none')
                    getAsyncAjaxRequest("GET", interface_url+'vehicle/search', {'page.number':pageNumber,'page.size':pageSize}, false, getVehicleList, errorFunc);
                }else {
                    new $Msg({
                        content:`修改失败！${json.head.status.message}`,
                        type:"success",
                    })
                }
            }
        }else{
            return false
        }
      });
    //所有请求失败的回调
    function errorFunc() {
        alert("请求失败,请检查您的网络是否通畅...")
    }
});