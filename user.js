/**
 * url处理
 * 1 queryParams url参数
 * 2 encode 编码
 * 3 decode 解码
 *  全局对象 window.tp.url
 */
!(function () {
    var url = {
        version: '1.0.5'
    };

    function str2asc(strstr) {
        return ("0" + strstr.charCodeAt(0).toString(16)).slice(-2);
    }

    function asc2str(ascasc) {
        return String.fromCharCode(ascasc);
    }

    //url参数获取
    url.queryParams = function (uri) {
        var regExp = /(?:\?|&)?(\w+)=([^&=]*)/gi;
        var url = (uri && uri.split('#')[0]) || window.location.href.split('#')[0];
        var result, params = {};
        while ((result = regExp.exec(url)) !== null) {
            params[result[1]] = this.decode(decodeURI(result[2]));
        }
        return params;
    };

    /**
     * url编码
     */
    url.encode = function (str) {
        var ret = "";
        var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
        var tt = "";

        for (var i = 0; i < str.length; i++) {
            var chr = str.charAt(i);
            var c = str2asc(chr);
            tt += chr + ":" + c + "n";
            if (parseInt("0x" + c) > 0x7f) {
                ret += "%" + c.slice(0, 2) + "%" + c.slice(-2);
            } else {
                if (chr == " ")
                    ret += "+";
                else if (strSpecial.indexOf(chr) != -1)
                    ret += "%" + c.toString(16);
                else
                    ret += chr;
            }
        }
        return ret;
    };

    /**
     * url解码
     */
    url.decode = function (str) {
        var ret = "";
        for (var i = 0; i < str.length; i++) {
            var chr = str.charAt(i);
            if (chr == "+") {
                ret += " ";
            } else if (chr == "%") {
                var asc = str.substring(i + 1, i + 3);
                if (parseInt("0x" + asc) > 0x7f) {
                    ret += asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
                    i += 5;
                } else {
                    ret += asc2str(parseInt("0x" + asc));
                    i += 2;
                }
            } else {
                ret += chr;
            }
        }
        return ret;
    };

    "function" == typeof define ? define(function () {
        return url
    }) : "undefined" != typeof exports ? module.exports = url : (window.tp = window.tp || {}, window.tp['url'] = url);
})();

function placeholder() {
    if (!placeholderSupport()) {   // 判断浏览器是否支持 placeholder
        console.log("placeholder");
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).each(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        });
    }
}

function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}


//点击协议弹出协议内容弹框
function pop_proto(url){

    console.log(url.indexOf("proto1.html")>0?"用户注册协议":"用户隐私协议");
     layer.open({
        type: 2,
        skin: 'layui-layer-rokid',
        title: url.indexOf("proto1.html")>0?"用户注册协议":"用户隐私协议",
        scrollbar: false,
        move: false,
        area: ['80%'], //宽高
        content: url,
        success: function () {
        }
    });
}
//$.ajaxSetup({
//    xhrFields: {withCredentials: true},
//    crossDomain: true
//});
var user = {
    layer: null,
    vip_code: (function () {
        return $.cookie('SP_user_token');
    })(),
    islogin: function () {
        return $.cookie('SP_user_token') !="" && $.cookie('SP_user_token') ? true : false;
    },
    login: function () {
        layer.close(user.layer);
        //$("input").blur();
        user.layer = layer.open({
            type: 1,
            skin: 'layui-layer-rokid',
            title: "登录",
            scrollbar: false,
            move: false,
            area: ['440px'], //宽高
            content: window.rokidTpls.user.login,
            success: function () {
                var loadmark;
                $(".login form").Validform({
                    tiptype: function (msg, o, cssctl) {
                        if (!o.obj.is("form")) {//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                            var objtip = o.obj.next(".Validform_checktip");
                            cssctl(objtip, o.type);
                            cssctl(o.obj.parents(".box-info"), o.type);
                            objtip.show().text(msg);
                            if (o.type == 2 || o.type == 4) {
                                objtip.hide();
                            }
                        }

                    },
                    ajaxPost: true,
                    beforeSubmit: function () {
                        loadmark = layer.load(3);
                    },
                    error: function (data, obj) {

                        layer.alert('<p class="layer_t1">服务器繁忙</p><p class="layer_icon"><i class="layer_ico ico2"></i></p>', {
                            area: ['440px'],
                            title: '',
                            skin: 'layui-layer-rokid'
                        }, function (index) {
                            layer.close(index);
                            layer.close(user.layer);
                        });
                        return false;

                    },
                    callback: function (res) {
                        layer.close(loadmark);
                        if (res.ret != 200) {
                            layer.alert('<p class="layer_t1">' + res.msg + '</p><p class="layer_icon"><i class="layer_ico ico2"></i></p>', {
                                area: ['440px'],
                                title: '',
                                skin: 'layui-layer-rokid'
                            });
                            return false;
                        }
						$.removeCookie("SP_user_token");
						$.cookie('SP_user_token',res.data.token,{"domain":res.data.domain,path:"/"});
                        $.cookie('SP_user_info', JSON.stringify(res.data),{"domain":res.data.domain,path:"/"});

                        layer.close(user.layer);
						var show_tip = false;
						if(show_tip){
							layer.alert('<p class="layer_t1">登录成功</p><p class="layer_icon"><i class="layer_ico ico1"></i></p>', {
								area: ['440px'],
								closeBtn: 0,
								title: '',
								skin: 'layui-layer-rokid'
							}, function (index) {
								layer.close(index);

								if (helper) {
									var params = helper.url.queryParams();
									if (params.redirect_url) {
										location.href = params.redirect_url;
										return;
									}
								}
								user.setinfo();

								//$.cookie('SP_user_info', JSON.stringify(res.data),{"domain":res.data.domain});
								try {
									if(typeof(res.data.msgcount) != 'undefined' && res.data.msgcount > 0){
										$("#msgcount").show();
										$("#msgcount").html(res.data.msgcount);
									}
									if(res.data.headimgurl != '' && typeof(res.data.headimgurl) != 'undefined'){
										$("#user_headimgurl").attr('src',res.data.headimgurl);
									}
									if ($('#TakeMeHome').data("isclick")) {
										$('#TakeMeHome').click();
									}
								} catch (e) {
								}
							});
						}
						else{
							location.reload();
						}
                    }
                });
                placeholder();
            }
            //scrollbar: true
        });
		user.layer_fix(user.layer,440,440);
    },
    code: {
        interval: null,
        timer: 0,
        sendedtypes: {
            password: false
        },
        get: function (type) {

            if (user.code.timer == 0) {
                var tel = $("[name='tel']").val();
                if (!helper.ismobile(tel)) {
                    layer.alert('手机号码填写错误', {area: ['440px'], icon: 0, title: '', skin: 'layui-layer-rokid'});
                    return false;
                }
                var timeout = function () {
                    user.code.interval = window.setInterval(function () {
                        $(".timeout").text("重新发送(" + (60 - user.code.timer++) + ")");
                        if (user.code.timer == 60) {
                            window.clearInterval(user.code.interval);
                            $(".btn-code").removeClass("hide");
                            $(".timeout").addClass("hide");
                            user.code.timer = 0;
                        }
                    }, 1000);
                };
                var prompt;
                var yes = function (value, index, prompt) {
                    //console.log(value, index, prompt);
                    if (type)user.code.sendedtypes[type] = true;
                    $.ajax({
                        url: user_url+'/ajax/getcode',
                        type: "post",
                        data: {
                            tel: tel,
                            code: value
                        },
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (res) {
                            if (res.ret == 200) {
                                $(".timeout").removeClass("hide").text("重新发送(60)");
                                $(".btn-code").addClass("hide");
                                timeout();
                                layer.close(index);
                                return;

                            }


                            layer.alert(res.msg, {area: ['440px'], icon: 2, title: '', skin: 'layui-layer-rokid'});
                        }
                    });
                };
                layer.open({
                    btn: ['确定', '取消'],
                    content: '<div class="layui-code"><img src="'+user_url+'/code" alt="点击刷新" title="点击刷新" width="100" onclick="this.src=\''+user_url+'/code?t=\'+Math.random();"/><input type="text" class="layui-layer-code" value="" placeholder="请输入验证码" maxlength="4"></div>',
                    skin: 'layui-layer-rokid',
                    title: '请输入验证码',
                    scrollbar: false,
                    move: false,
                    success: function (layero) {
                        prompt = layero.find('.layui-layer-code');
                        prompt.focus();
                    },
                    yes: function (index) {
                        var value = prompt.val();
                        if (value === '') {
                            prompt.focus();
                        } else if (value.length != 4) {
                            layer.tips('验证码必须为4位', prompt, {tips: 1});
                        } else {
                            yes && yes(value, index, prompt);
                        }
                    }
                });
            }

        }
    },
    register: function () {
        layer.close(user.layer);
        user.layer = layer.open({
            type: 1,
            skin: 'layui-layer-rokid',
            title: "注册",
            scrollbar: false,
            move: false,
            area: ['440px'], //宽高
            content: window.rokidTpls.user.register,
            success: function () {
                $(".register form").Validform({
                    tiptype: function (msg, o, cssctl) {
                        if (!o.obj.is("form")) {//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                            var objtip = o.obj.next(".Validform_checktip");
                            cssctl(objtip, o.type);
                            objtip.show().text(msg);
                            cssctl(o.obj.parents(".box-info"), o.type);
                            if (o.type == 2 || o.type == 4) {
                                objtip.hide();
                            }
                        }

                    },
                    ajaxPost: true,
                    beforeSubmit: function (curform) {
                        if (!user.code.sendedtypes.register) {
                            layer.alert("请先获取验证码", {area: ['440px'], icon: 2, title: '', skin: 'layui-layer-rokid'});
                            return false;
                        }
                        if(!$("input.agreement").is(':checked')){
                            layer.alert("必须同意用户注册协议", {area: ['440px'], icon: 2, title: '', skin: 'layui-layer-rokid'});
                            return false;
                        }
                    },
                    callback: function (res) {
                        if (res.ret != 200) {
                            layer.alert('<p class="layer_t1">' + res.msg + '</p><p class="layer_icon"><i class="layer_ico ico2"></i></p>', {
                                area: ['440px'],
                                title: '',
                                skin: 'layui-layer-rokid'
                            });
                            return false;
                        }
                        $.removeCookie("SP_user_token");
                        $.cookie('SP_user_token',res.data.token,{"domain":res.data.domain,path:"/"});
                        $.cookie('SP_user_info', JSON.stringify(res.data),{"domain":res.data.domain,path:"/"});
                        user.setinfo();

                        layer.alert('<p class="layer_t1">注册成功</p><p class="layer_icon"><i class="layer_ico ico1"></i></p>', {
                            area: ['440px'],
                            closeBtn: 0,
                            title: '',
                            skin: 'layui-layer-rokid'
                        }, function (index) {
                            layer.closeAll();
                            
                        });
                        //console.log(res);
                    }
                });
                placeholder();
            }
        });
		user.layer_fix(user.layer,440,460);
    },

    getpassword: function () {
        layer.close(user.layer);
        user.layer = layer.open({
            type: 1,
            skin: 'layui-layer-rokid',
            title: '找回密码',
            scrollbar: false,
            move: false,
            area: ['440px'], //宽高
            content: window.rokidTpls.user.getpassword1,
            success: function () {
                $(".password form").Validform({
                    tiptype: function (msg, o, cssctl) {
                        if (!o.obj.is("form")) {//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                            var objtip = o.obj.next(".Validform_checktip");
                            cssctl(objtip, o.type);
                            objtip.show().text(msg);
                            cssctl(o.obj.parents(".box-info"), o.type);
                            if (o.type == 2 || o.type == 4) {
                                objtip.hide();
                            }
                        }

                    },
                    ajaxPost: true,
                    callback: function (res) {
                        if (res.ret != 200) {

                            layer.alert(res.msg, {area: ['440px'], title: '', skin: 'layui-layer-rokid'});
                            return false;
                        }
                        layer.alert('<p class="layer_t1">重置密码成功</p><p class="layer_icon"><i class="layer_ico ico1"></i></p>', {
                            area: ['440px'],
                            closeBtn: 0,
                            title: '',
                            skin: 'layui-layer-rokid'
                        }, function (index) {
                            layer.close(index);
                            user.login();
                        });

                        //console.log(res);
                    }
                });
                placeholder();
            }
        });
    },
    getpassword2: function (obj) {
        if(!$(".password form").Validform().check(false,'[name=tel]')){
            return false;
        }
        if (user.code.sendedtypes.password) {
            if(!$(".password form").Validform().check(false,'[name=code]')){
                return false;
            }
            $(".box-info.password").removeClass("hide");
            $(obj).addClass("hide").next().removeClass("hide");

            $(".layui-layer").animate({
                "top":"-=50px"
            });

            $(".layui-layer-content").height(400);
        } else {



            layer.alert('<p class="layer_t1">请先获取验证码</p><p class="layer_icon"><i class="layer_ico ico2"></i></p>', {
                area: ['440px'],
                title: '',
                skin: 'layui-layer-rokid'
            });




        }

    },

    setinfo: function () {
        var islogin=user.islogin();
        $("#loginbox").html(window.rokidTpls.user.islogin[islogin ? "yes"  : "no"]);
        if(islogin){
            //console.log($.cookie('SP_user_info'));
            if($.cookie('SP_user_info')){
                var user_info= $.parseJSON($.cookie('SP_user_info'));
                //console.log(user_info);
                $("#loginbox a.people-group span").text(user_info.nick);
                $("#user_headimgurl").attr('src',user_info.headimgurl.replace('http://','https://'));
            }

            $("#bar_notlogin").addClass("hide");
            $("#bar_logined").removeClass("hide");
        }else{
            $("#bar_notlogin").removeClass("hide");
            $("#bar_logined").addClass("hide");
        }



    },
    logout: function () {
        layer.confirm('<p class="layer_t1">确定要退出登录码？</p><p class="layer_icon"><i class="layer_ico ico3"></i></p>', {
            area: ['440px'],
            title: '',
            closeBtn: 0,
            skin: 'layui-layer-rokid'
        }, function (index) {
            layer.close(index);
            $.removeCookie("SP_user_token");
            location.href = user_url + "/logout";
        });
    },
	layer_fix: function(index,width,height){
		//修正safari浏览器弹框
		var left = ($(window).width() - width ) /2;
		var top = ($(window).height() - height ) /2;
		layer.style(index, {
		  left: left + 'px',
		  top: top + 'px'
		}); 
	}
};


function get_msg_count() {
	if(! user.islogin() )return;

	$.ajax({
		url:user_url + "/ajax/msgcount",
		dataType:"json",
		type:'POST',
		data:'r='+Math.random(),
		xhrFields: {withCredentials: true},
        crossDomain: true,
        beforeSend: function () {},
        complete: function () {},
		success: function(result){
			$('#msgcount').hide(); 
			if(result.ret == 200 && result.data > 0){
				$('#msgcount').show();
				$('#msgcount').html(result.data);
			}
		}
	});
}

$(function () {
    //var islogin=user.islogin();
    //$("#loginbox").html(window.rokidTpls.user.islogin[islogin ? "yes" : "no"]);
    //if(islogin){
    //    var user_info= $.parseJSON($.cookie('SP_user_info'));
    //    console.log(user_info);
    //    $("#loginbox a.people-group span").text(user_info.nick);
    //    $("#user_headimgurl").attr('src',user_info.headimgurl);
    //}
    user.setinfo();
    //var ismoblie = ("ontouchstart" in window);
    //$("#loginbox").html(window.rokidTpls.user.islogin[islogin ? "yes" + (ismoblie ? "_m" : "") : "no"]);

    var w=$(window).width();
    $(window).on('resize', function () {
        w=$(window).width();
    });

        $("#loginBtn")
            .on("click", function () {
                if(w>900){
                    user.login();
                    return false;
                }

            });
        $("#registerBtn").on("click", function () {
            if(w>900){
            user.register();
            return false;
            }
        });

    //$('#TakeMeHome').on("click", function () {
    //    $(this).data("isclick", true);
    //
    //    if (!user.islogin()) {
    //        user.login();
    //
    //    } else {
    //        couponCtl.get();
    //    }
    //});
    $('#UserBtn').on("click", function () {
        if (!user.islogin()) {
            user.login();
        } else {
            location.href = user_url+"/"
        }
    });


	setInterval(get_msg_count,60*1000);

    var params=tp.url.queryParams();

    if(params.hmsr)$.cookie('SP_hmsr',params.hmsr,{"domain":"rokid.com","path":"/","expires":365});
    if(params.hmpl)$.cookie('SP_hmpl',params.hmpl,{"domain":"rokid.com","path":"/","expires":365});
    if(params.mcu)$.cookie('SP_mcu',params.mcu,{"domain":"rokid.com","path":"/","expires":365});
    if(params.hmkw)$.cookie('SP_hmkw',params.hmkw,{"domain":"rokid.com","path":"/","expires":365});
    if(params.hmci)$.cookie('SP_hmci',params.hmci,{"domain":"rokid.com","path":"/","expires":365});
	/*
    if (location.href.indexOf("/user") >= 0) {
        $(".header-right-list li:first").removeClass("now-index").children("span").hide();
        $(".header-right-list li:last").addClass("now-index");
    }else if(location.href.indexOf("/addpro") >= 0){
        $(".header-right-list li").removeClass("now-index").children("span").hide();
    }else{
        $(".header-right-list li:last").removeClass("now-index").children("span").hide();
    }*/

});
