$(function(){
  if ($('.tioDimer_menu').length >= 1) {
    fixedMenu()
    $(window).scroll(() => fixedMenu());
  }
  $('.esResponsiv').each(function(i, img){
    var fc = parseInt($(img).css('max-width')) / $(img).height();
    responsivImg($(img), fc);
    $(window).resize(function() {responsivImg($(img), fc)});
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

  $('.field.anim .value').focusin(function(){
    $(this).parent().removeClass('error');
    if (!$(this).val().trim().length) {
      $(this).val('');
      $(this).parent().addClass('active');
    }
  })
  $('.field.anim .value').focusout(function () {
    if (!$(this).val().trim().length) $(this).parent().removeClass('active');
  })
  $('.form .submit').click(function(){
    let requeridos = $(this).parents('.form').find('.field.required');
    let validos = requeridos.map((i, field) => {
      let valor = $(field).find('.value').val().trim();
      if (valor.length) {
        return 'valido';
      } else {
        $(field).addClass('error');
        return 'invalido';
      }
    })
    if ($.inArray('invalido', validos) > -1) return false;
    console.log('envia form');
  })

  $('.tioDimer_producto .detalleRapido').click(function(){
    let id = $(this).data('id');
    let info = productos.find(prod => prod.id == id);
    detallesRapidos(info);
  })
  $(document).on('click', '.tioDimer_toCartCantidad .toCartBoton', function(){
    const boton = $(this);
    toCartCantidad(boton, boton.hasClass('mas') ? 'suma' : boton.hasClass('menos') ? 'resta' : null);
  });
  $(document).on('click', '.tioDimer_aFavs', function(){
    $(this).toggleClass('esFav');
  })
  $(document).on('click', '.zoomWatch_launcher', function(){
    var areaImagen = $(this).parent();
    zoomImg(areaImagen);
  })
  $(document).keydown(function(e){
    if ($('.tioDimer_infoRapidaModal').length && e.keyCode === 27) {
      $('.tioDimer_infoRapidaModal').fadeOut(function(){
        $(this).remove();
      })
    }
  })

  //Crear dots para las imagenes y activar la primer imagen
  if ($('.tioDimer_detalleProducto .preview').length) {
    let preview = $('.tioDimer_detalleProducto .preview');
    let imagenes = preview.find('[data-img]');
    let indexActiva = 0;
    let backgroundImagen = preview.find('.imagenProd');
    backgroundImagen.css('background-image', `url(${preview.find('[data-img]').first().data('img')})`);
    if (imagenes.length > 1) {
      let dots = '';
      let arrayImagenes = [];
      for (let i = 0; i < imagenes.length; i++) {
        arrayImagenes.push($(imagenes[i]).data('img'));
        dots += `<div class="dot ${i == 0 ? 'activa' : ''}"></div>`;
      }
      imagenes.remove();
      $(`
        <div class="controls">
          <div class="control left">
            <div class="icono">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M14 31.998h36"></path>
                <path d="M28 18L14 32l14 14"></path>
              </svg>
            </div>
          </div>
          <div class="dots">${dots}</div>
          <div class="control right">
            <div class="icono">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M50 31.998H14"></path>
                <path d="M36 18l14 14-14 14"></path>
              </svg>
            </div>
          </div>
        </div>`
      ).insertAfter(preview.children('.imagenesContainer'));
      preview.on('click', '.control', function () {
        preview.find('.dot').removeClass('activa');
        if ($(this).hasClass('left')) {
          if (indexActiva == 0) {
            indexActiva = arrayImagenes.length - 1;
            preview.find('.dot').last().addClass('activa');
          } else {
            --indexActiva;
            preview.find('.dot').eq(indexActiva).addClass('activa');
          }
        } else if ($(this).hasClass('right')) {
          if (indexActiva < (imagenes.length - 1)) {
            indexActiva++;
            preview.find('.dot').eq(indexActiva).addClass('activa');
          } else {
            indexActiva = 0;
            preview.find('.dot').first().addClass('activa');
          }
        }
        backgroundImagen.css('background-image', `url(${arrayImagenes[indexActiva]})`);
      })
      preview.on('click', '.dot', function () {
        indexActiva = $(this).index();
        $(this).siblings('.activa').removeClass('activa');
        $(this).addClass('activa');
        backgroundImagen.css('background-image', `url(${arrayImagenes[indexActiva]})`);
      })
    }
  }
  //Si hay tabs las inicializamos
  if ($('.tioDimer_tabsViewer').length) {
    $('.tioDimer_tabsViewer').each(function(i, tabs){
      $(tabs).find('.tioDimer_tabsHeader').first().addClass('activa');
      $(tabs).find('.tioDimer_tabsContent').first().show();
    })
    $('.tioDimer_tabsViewer .tioDimer_tabsHeader').click(function(){
      if (!$(this).hasClass('activa')) {
        var tabId = $(this).data('tab');
        var tabsHeaders = $(this).parent().children();
        $(this).addClass('activa tioDimer_notClickable');
        $(this).siblings().removeClass('activa').addClass('tioDimer_notClickable');
        $(this).parents('.tioDimer_tabsViewer').find('.tioDimer_tabsContent:visible').fadeOut('fast', function(){
          $(this).siblings(`[data-tab="${tabId}"]`).fadeIn('fast', function(){
            tabsHeaders.removeClass('tioDimer_notClickable');
          });
        })
      }
    })
  }


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
  function detallesRapidos(datos){
    const { codigoProducto, descripcionLarga, existencia, imagen, nombre, precio, precioOferta } = datos;
    if (!$('.tioDimer_infoRapidaModal').length) {
      $('body').append(`
        <div class="tioDimer_infoRapidaModal">
          <div class="closeModal"></div>
          <div class="modalContainer">
            <div class="topContent">
              <div class="imagenContainer tioDimer_zoomWatch_section">
                <div class="zoomWatch_launcher" title="Ampliar imagen">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path d="M2.002 40h22v22h-22z"></path>
                    <path d="M2 28V2h60v60H36"></path>
                    <path d="M30 34l22-22m-16 0h16v16"></path>
                  </svg>
                </div>
                <div class="zoomWatch_imgOrigin wrapperImg">
                  <div class="zoomWatch_imgSource imagen" style="background-image: url(${imagen});"></div>
                </div>
              </div>
              <div class="texto">
                <div class="wrapper">
                  <p class="nombre">${nombre}</p>
                  <div class="precios">
                    <p class="precio">${precio}</p>
                    ${precioOferta ? `<p class="precioOferta">${precioOferta}</p>` :''}
                  </div>
                  <p class="stock ${existencia ?'':'out'} bold">${existencia ? 'Disponible en tienda y listo para enviar' : 'Fuera de stock'}</p>
                  <p class="codigo"><span class="bold">Código Producto: </span>${codigoProducto}</p>
                  <div class="actions">
                    <div class="tioDimer_toCartCantidad ${!existencia ? 'tioDimer_disabled':''}">
                      <div class="toCartBoton menos tioDimer_disabled"></div>
                      <div class="toCartCantidad">1</div>
                      <div class="toCartBoton mas"></div>
                    </div>
                    <div class="tioDimer_botonTextoIcono ${!existencia ? 'tioDimer_disabled' : ''}">
                      <label class="labelBoton">Agregar al carrito</label>
                      <div class="icono">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                          <path d="M2 6h10l10 40h32l8-24H16"></path>
                          <circle cx="23" cy="54" r="4"></circle>
                          <circle cx="49" cy="54" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                    <div class="tioDimer_aFavs tioDimer_botonIcono">
                      <div class="icono">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                          <path d="M47 5c-6.5 0-12.9 4.2-15 10-2.1-5.8-8.5-10-15-10A15 15 0 0 0 2 20c0 13 11 26 30 39 19-13 30-26 30-39A15 15 0 0 0 47 5z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="descripcion">${descripcionLarga}</p>
                  <a class="tioDimer_boton" href="#">Ver detalles completos</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    }
    $('.tioDimer_infoRapidaModal').fadeIn().css('display', 'flex');
    $('.tioDimer_infoRapidaModal .closeModal').click(function(){
      $(this).parent().fadeOut(function(){
        $(this).remove();
      })
    })
  }
  function toCartCantidad(boton, operacion){
    const container = boton.parents('.tioDimer_toCartCantidad');
    const numero = container.find('.toCartCantidad');
    let tipoAnim = 'normal';
    if (operacion == 'resta') {
      if (parseInt(numero.text()) == 1) return false;
      if (parseInt(numero.text() - 1) == 1) {
        boton.addClass('tioDimer_disabled');
      }
      tipoAnim = 'reverse';
      numero.text(parseInt(numero.text()) - 1);
    } else if (operacion == 'suma') {
      boton.siblings('.toCartBoton.tioDimer_disabled').removeClass('tioDimer_disabled');
      numero.text(parseInt(numero.text()) + 1);
    } else {
      console.log('El tipo de operacion (suma / resta) es obligatorio');
      return false;
    }
    numero.addClass(tipoAnim == 'reverse' ? 'animacion-reverse' : 'animacion');
    numero.one('animationend', function () {
      numero.removeClass(tipoAnim == 'reverse' ? 'animacion-reverse' : 'animacion');
    });
  }
  function zoomImg(zoomArea, escala = 3){
    if ($(window).outerWidth() > 768) {
      zoomArea.find('.zoomWatch_launcher').fadeOut('fast');
      const imagen = zoomArea.find('.zoomWatch_imgOrigin');
      const urlImagen = zoomArea.find('.zoomWatch_imgSource')[0].style.backgroundImage;
      const dimensiones = {
        imagen: {
          width: imagen.outerWidth(), height: imagen.outerHeight()
        },
        lupa: {
          width: imagen.outerWidth() / escala, height: imagen.outerHeight() / escala
        }
      };
      const estiloInicial = {
        backgroundImage: urlImagen,
        backgroundSize: parseInt(imagen.css('padding')) ? `calc(100% - (${(parseInt(imagen.css('padding')) / 2) * escala}px))` : 'contain',
        transform: `scale(${escala}) translateX(${dimensiones.imagen.width / escala}px) translateY(${dimensiones.imagen.height / escala}px)`
      };
      imagen.append(`<div class="zoomWatch_lupa"></div>`);
      zoomArea.append(`<div class="zoomWatch_imgAlt zoomImg"><div class="zoom"></div></div>`);
      const scaleArea = zoomArea.children('.zoomWatch_imgAlt');
      const zoom = scaleArea.children('.zoom');
      const lupa = imagen.children('.zoomWatch_lupa');
      scaleArea.fadeIn();
      zoom.css(estiloInicial);
      lupa.css(dimensiones.lupa);
      imagen.mousemove(function(e){
        let movimientoLupa = {x: e.pageX, y: e.pageY};
        let centroImagen = {
          x: (imagen.offset().left + (dimensiones.imagen.width / 2)),
          y: (imagen.offset().top + (dimensiones.imagen.height / 2))
        }
        let posicionLupa = {
          x: centroImagen.x - movimientoLupa.x,
          y: centroImagen.y - movimientoLupa.y
        }
        let transformLupa = {
          x: (movimientoLupa.x - (dimensiones.lupa.width / 2)) - imagen.offset().left,
          y: (movimientoLupa.y - (dimensiones.lupa.height / 2)) - imagen.offset().top
        }
        var transformZoom = (`scale(${escala}) translateX(${posicionLupa.x}px) translateY(${posicionLupa.y}px)`);
        zoom.css('transform', transformZoom);
        lupa.css('transform', `translateX(${transformLupa.x}px) translateY(${transformLupa.y}px)`);
      });
      imagen.mouseout(function(){
        lupa.remove();
        zoomArea.find('.zoomWatch_launcher').fadeIn('fast');
        scaleArea.fadeOut('fast', function(){
          scaleArea.remove();
        })
      })
    } else {
      console.warn('Solo disponible para pc');
    }
  }
})