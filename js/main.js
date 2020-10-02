$(function(){
    if ($('.tioDimer_menu').length >= 1) {
        fixedMenu()
        $(window).scroll(() => fixedMenu());
    }
    $('.esResponsiv').each(function(i, img){
        var fc = parseInt($(img).css('max-width')) / $(img).height();
        responsivImg($(img), fc);
        $(window).resize(function() {
            responsivImg($(img), fc);
        });
    })
    $('.dimerSlider').each(function(i, slider){
        var {dimerAutomatico, dimerDuracion, dimerControls} = $(slider).data();
        var slide = $(slider).find('.dimerSlide');
        var totales = slide.length;
        if (totales > 0) slide.first().addClass('activo');
        if (totales > 1) {
            if (dimerControls) {
                var wrapperDots = $('.dimerSlider').find('.dimerDots');
                $(slider).append('<div class="manualControls"><div class="dimerControl control circular at"></div><div class="dimerControl control circular av"></div></div>');
                if (wrapperDots.length) {
                    var dots = wrapperDots;
                }else {
                    $(slider).append('<div class="dimerDots"></div>');
                    var dots = $(slider).children('.dimerDots');
                }
                for (var i = 0; i < totales; i++) {
                    dots.append('<div class="dimerDot"></div>');
                }
                dots.children('.dimerDot').first().addClass('activo');
                $(slider).on('click', '.manualControls .dimerControl', function(){
                    if ($(this).hasClass('at')) {
                        autoSlider($(slider), totales, dimerControls, false)
                    }else if ($(this).hasClass('av')) {
                        autoSlider($(slider), totales, dimerControls)
                    }
                    if (automatico) {
                        clearInterval(automatico);
                        automatico = setInterval(function(){
                            autoSlider($(slider), totales, dimerControls)
                        }, dimerDuracion || 5000);
                    }
                })
            }
            if (dimerAutomatico) {
                var automatico = setInterval(function(){
                    autoSlider($(slider), totales, dimerControls)
                }, dimerDuracion || 5000);
            }
        } else {
            $(slide).css('transition', 'none')
        }
    })
    $('.sliderX').each(function(i, sliderX){
        var wrapper = $(sliderX).find('.wrapperX');
        var totalSlides = $(sliderX).find('.slideX').length;
        var widthSlider = wrapper[0].getBoundingClientRect().width;
        var widthSlide = $(sliderX).find('.slideX').first()[0].getBoundingClientRect().width;
        var groupShow = 1;
        var slidesXgrupo = widthSlider / widthSlide;
        slidesXgrupo = Math.floor(slidesXgrupo);
        var grupos = totalSlides / slidesXgrupo;
        grupos = Math.ceil(grupos);
        if (grupos > 1) {
            var intervalo;
            var {duracion, automatico} = $(sliderX).data();
            $(sliderX).find('.wrapperSlider').append('<div class="controlesX"><div class="controlX at"></div><div class="controlX av"></div></div>');
            $(window).resize(function() {
                groupShow = 1;
                widthSlider = wrapper[0].getBoundingClientRect().width;
                widthSlide = $(sliderX).find('.slideX').first()[0].getBoundingClientRect().width;
                slidesXgrupo = Math.floor(widthSlider / widthSlide);
                grupos = Math.ceil(totalSlides / slidesXgrupo);
                wrapper.css('transform', 'translateX(0px)');
            });
            if (automatico) {
                setTimeout(function(){
                    intervalo = setInterval(function(){
                        if (groupShow == grupos) groupShow = 0;
                        wrapper.css('transform', `translateX(-${widthSlider * groupShow}px)`);
                        groupShow++;
                    }, duracion || 5000);
                }, 500 * i)
            }
            $(sliderX).on('click', '.controlesX .controlX', function(){
                if ($(this).hasClass('av')) {
                    if (groupShow == grupos) groupShow = 0;
                    wrapper.css('transform', `translateX(-${widthSlider * groupShow}px)`);
                    groupShow++;
                }else if ($(this).hasClass('at')) {
                    groupShow = groupShow - 1;
                    if (groupShow == 0) groupShow = grupos;
                    wrapper.css('transform', `translateX(-${widthSlider * (groupShow - 1)}px)`);
                }
                if (automatico) {
                    clearInterval(intervalo);
                    intervalo = setInterval(function(){
                        if (groupShow == grupos) groupShow = 0;
                        wrapper.css('transform', `translateX(-${widthSlider * groupShow}px)`);
                        groupShow++;
                    }, duracion || 5000);
                }
            })
        }
    })
    
    $('.tioDimer_dropdown').click(function(){
        $(this).children('.dropOptions').slideToggle('fast');
        $(this).toggleClass('activo');
    })
    $('.tioDimer_dropdown .dropOptions .option').click(function(){
        let value = $(this).data('value');
        $(this).parents('.tioDimer_dropdown').find('.currentValue').text(value);
    })



    function fixedMenu(){
        let topMenu = $('.tioDimer_menu').offset().top;
        let alturaMenu = $('.tioDimer_menu').outerHeight();
        if($(window).scrollTop() >= topMenu) {
            $('.tioDimer_menu').addClass('fixed');
            $('.tioDimer_menu').css('height', alturaMenu);
        }else {
            $('.tioDimer_menu').removeClass('fixed');
            $('.tioDimer_menu').removeAttr('style');
        }
    }
    function autoSlider(slider, totalSlides, indicadores, avanzar = true){
        var posicion = slider.find('.dimerSlide.activo').index();
        if (avanzar) {
            posicion == (totalSlides - 1) ? posicion = 0 : posicion++;
        }else {
            posicion == 0 ? posicion = (totalSlides - 1) : posicion--;
        }
        slider.find('.dimerSlide.activo').removeClass('activo');
        slider.find('.dimerSlide').eq(posicion).addClass('activo');
        if (indicadores) {
            slider.find('.dimerDot.activo').removeClass('activo');
            slider.find('.dimerDot').eq(posicion).addClass('activo');
        }
    }
    function responsivImg(img, convFac){
        var a = img.width() / convFac;
        img.css('height', a);
    }
})