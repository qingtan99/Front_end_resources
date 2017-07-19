$(function() {

    //定义vm
    var vm = {};

    //全局变量
    var GLOBAL = {
        HISTORY_ARR: ['index'],
        PAGES: {},
        LONGITUDE:'', //经度
        LATITUDE:'' //纬度
    };

    //数据接口
    var dao = {

        //获取请假信息
        getSubmitInfo: function(param) {
            return dkr.util.ajaxPost('../json/index.json', param)
        },

        getData: function(param) {
            return dkr.util.ajaxPost('../json/demo.json', param)
        },

        getScheduleData:function(param) {
            return dkr.util.ajaxPost('../json/schendule.json', param)
        },

        getJournalData:function(param) {
            return dkr.util.ajaxPost('../json/journal.json', param)
        },

        getMailListDataInfo:function(param) {
            return dkr.util.ajaxPost('../json/mail.json', param)
        },

        getProjectDataInfo:function(param) {
            return dkr.util.ajaxPost('../json/project.json', param)
        }

    }

    //请假校验规则
    var valid = {

        //请假类型
        formSelect: {
            require: true,
            emptyTip: "请选择请假类型"
        },

        //开始时间
        startTime: {
            require: true,
            emptyTip: "请选择开始时间"
        },

        //结束时间
        endTime: {
            require: true,
            emptyTip: "请选择结束时间"
        },

        //请假天数
        dayNum: {
            require: true,
            emptyTip: "请输入请假天数",
            pattern: '^[0-9]*[1-9][0-9]*$'
        },

        //请假事由
        formReason: {
            require: true,
            emptyTip: "请输入请假原因",
            pattern: '[\u4e00-\u9fa5]'　
        },
        formAgree: {
            require: true,
            emptyTip: "请输入不同意原因",
            pattern: '[\u4e00-\u9fa5]'　
        }
    };

    //日志校验规则
    var journalValid = {
        //日期
        workTime:{
            require: true,
            emptyTip: "请选择日期"
        },
        //关联人
        gllName:{
            require: true,
            emptyTip: "请选择关联人"
        },
        //完成内容
        work:{
            require: true,
            emptyTip: "请填写完成的内容"
        },
        //遇到问题
        question:{
            require: true,
            emptyTip: "请填写遇到的问题"
        },
        //解决方法
        solve:{
            require: true,
            emptyTip: "请填写解决方法"
        },
        //明日计划
        tomorrowWork:{
            require:true,
            emptyTip:"请填写明日计划"
        }
    };

    //项目新增编辑验证规则
    projectValid = {
        projectName:{
            require:true,
            emptyTip:'请输入项目名称'
        },
        bzry:{
            require:true,
            emptyTip:'请输入标准人月'
        },
        yybzry:{
            require:true,
            emptyTip:'请输入已使用的标准人月'
        }
    };

    //统计图表配置项
    options = {
        title: {
            text: '请假统计'
        },
        chart: {
            type: 'bar',
            animation: {
                duration: 2000
            }
        },
        xAxis: {
            categories: ['12', '12', '12', '12', '12'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '请假次数',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },

            ceiling: 100, //最大上限
        },
        tooltip: {
            valueSuffix: '次'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Year 2008',
            data: []
        }],
        lang: {
            noData: "没有数据" //真正显示的文本
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#000'
            }
        }
    };

    //事件绑定
    vm.addEVent = function() {
        $('body')
            .on('tap','.leave,.person',vm.eventController.dropLeave) //子页面的list
            .on('tap', '.page-handle', vm.eventController.pageHandle) //保存页面状态
            .on('tap', '.back', vm.eventController.pageBack) //返回键
            .on('tap', '.want-leave',vm.eventController.getLeaveInfoList) //加载请假列表信息
            .on('click', '.ask-leave', vm.eventController.askLeave) //我要请假
            .on('click', '.submit-leave', vm.eventController.formSubmit) //申请人请假提交
            .on('tap','.approval',vm.eventController.approval) //审批列表
            .on('tap','.leave-approval',vm.eventController.leaveApproval) //请假审批
            .on('click', '.submit-approva', vm.eventController.formAgainSubmit) //审批提交
            .on('change', 'input[type="date"]', vm.eventController.endTimeChange) //时间换算天数
            .on('tap', '.btn_fath', vm.eventController.switchToggle) //同意或者不同意 or 公开或者私密
            .on('click', '.leave-tj', vm.eventController.leaveTj) //请假统计
            .on('change', '.query-condition-dept', vm.eventController.deptChange) //部门改变查询
            .on('change', '.query-condition-time', vm.eventController.timeChange) //时间改变查询

            .on('tap','.attendant', vm.eventController.attendanceRecode) //考勤
            .on('tap','.on-duty', vm.eventController.onDutyAttendance) //上下班考勤
            .on('tap','.go-out', vm.eventController.goOutAttendance) //外出考勤
            .on('tap','.attendance-statistics', vm.eventController.attendanceStatistics) //考勤统计
            .on('click','input[name="visitPoint"]',vm.eventController.showHidePoint) //显示隐藏考勤点

            .on('swipeleft','.list_address li,.schedule-list-ul li,.journal-list li,.pro', vm.eventController.LiSwipeLeft) //左滑
            .on('swiperight','.list_address li,.schedule-list-ul li,.journal-list li,.pro', vm.eventController.LiSwipeRight) //右滑
            .on('tap','.check-detail',vm.eventController.leaveListSingleInfoCheckDetail) //请假列表中某一条数据

            .on('tap','.day-schedule',vm.eventController.getSchedule) //获取日程信息
            .on('click','.add-schedule',vm.eventController.addSchedule) //添加新的日程
            .on('tap','.schedule-edit',vm.eventController.scheduleEdit) //日程编辑
            .on('tap','.schedule-del',vm.eventController.scheduleDelete) //日程删除

            .on('tap','.journal-search-btn',vm.eventController.journalSearch) //日志搜索
            .on('tap','.work-journal',vm.eventController.workJournal) //工作日志
            .on('click','.add-journal',vm.eventController.addJournal) //新增日志
            .on('tap','.journal-operate',vm.eventController.journalOperateInfo) //日志操作（详情查看，编辑，删除）
            .on('click','.journal-save',vm.eventController.journalSave) //日志保存

            .on('tap','.achievements',vm.eventController.achievement) //绩效考核
            .on('tap','.assessment',vm.eventController.assessmentList) //考核导航栏事件
            .on('tap','.button',vm.eventController.setGrade) //打分
            .on('click','.grade-submit',vm.eventController.gradeSubmit) //提交打分项

            .on('tap','.mail-list',vm.eventController.mailListInfo) //通讯录
            .on('tap','.mail-list-forward',vm.eventController.mailListSingleInfomation) //某一个部门的数据
            .on('tap','.mail-detail',vm.eventController.getDetailMailInfo) //获取某一个人的详细信息

            .on('tap','.qcode',vm.eventController.qMaxCode) //二维码名片模板
            .on('click','.person-qcode',vm.eventController.personQcode) //生成二维码名片

            .on('tap','.project',vm.eventController.project) //项目成本管理
            .on('click','.add-project',vm.eventController.addProject) //增加项目
            .on('click','.project-submit',vm.eventController.projectSubmit) //提交项目
            .on('tap','.pro-edit',vm.eventController.projectEdit) //项目编辑
            .on('tap','.pro-del',vm.eventController.projectDel) //项目编辑

        GLOBAL.PAGES = {
            index: vm.eventController.getIndex,
            leave: vm.eventController.askLeave,
            wantLeave:vm.eventController.getLeaveInfoList,
            leaveStatistics:vm.eventController.leaveTj,
            achieve:vm.eventController.achievement,
            checkDetail:vm.eventController.leaveListSingleInfoCheckDetail,
            addSchedule:vm.eventController.addSchedule,
            daySchedule:vm.eventController.getSchedule,
            scheduleEdit:vm.eventController.scheduleEdit,
            workJournal:vm.eventController.workJournal,
            addJournal:vm.eventController.addJournal,
            mailListInfo:vm.eventController.mailListInfo,
            detailMailInfo:vm.eventController.getDetailMailInfo,
            attendance:vm.eventController.attendanceRecode,
            qcodeInfo:vm.eventController.qMaxCode,
            approval:vm.eventController.approval,
            leaveApproval:vm.eventController.leaveApproval,
            project:vm.eventController.project,
            projectEdit:vm.eventController.projectEdit
        }
    };

    //事件处理
    vm.eventController = {

        /**
         * [dropLeave 首页个人中心和请假一级菜单]
         * @return {[type]} [description]
         */
        dropLeave:function() {
            if($(this).hasClass('person')) {
                $(this).toggleClass('drop').siblings('.person-list').slideToggle('fast');
            }else {
                $(this).toggleClass('drop').siblings('.leave-list').slideToggle('fast');
            }
        },

        //加载首页信息
        getIndex: function() {
            
            //渲染首页模板
            vm.eventController.requestTpl($('.container'), '' , $('#menuList'));
        },

        //页面头部元素的显示和隐藏
        headNavHideShow: function(tip) {
            $('header').addClass('hide').siblings('.head').removeClass('hide');
            $('.head').find('span').text(tip);
        },

        /**
         * [pageHeadElementShowHide 页面状态返回，头部元素显示隐藏]
         * @return {[type]} [description]
         */
        pageHeadElementShowHide: function() {
            if (GLOBAL.HISTORY_ARR.length > 1) {
                vm.eventController.headNavHideShow();
            } else {
                $('.head').addClass('hide').siblings('header').removeClass('hide');
            }
        },

        /**
         * [pageHandle 页面状态处理,保存页面状态]
         * @return {[type]} [description]
         */
        pageHandle: function() {
            var $this = $(this),
                $page = $this.data('page');

            //历史纪录保留
            GLOBAL.HISTORY_ARR.push($page);

            //执行头部元素的显示隐藏
            vm.eventController.pageHeadElementShowHide();
        },

        /**
         * [pageBack 返回记录的上一个状态]
         * @return {[type]} [description]
         */
        pageBack: function() {

            //获取历史纪录长度
            var len = GLOBAL.HISTORY_ARR.length;
            if (len >= 2) {
                GLOBAL.HISTORY_ARR.pop();
                var $target = GLOBAL.HISTORY_ARR[len - 2],
                    backFun;

                //执行头部元素的显示隐藏
                vm.eventController.pageHeadElementShowHide();

                backFun = GLOBAL.PAGES[$target];

                //执行返回函数
                backFun();
            }
        },

        /**
         * [requestTpl description]
         * @param  {[type]} $textId    [模板添加的父元素]
         * @param  {[type]} $data      [数据]
         * @param  {[type]} $currentId [当前模板]
         * @return {[type]}            [description]
         */
        requestTpl: function($textId, $data, $currentId) {
            var request = doT.template($currentId.text());
            $textId.html('').append(request($data));
        },

        /**
         * [getInputAreaText 获取表单的中需要输入的值] 
         * @return {[type]} [description]
         */
        getInputAreaText: function() {
            var $input = $('input,select,textarea'),
                param = {};
            for (var i = 0; i < $input.length; i++) {
                param[$input.eq(i).attr('name')] = $input.eq(i).val();
            }

            return param;
        },

        /**
         * [LiSwipeLeft 左滑]
         */
        LiSwipeLeft:function() {
            $(this).animate({marginLeft:'-10rem'});
            if($(this).find('.check-detail').length > 0) {
                $(this).find('.check-detail').animate({right:'0rem'}); 
            }else if($(this).find('.leave-approval').length > 0) {
                $(this).find('.leave-approval').animate({right:'0rem'});
            }else if($(this).find('.pro-edit').length > 0){
                $(this).find('.pro-edit').animate({right:'4.5rem'}); 
                $(this).find('.pro-del').animate({right:'0rem'}); 
            }else if($(this).find('.schedule-edit').length > 0){
                $(this).find('.schedule-edit').animate({right:'9rem'}); 
                $(this).find('.schedule-del').animate({right:'4.5rem'}); 
                $(this).find('.schedule-close').animate({right:'0rem'}); 
            }else {
                $(this).find('.journal-detail').animate({right:'9rem'}); 
                $(this).find('.journal-edit').animate({right:'4.5rem'}); 
                $(this).find('.journal-del').animate({right:'0rem'}); 
            }
        },

        /**
         * [deptChange 改变部门查询]
         * @return {[type]} [description]
         */
        deptChange: function() {
            var charts;
            //highchart配置项
            charts = Highcharts.chart('content', options);

            // //请求json数据
            dao.getData().done(function(res) {
                // console.log(chart);
                charts.series[0].setData(res.param);
            })
        },

        /**
         * [timeChange 改变月份查询]
         * @return {[type]} [description]
         */
        timeChange: function() {
            var charts;
            //highchart配置项
            charts = Highcharts.chart('content', options);

            //请求json数据
            dao.getData().done(function(res) {
                // console.log(chart);
                charts.series[0].setData(res.result);
            })
        },

        //加载下拉框数据
        loadDropList: function() {

            $.ajax({
                url: '../json/dropload.json',
                type: 'POST',
                dataType: 'json',
            }).done(function(res) {
                var str = '';

                //下拉框数据
                for (var i = 0; i < res.length; i++) {
                    str += '<option value="' + res[i].ID + '" name="' + res[i].NAME + '">' + res[i].text + '</option>'
                }

                $('#dept').append(str);
                $('#month').append(str);
            }).fail(function() {
                console.log("error");
            })
        },


        /**
         * [getLeaveInfoList 加载请假信息列表]
         * @return {[type]} [description]
         */
        getLeaveInfoList:function() {
            dao.getSubmitInfo().done(function(res) {
                var data = res.result;

                //渲染首页模板
                vm.eventController.requestTpl($('.container'), data, $('#formLeaveList'));
                vm.eventController.headNavHideShow('请假列表');
            })
        },

        /**
         * [leaveListSingleInfoCheckDetail 请假详情]
         * @return {[type]} [description]
         */
        leaveListSingleInfoCheckDetail:function() {
            dao.getData({ID:'12312321312'}).done(function(res) {
                var data = res.result2;
                vm.eventController.headNavHideShow('请假详情');
                vm.eventController.requestTpl($('.container'), data, $('#leaveInfoDetail'))
            })
        },

        /**
         * [switchToggle 是否同意申请/是否公开]
         * @return {[type]} [description]
         */
        switchToggle: function() {

            //给按钮添加动画效果
            var ele = $(this).children(".move");
            if (ele.attr("data-state") == "on") {
                ele.animate({
                    left: "0"
                }, 300, function() {

                    //元素添加data-state状态为off
                    ele.attr("data-state", "off");
                    $('.disagree-reason').removeClass('hide');
                });
                $(this).removeClass("on").addClass("off");
            } else if (ele.attr("data-state") == "off") {
                ele.animate({
                    left: '4rem'
                }, 300, function() {

                    //元素添加data-state状态为on
                    $(this).attr("data-state", "on");
                    $('.disagree-reason').addClass('hide');
                });
                $(this).removeClass("off").addClass("on");
            }
        },

        /**
         * [formSubmit 请假提交]
         * @return {[type]} [description]
         */
        formSubmit: function() {
            var param = vm.eventController.getInputAreaText();

            //验证是否成功
            if (dkr.util.valid(param, valid)) {

                //验证开始时间和结束时间是否符合规则
                var end = $('#endTime').val(),
                    start = $('#startTime').val();
                if (end < start) {
                    layer.open({
                        content: '结束时间不能小于开始时间',
                        style: 'background:#f00',
                        skin: 'msg',
                        time: 2
                    })

                    return false;

                } else {
                    dao.getSubmitInfo().done(function(res) {
                        layer.open({
                            content:'成功',
                            style:'background:#009688',
                            skin:'msg',
                            time:1.5
                        });

                        // vm.eventController.pageBack();
                    })
                }

            };
        },

        /**
         * [leaveApproval 请假审批]
         * @return {[type]} [description]
         */
        leaveApproval:function() {
            dao.getSubmitInfo().done(function(res) {

                //模板渲染
                vm.eventController.requestTpl($('.container'), res, $('#formLeave'));

                vm.eventController.headNavHideShow('审批');

                //改变提交状态
                $('.form-submit').removeClass('submit-leave').addClass('submit-approva');

                //数据回显
                for (var key in res.data) {

                    //数据单独处理
                    if (key == 'formSelect') {
                        $('select[name="formSelect"]').val(res.data[key]);
                    } else if (key == 'formReason') {
                        $('textarea[name="formReason"]').val(res.data[key]);
                    } else {

                        //循环处理
                        $('input[name="' + key + '"]').val(res.data[key]);
                    }
                }
            })
        },

        /**
         * [formAgainSubmit 审批提交]
         * @return {[type]} [description]
         */
        formAgainSubmit: function() {
            var param = vm.eventController.getInputAreaText();

            //处理不存在的文本域验证问题
            if ($('.disagree-reason').hasClass('hide')) {
                valid.formAgree.require = false;
            } else {
                valid.formAgree.require = true;
            }
 
            //验证是否成功
            if (dkr.util.valid(param, valid)) {

                alert('1111');
            }
        },

        /**
         * [leaveTj 请假统计]
         * @return {[type]} [description]
         */
        leaveTj: function(num) {
            var charts;

            var tpl = doT.template($('#DataStatistics').text());
            

            if(num == 2) {
                $('.achieve-content').html('').append(tpl);
                vm.eventController.headNavHideShow('考核统计');
                
            }else {
                $('.container').html('').append(tpl);
                vm.eventController.headNavHideShow('请假统计');
            }
            //highchart配置项
            charts = Highcharts.chart('content', options);

            //请求json数据
            dao.getData().done(function(res) {
                // console.log(chart);
                charts.series[0].setData(res.data1);
                var title = {
                    text:"考核统计"
                };
                charts.setTitle(title);
                options.yAxis.title.text='考核次数';
            })

            //执行下拉框函数
            vm.eventController.loadDropList();
        },

        /**
         * [attendanceRecode 渲染考勤模板]
         * @return {[type]} [description]
         */
        attendanceRecode:function() {
            //加载头部信息
            vm.eventController.headNavHideShow('考勤');

            vm.eventController.requestTpl($('.container'),'',$('#checkAttendance'));

            vm.eventController.onDutyAttendance();

            $('.on-duty').addClass('bg-blue');
        },

        /**
         * [scheduleDelete 日程删除]
         * @return {[type]} [description]
         */
        scheduleDelete:function(event) {
            // confirm('你确定要删除吗');
            alert();
            layer.open({
                content: '你确定要删除吗',
                btn: ['确定', '取消'],
                yes: function(index){
                  layer.close(index);
                }
            });

            // event.preventDefault();
        },

        /**
         * [achievement 渲染绩效考核导航]
         * @return {[type]} [description]
         */
        achievement:function() {
            vm.eventController.requestTpl($('.container'),'',$('#achieveAssessment'));

            //加载头部信息
            vm.eventController.headNavHideShow('绩效考核');

            //默认加载打分项
            vm.eventController.assessmentList(1);
        },

        /**
         * [assessmentList 绩效考核内容]
         * @param  {[type]} ele [参数]
         * @return {[type]}     [description]
         */
        assessmentList:function(ele) {

            // debugger;
            var $this;

            //赋值
            if(ele == 1) {
                $this = $('.assessment.score');
            }else {
                $this = $(this);
            }
            //当前状态
            $this.addClass('bg-blue').siblings().removeClass('bg-blue');

            //根据不同状态渲染不同模板
            if($this.hasClass('score')) {
                dao.getData().done(function(res) {
                    var data = res.data;
                    vm.eventController.requestTpl($('.achieve-content'),data,$('#achieveList'));
                })
            }else if($this.hasClass('statistics')) {
                vm.eventController.leaveTj(2);
            }else {
                dao.getData().done(function(res) {
                    var data = res.data;
                    vm.eventController.requestTpl($('.achieve-content'),data,$('#assessmentNotice'))
                })
            }
        },

        /**
         * [gradeSubmit 打分提交按钮]
         * @return {[type]} [description]
         */
        gradeSubmit:function() {
            
            //获取打分项数据
            var total = 0,$cur = $('input[type="number"]');

            //循环验证每一项是否符合规定
            for(var i = 0; i < $cur.length; i++){
                if(Number($cur.eq(i).val()) > 13 || Number($cur.eq(i).val()) < 0) {
                    layer.open({
                        content:$cur.eq(i).siblings('.name').text().split('：')[1] + '，存在不正确打分',
                        style:'background:#f00',
                        skin:'msg',
                        time:1.5
                    });
                    return false;
                }else {

                    //计算器
                    total += Number($cur.eq(i).val()); 
                }
            }

            //部门平均分不能大于10分
            if(total / $cur.length <= 10) {
                layer.open({
                    content:'成功',
                    style:'background:#009688',
                    skin:'msg',
                    time:1.5
                });
                $cur.attr('readonly',true).css({"border":"0"});
                $('.grade-submit').addClass('hide');
            }else {
                layer.open({
                    content:'部门平均分不能够大于10分，请核对后再提交',
                    style:'background:#f00',
                    skin:'msg',
                    time:1.5
                });
                return false;
            }
        },

        /**
         * [workJournal 工作日志列表]
         * @return {[type]} [description]
         */
        workJournal:function() {
            vm.eventController.headNavHideShow('工作日志');
            dao.getJournalData().done(function(res) {
                var data = res.result;
                vm.eventController.requestTpl($('.container'),data,$('#journal'));
            });
        },

        /**
         * [journalSave 日志保存]
         * @return {[type]} [description]
         */
        journalSave:function() {
             var param = vm.eventController.getInputAreaText();

             if(dkr.util.valid(param,journalValid)) {
                dao.getData().done(function(res) {
                    layer.open({
                        content:'成功',
                        style:'background:#009688',
                        skin:'msg',
                        time:1.5
                    });
                })
             }
        },

        /**
         * [addJournal 新增/编辑/查看 日志]
         */
        addJournal:function() {
            vm.eventController.headNavHideShow('新增日志');
            vm.eventController.requestTpl($('.container'),'',$('#JournalFormTpl'));
        },

        /**
         * [getJournalDataInfo 数据回显]
         * @param  {[type]} num [参数设置]
         * @return {[type]}     [description]
         */
        getJournalDataInfo:function(num) {
            dao.getJournalData().done(function(res) {

                //模板渲染
                vm.eventController.requestTpl($('.container'),'',$('#JournalFormTpl'));

                //循环回显参数
                for(var key in res.data) {
                    if(key == 'workTime') {
                        $('input[name="workTime"]').val(res.data[key]);
                    }else if(key == 'gllName'){
                        $('select[name="gllName"]').val(res.data[key]);
                    }else if(key == 'isSecret'){

                        //回显按钮秘密or公开
                        if(res.data[key] == true) {
                            $('.journal-switch').find('.move').attr('data-state','on').css({
                                'left':'4rem'
                            }).parent().removeClass('off').addClass('on');
                        }else {
                            $('.journal-switch').find('.move').attr('data-state','off').css({
                                'left':'0'
                            }).parent().removeClass('on').addClass('off');
                        }
                    }else {
                        $('textarea[name="' + key + '"]').val(res.data[key]);
                    }
                }

                //是否查看详情
                if(num == 1) {

                    //设置不可编辑属性
                    $('.journal-form').find('input').attr('readonly',true);
                    $('.journal-form').find('select').attr('disabled',true);

                    for(var i = 0; i < $('.journal-form').find('textarea').length; i++){
                        $('.journal-form').find('textarea').eq(i).attr('readonly',true);
                    }

                    $('.journal-save').addClass('hide');

                    //解除绑定
                    $('body').off('tap','.btn_fath',vm.eventController.switchToggle);
                }else {

                    //重新绑定
                    $('body').on('tap','.btn_fath',vm.eventController.switchToggle);
                }
            });
        },
    };

    //初始化
    vm.init = function() {
        vm.addEVent();

        //默认加载首页面
        vm.eventController.getIndex();
    }

    vm.init();
})
