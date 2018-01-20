var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var TFunc = {
    setCookie: function (name, value, expires, path, domain, secure) {
        var today = new Date();
        today.setTime(today.getTime());
        var expires_date = new Date(today.getTime() + (expires));
        document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "");
    },
    getCookie: function (name) {
        /*var re=new RegExp(Name+"=[^;]+", "i");             if (document.cookie.match(re))                  return decodeURIComponent(document.cookie.match(re)[0].split("=")[1]);              return null;*/
        var start = document.cookie.indexOf(name + "=");
        var len = start + name.length + 1;
        if ((!start) && (name != document.cookie.substring(0, name.length))) {
            return null;
        }
        if (start == -1) return null;
        var end = document.cookie.indexOf(";", len);
        if (end == -1) end = document.cookie.length;
        return unescape(document.cookie.substring(len, end));
    },
    deleteCookie: function (name, path, domain) {
        if (this.getCookie(name))
            document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ";expires=Mon, 11-November-1989 00:00:01 GMT";
    },
    addEvent: function (obj, eventName, func) {
        if (obj.attachEvent) {
            obj.attachEvent("on" + eventName, func);
        }
        else if (obj.addEventListener) {
            obj.addEventListener(eventName, func, true);
        }
        else {
            obj["on" + eventName] = func;
        }
    }
};
function displayBarNotification(n, c, m) {
    var nNote = jQuery("#nNote");
    if (n) {
        nNote.attr('class', '').addClass("nNote " + c).fadeIn().html(m);
        setTimeout(function () {
            nNote.attr('class', '').hide("slow").html("");
        }, 10000);
    } else {
        nNote.attr('class', '').hide("slow").html("");
    }
}
function displayAjaxLoading(n) {
    n ? jQuery(".ajax-loading-block-window").show() : jQuery(".ajax-loading-block-window").hide("slow");
}
function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
}
function getFirefoxVersion() {
    var raw = navigator.userAgent.match(/Firefox\/([0-9]+)/);
    return raw ? parseInt(raw[1], 10) : false;
}
function ReplaceAll(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
}
jQuery(document).ready(function () {
    // Popup
    if(show_popup && TFunc.getCookie('t-popup') !== '1'){
        setTimeout(function (){
            jQuery("#myModal").modal();
            TFunc.setCookie('t-popup', 1, 60 * 60 * 1000 * 24, '/', '', ''); // 24 hours
        }, 2 * 1000); // seconds
    }
    
    jQuery("#nNote").click(function () {
        jQuery(this).hide("slow").html("");
    });
    
    jQuery(document).mouseup(function (e) {
        if (viewport_width < 992) {
            var container = jQuery(".st-container");
            if (container.find('.mobile-header').hasClass('mobile-clicked')) {
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    jQuery('button.left-menu').trigger('click');
                }
            }
        }
    });

    // Expand/Collapse mobile menu
    jQuery(".st-menu .nav li.menu-item-has-children > ul.sub-menu").hide();
    jQuery(".st-menu .nav li.menu-item-has-children.current-menu-item > ul.sub-menu").show();
    jQuery(".st-menu .nav li.menu-item-has-children.current-menu-parent > ul.sub-menu").show();
    jQuery(".st-menu .nav > li.menu-item-has-children").addClass('dropdown');
    jQuery(".st-menu .nav > li.menu-item-has-children.current-menu-item").removeClass('dropdown');
    jQuery(".st-menu .nav > li.menu-item-has-children.current-menu-parent").removeClass('dropdown');
    jQuery(".st-menu .nav > li.menu-item-has-children > a").after('<span class="arrow"></span>');
    jQuery(".st-menu .nav > li.menu-item-has-children").find('span.arrow').click(function () {
        if (!jQuery(this).parent().hasClass('dropdown')) {
            jQuery(this).parent().addClass('dropdown');
            jQuery(this).next().slideUp();
        } else {
            jQuery(this).parent().removeClass('dropdown');
            jQuery(this).next().slideDown();
        }
    });
    
    // Menu mobile
    jQuery('button.left-menu').click(function () {
        var effect = jQuery(this).attr('data-effect');
        if (jQuery(this).parent().parent().hasClass('mobile-clicked')) {
            jQuery('.st-menu').animate({
                width: 0
            }).css({
                display: 'none',
                transform: 'translate(0px, 0px)',
                transition: 'transform 400ms ease 0s'
            });
            jQuery(this).parent().parent().addClass('mobile-unclicked').removeClass('mobile-clicked').css({
                transform: 'translate(0px, 0px)',
                transition: 'transform 400ms ease 0s'
            });
            jQuery(this).parent().parent().parent().removeClass('st-menu-open ' + effect);
            jQuery("#ppo-overlay").hide();
        } else {
            jQuery(this).parent().parent().parent().addClass('st-menu-open ' + effect);
            jQuery('.st-menu').animate({
                width: 270
            }).css({
                display: 'block',
                transform: 'translate(270px, 0px)',
                transition: 'transform 400ms ease 0s'
            });
            jQuery(this).parent().parent().addClass('mobile-clicked').removeClass('mobile-unclicked').css({
                transform: 'translate(270px, 0px)',
                transition: 'transform 400ms ease 0s'
            });
            jQuery("#ppo-overlay").show();
        }
    });
    jQuery("#ppo-overlay").click(function (){
        if (jQuery(".st-container").find('.mobile-header').hasClass('mobile-clicked')) {
            jQuery('button.left-menu').trigger('click');
        }
    });
    if ("ontouchstart" in document.documentElement) {
        var element = document.querySelector('#ppo-overlay');
        var element2 = document.querySelector('.st-menu');
        var hammertime = Hammer(element).on("swipeleft", function (event) {
            jQuery("#ppo-overlay").trigger('click');
        });
        var hammertime2 = Hammer(element2).on("swipeleft", function (event) {
            jQuery("#ppo-overlay").trigger('click');
        });
    }
    jQuery(window).bind('resize', function(){
        jQuery("#ppo-overlay").trigger('click');
    });
    
    jQuery(window).scroll(function (){
        if(jQuery(this).scrollTop() > 200){
            jQuery("#sticky-right .scrollTo").parent().removeClass('transparent');
        } else {
            jQuery("#sticky-right .scrollTo").parent().addClass('transparent');
        }
    });
    
    // Back to top
    jQuery("#sticky-right .scrollTo").click(function () {
        jQuery("html, body").animate({scrollTop: 0}, "slow");
    });
    jQuery("#sticky-right .openPhonePopup").click(function () {
        jQuery("#sticky-right .phonePopup").addClass('open');
    });
    jQuery("#sticky-right .phonePopup .close").click(function () {
        jQuery("#sticky-right .phonePopup").removeClass('open');
    });
    
    // Whois - Modal dialog
    jQuery(document).on("click", ".open-modal", function(e) {
        jQuery("#ppo-overlay").show();
        var id = jQuery(this).data('id');
        e.preventDefault();
        jQuery("#modalResult .modal-body").load(jQuery(this).data("source"), function(response, status, xhr) {
            if (status === "error") {
                console.log("unable to load content : " + xhr.status);
            } else {
                jQuery("#ppo-overlay").hide();
                jQuery("#modalResult").modal("show");
                jQuery('.modal-body').html(response);
            }
        });
    });
    
    jQuery(".domain-checker-box form").submit(function(){
        displayAjaxLoading(true);
        return true;
    });
    
    if(window.location.toString().lastIndexOf('domain/search') !== -1){
        if(viewport_width > 991){
            jQuery('body,html').animate({
                scrollTop: jQuery(".domain-checker-box .form-wrap").offset().top
            }, 400);
        } else {
            jQuery('body,html').animate({
                scrollTop: jQuery(".price-domain-table").offset().top - 50
            }, 400);
        }
    }
    
    // Check domain primary
    if(jQuery(".price-domain-table").length > 0){
        jQuery(".price-domain-table .primary-domain .ajax-loader").each(function(){
            var _tr = jQuery(this);
            var _domain = jQuery(this).data('domain');
            var _tld = jQuery(this).data('tld');
            jQuery.ajax({
                url: siteUrl + "/domain/checkprimary/", type: "GET", dataType: "html", cache: false,
                data: {domain: _domain, tld: _tld},
                success: function (response, textStatus, XMLHttpRequest) {
                    if (response) {
                        _tr.parent().html(response);
                    }
                },
                error: function (MLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });
    }
    
    // Check domain
    if(jQuery(".price-domain-table").length > 0){
        jQuery(".price-domain-table tr.checkdomain").each(function(){
            var _tr = jQuery(this);
            var _domain = jQuery(this).data('domain');
            var _tld = jQuery(this).data('tld');
            jQuery.ajax({
                url: siteUrl + "/domain/check/", type: "GET", dataType: "json", cache: false,
                data: {domain: _domain, tld: _tld},
                success: function (response, textStatus, XMLHttpRequest) {
                    if (response) {
                        _tr.find('.status').html(response.result.status);
                        _tr.find('.button').html(response.result.btn);
                    }
                },
                error: function (MLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });
    }
    
    // Partners
    if(jQuery('.partner .slide-partner-logo .owl-carousel').length > 0){
        jQuery('.partner .slide-partner-logo .owl-carousel').owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            loop: true,
            margin: 15,
            navRewind: false,
            nav: true,
            navText: ['',''],
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                320: {
                    items: 2
                },
                424: {
                    items: 3
                },
                768: {
                    items: 4
                },
                992: {
                    items: 6
                }
            }
        });
    }
    
    // Services
    if(jQuery('.service-backup .owl-carousel, .service-manager-host .owl-carousel').length > 0){
        jQuery('.service-backup .owl-carousel, .service-manager-host .owl-carousel').owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            loop: true,
            margin: 15,
            navRewind: false,
            nav: true,
            navText: ['',''],
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                500: {
                    items: 2
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
    }
    if(jQuery('.hosting-company .owl-carousel').length > 0){
        jQuery('.hosting-company .owl-carousel').owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            loop: true,
            margin: 15,
            navRewind: false,
            nav: true,
            navText: ['',''],
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                500: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
        jQuery(".layer-old-7 .nav-hosting ul li a").click(function (){
            var _href = this.href;
            if(_href.lastIndexOf('#') === -1){
                window.location = _href;
            }
        });
    }
    if(jQuery('.about-us .owl-carousel').length > 0){
        jQuery('.about-us .owl-carousel').owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            loop: true,
            margin: 30,
            navRewind: false,
            nav: true,
            navText: ['',''],
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                768: {
                    items: 2
                }
            }
        });
    }
    if(jQuery('.layer-17 .content-2 .owl-carousel').length > 0){
        jQuery('.layer-17 .content-2 .owl-carousel').owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            loop: true,
            margin: 15,
            navRewind: false,
            nav: true,
            navText: ['',''],
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                320: {
                    items: 2
                },
                480: {
                    items: 3
                },
                600: {
                    items: 4
                },
                768: {
                    items: 5
                },
                992: {
                    items: 6
                },
                1200: {
                    items: 8
                }
            }
        });
    }
    if(jQuery('.main-slider .owl-carousel').length > 0){
        jQuery('.main-slider .owl-carousel').owlCarousel({
            autoplay: false,
            autoplayHoverPause: true,
            loop: false,
            margin: 0,
            navRewind: false,
            nav: false,
            navText: ['',''],
            dots: true,
            responsiveClass: false,
            items: 1
        });
    }
    
    jQuery('.slide-layer-17').on('click', function () {
        jQuery('.slide-layer-17').removeClass('active');
        jQuery(this).addClass('active');
    });
    
    jQuery(window).bind("load resize", function (){
        if(viewport_width > 991){
            jQuery(".half-full-left").css({
                'padding-left': jQuery(".container").offset().left + 15
            });
            jQuery(".half-full-right").css({
                'padding-right': jQuery(".container").offset().left + 15
            });
        } else {
            jQuery(".half-full-left").css({
                'padding-left': 30
            });
            jQuery(".half-full-right").css({
                'padding-right': 30
            });
        }
    });
    
    jQuery("img").each(function(){
        var img_src = this.src;
        if(img_src && img_src.length > 0){
            var img_alt = jQuery(this).attr('alt');
            var img_name = img_src.split('/').pop().replace(/\"|\'|\)/g, '');
            img_name = img_name.substring(0, img_name.lastIndexOf('.'));
            
            // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
            if (typeof img_alt !== typeof undefined && img_alt !== false) {
                if(img_alt.length === 0){
                    jQuery(this).attr('alt', img_name);
                }
            } else {
                jQuery(this).attr('alt', img_name);
            }
        }
    });
    
    if (jQuery("#accordion").length > 0) {
        jQuery("#accordion").accordion({
            collapsible: true,
            heightStyle: "content"
        });
    }
    
    /* Counter */
    var counter = 0;
    jQuery(window).scroll(function () {
        var oTop = jQuery('.count-vote-customer').offset().top - window.innerHeight;
        if (counter === 0 && jQuery(window).scrollTop() > oTop) {
            jQuery('.count').each(function () {
                jQuery(this).prop('Counter', 0).animate({
                    Counter: jQuery(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function (now) {
                        jQuery(this).text(Math.ceil(now));
                    }
                });
            });
            counter = 1;
        }

    });
    
});