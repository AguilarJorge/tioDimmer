$(function(){
    $('.esResponsiv').each(function(i, img){
        var fc = parseInt($(img).css('max-width')) / $(img).height();
        console.log(fc);
        responsivImg($(img), fc);
        $(window).resize(function() {
            responsivImg($(img), fc);
        });
    })
    $('.dimerSlider').each(function(i, slider){
        var {dimerAutomatico, dimerDuracion, dimerControls, dimerTimebar} = $(slider).data();
        var slide = $(slider).find('.dimerSlide');
        var totales = slide.length;
        if (totales > 0) slide.first().addClass('activo');
        if (totales > 1) {
            if (dimerControls) {
                var wrapperDots = $('.dimerSlider').find('.dimerDots');
                $(slider).append('<div class="manualControls"><div class="dimerControl control at"></div><div class="dimerControl control av"></div></div>');
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
            if (dimerTimebar) {
                $(slider).append('<div class="dimerBar"></div>');
            }
        } else {
            console.log($(slide).css('transition', 'none'));
        }
    })

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