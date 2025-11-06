'use strict';

/**
 * Verifica si el navegador soporta localStorage.
 * @returns true o false.
 */
const isLocalStorageSupported = () => {
    try {
        var test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Verifica si el navegador soporta sessionStorage.
 * @returns true o false.
 */
const isSessionStorageSupported = () => {
    try {
        var test = 'test';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @param {string} delimitador Caracter separador, por default es '/'
 * @param {boolean} formatoAAAA Si es true el formato seria YYYY/MM/DD, por default es DD/MM/YYYY
 * @description retorna la fecha actual del sistema.
 * @returns string
 */
function getFechaActual(delimitador = '', formatoAAAA = false) {
    let f = new Date(),
        delim = delimitador == "" ? '/' : delimitador,
        anio = f.getFullYear(),
        mes = f.getMonth() + 1,
        dia = f.getDate();
    if (mes < 10) {
        mes = "0" + mes.toString()
    }
    if (dia < 10) {
        dia = "0" + dia.toString()
    }
    if (formatoAAAA) {
        return anio + delim + mes + delim + dia
    } else {
        return dia + delim + mes + delim + anio
    }
}

function crea_box_verlay(elemento, mostrar = true, texto = 'Cargando...') {
    const overlayActual = $(elemento).find('.overlay-load');
    if (mostrar) {
        /* SI YA EXISTE UN OVERLAY LO ELIMINAMOS */
        if (overlayActual.length) {
            overlayActual.remove();
            $(elemento).removeClass('position-relative');
        }

        let html = /*template*/
            `<div class="overlay-load d-flex flex-column justify-content-center align-items-center text-white">
                <i class="fas fa-3x fa-circle-notch fa-spin"></i>
                <div class="pt-2">${texto}</div>
            </div>`;
        $(elemento).addClass("position-relative").append(html);
    } else {
        if (overlayActual.length) {
            overlayActual.fadeOut();
            setTimeout(() => { overlayActual.remove() }, 300);
        }
    }
}

function crea_box_verlay_estatus(elemento, mostrar = true, status = 'ok', texto = '', autoClose = true) {
    let icon = "<i class='fas fa-check-circle fa-3x'></i>";
    switch (status) {
        case 'error':
            icon = "<i class='fas fa-times-circle fa-3x'></i>";
            break;
        case 'info':
            icon = "<i class='fas fa-info-circle fa-3x'></i>";
            break;
        case 'warning':
            icon = "<i class='fas fa-exclamation-circle fa-3x'></i>";
            break;
    }
    let overlayActual = $(elemento).find('.overlay-load');
    if (mostrar) {
        /* SI YA EXISTE UN OVERLAY LO ELIMINAMOS */
        if (overlayActual.length) {
            overlayActual.remove();
            $(elemento).removeClass('position-relative');
        }
        let htmlOverlay = /*template*/
            `<div class="overlay-load d-flex flex-column justify-content-center align-items-center text-white">
                ${icon}
                <div class="pt-2">${texto}</div>
            </div>`;
        $(elemento).addClass("position-relative").append(htmlOverlay);
        if (autoClose) {
            setTimeout(() => {
                crea_box_verlay_estatus(elemento, false);
            }, 1500);
        }
    } else {
        overlayActual.fadeOut();
        setTimeout(() => { overlayActual.remove() }, 300);
    }
}

function mostrarEsperar(mostrar = true, texto = 'Un momento...') {
    mostrarEsperarLoadingCircle(mostrar, texto);
}

function isEmptyCero(value) {
    return (value == null || value.length === 0 || String(value) === "0");
}

function isEmpty(value) {
    return (value == null || value.length === 0);
}

function isNotEmpty(value) {
    return (value != null || value.length !== 0);
}

function mostrarEsperarLoadingCircle(mostrar = true, texto = 'Un momento...') {
    if (mostrar) {
        let htmlModal =
            `<div class="modal modal-esperar fade" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog modal-sm" style="margin-top: 80px;">
                    <div class="modal-content">
                        <div class="modal-header d-flex justify-content-center flex-wrap px-1" style="border-bottom-right-radius: 0.3rem;border-bottom-left-radius: 0.3rem;">
                            <div class="loading-circle"></div>
                            <div class="mx-2"></div>
                            <h5 class="modal-title">${texto}</h5>
                        </div>
                    </div>
                </div>
            </div>`,
            modal = $(htmlModal);

        modal.modal('show');
    } else {
        setTimeout(() => {
            $(".modal-esperar").modal("hide")
        }, 700);
    }
}

function cerrarSwal() {
    swal.close();
}

/** 
 * @param {string} idElemento Elemento del DOM con id o clase
 * @param {string} fecha la fecha que se mostrara
 */
function setValueDatePicker(idElemento, fecha = null) {
    let el = $(idElemento);
    if (fecha) {
        let Separador = fecha.includes('-') ? '-' : '/',
            nDate = new Date(fecha.split(Separador).reverse().join('-'));
        el.datepicker("setUTCDate", nDate).datepicker('update');
    } else {
        const nDate = new Date();
        el.datepicker("setDate", nDate).datepicker('update');
    }
}

function check(idElement, flag = true) {
    $(`#${idElement}`).prop('checked', flag)
}

function disabled(elemento, dis = false) {
    $(elemento).prop("disabled", dis);
}
/*Formatea un numero a cadena y los separa en miles ejemplo: 10500.43 -> 10,500.43 */
const numeroFormato = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}
function btnLoading(el, text = 'espere...') {
    let textHtml = `<i class="fa fa-spinner fa-spin"></i>`;
    if (text.length > 0)
        textHtml += ` ${text}`;
    $(el).html(textHtml).prop("disabled", true);
}
/**
 * @param {string} fecha string con la fecha, ejemplo dd/mm/yyyy
 * @param {string} separador string con el separador de la fecha
 * @returns {boolean}
 * @description Valida que la fecha sea una fecha correcta del calendario.
 */
function existeFecha(fecha, separador = '/') {
    var fechaf = fecha.split(separador),
        d = fechaf[0],
        m = fechaf[1],
        y = fechaf[2];
    if (y.includes(" ")) {
        y = y.split(' ')[0];
    }
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}
function sesionCaducada() {
    //window.location = "/Vistas/sesionCaducada.aspx";
    window.location = "/index.html";
}
/**
 * @param {string} fecha La fecha desde el servidor. Ejemplo => 2018-11-01T12:43:21.000 
 * @param {String} separador El caracter que separa la fecha de retorno
 * @returns Cadena de fecha. Ejemplo 2018/11/01, si el separador es '-' el retorno seria 01-11-2018
 */
function fechaFromServer(fecha, separador = '/') {
    try {
        if (!IsNullOrEmpty(fecha))
            return fecha.substring(0, 10).split('-').reverse().join(separador)
        else
            return ''
    } catch (error) {
        console.log(error);
        return ''
    }
}
/**
 * @param {string} fecha La fecha a enviar. Normalmente es con el formato dd/mm/aaaa
 * @param {String} separador El caracter que separa la fecha de retorno
 * @param {boolean} time Decide si el retorno tambien se agrega el formato 2016-04-01T00:00:00.000
 * @returns Cadena de fecha. con formato de aaaa/mm/dd ó aaaa-mm-dd, Ejemplo: recibe la fecha asi=> 01/11/2018 y la revierte asi=>2018-11-01
 */
function fechaToServer(fecha, separador = '/', time = false) {
    try {
        if (fecha != null && fecha != "") {
            if (time) {
                let soloFecha = fecha.includes("T") ? fecha.split("T")[0] : fecha.split(" ")[0];
                return soloFecha.split(separador).reverse().join('-') + "T" + (fecha.includes("T") ? fecha.split("T")[1] : fecha.split(" ")[1]);
            }
            return (fecha && fecha.length === 10) ? fecha.split(separador).reverse().join('-') : '';
        }
        return "";
    } catch (error) {
        console.log(error);
        return "";
    }
}
function modalShow(el) {
    $(el).modal("show")
}
function modalHide(el) {
    let elModal = $(el);
    elModal.modal("hide");
}
/**
 * Comprueba si la aplicacion se esta ejecutando en un dispositivo movil
 * @returns true (dispositivo movil), null cuando no lo es
 */
const IS_MOBILE = () => {
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
}

/**
 * @description crea los elementros SelectPicker, recibe el elemento y el total de opciones a mostrar
 * @param {string} elemento 
 * @param {number} tam 
 * @param {string} placeHolder 
 * @param {boolean} isMultiple 
 * @returns 
 */
function creaSelectPicker(elemento, tam = 15, placeHolder = 'buscar en esta lista', isMultiple = false) {
    try {
        let el = $(elemento),
            esMovil = IS_MOBILE() != null ? true : false;

        if(el.length === 0){
            return;
        }

        el.selectpicker('destroy');

        const ShowSubText = el.attr('data-show-subtext') ? true : false;

        el.selectpicker({
            style                : 'btn-light border',
            size                 : tam,
            liveSearch           : true,
            liveSearchStyle      : 'contains',
            liveSearchPlaceholder: placeHolder,
            noneSelectedText     : 'Elige una opción',
            noneResultsText      : 'Sin resultados para {0}',
            mobile               : esMovil,
            countSelectedText    : isMultiple ? '{0} Selecionados': '',
            selectedTextFormat   : 'count > 3',
            actionsBox           : isMultiple,
            selectAllText        : 'Todos',
            deselectAllText      : 'Ninguno',
            showSubtext          : ShowSubText,
            iconBase             : 'fas',
            tickIcon             : 'fa-check'
        });

        setTimeout(() => {
            el.selectpicker('refresh');
        }, 100);
    } catch (error) {
        console.error(`creaSelectPicker => ${error}`)
    }    
}

/**
 * @description Cambia el color de fondo si es valido o no, se usa para los combos con la clase selectPicker
 * @param {string} data_id 
 * @param {boolean} EsValido 
 */
const buttonSelectValid = (data_id, EsValido = true) => {
    try {
        const El = $("button[data-id=" + data_id + "]");
        if (EsValido){
            El.removeClass("has_danger");
        } else {
            El.addClass("has_danger");
        }
    } catch (error) {
        console.error(`buttonSelectValid => ${error}`)
    }
}

/**
 * @description Establece o no, el foco en el elemento, se usa para los combos con la clase selectPicker
 * @param {string} data_id 
 * @param {boolean} SetFocus 
 */
const buttonSelectFocus = (data_id, SetFocus = true) => {
    try {
        const El = $("button[data-id=" + data_id + "]");
        if (SetFocus){
            El.focus();
        }else{
            El.blur();
        }
    } catch (error) {
        console.error(`buttonSelectFocus => ${error}`)  
    }
}

/**
 * @description Establece el valor al elemento, se utiliza para los combos con clase SelectPicker
 * @param {string} el 
 * @param {*} value 
 */
function setValueSelectPicker(el, value = '') {
    try {
        const El = $(el);
        if(El.length === 0){throw `No se encontro el elemento (${el}).`}
        El.val(value).selectpicker('refresh');
    } catch (error) {
        console.error(`setValueSelectPicker => ${error}`)
    }
}

/**
 * @description Obtiene el valor de la variable que se para por medio de la url
 * @param {*} key 
 * @param {*} default_ 
 * @returns el valor de la variable en la URL
 */
function getQuerystring(key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    let regex = new RegExp("[\\?&]" + key + "=([^&#]*)")
    qs = regex.exec(window.location.href);

    return qs == null ? default_ : qs[1]
}
function ObtenerParametrosDesdeURL(NombreParametro, ValorDefault = "") {
    return getQuerystring(NombreParametro, ValorDefault);
}
function focusBlurElement(el, focus = true) {
    if (focus)
        $(el).focus()
    else
        $(el).blur()
}
function generaIdUnico() {
    let d = new Date().getTime(),
        uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    return uuid;
}
function EmailValido(email) {
    return esEmailValido(email)
}

/*#region MENSAJES SWAL*/

/**
 * Muestra un mensaje emergente y espera a que el usuario precione aceptar para continuar con la ejecucion del codigo.
 * @param {object} oMensaje {Titulo: '', Mensaje: '', Tipo: ''}
 */
const mostrarAlertaAsync = async (oMensaje) => {
    
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }

    const TITULO = !oMensaje.Titulo ? '¡AVISO!' : oMensaje.Titulo.trim();
    const MENSAJE = !oMensaje.Mensaje ? 'Revize los detalles de la operaci&oacute;n' : oMensaje.Mensaje.trim();
    const TIPO_ALERTA = !oMensaje.Tipo ? 'warning' : oMensaje.Tipo.trim();

    let ColoButton = "#F9A826";
    switch (TIPO_ALERTA) {
        case "success":
            ColoButton = "#4b8629"
            break;
        case "error":
            ColoButton = "#E64F4F"
            break;
        case "info":
            ColoButton = "#2D92A2"
            break;
    }

    await Swal.fire({
        title: TITULO,
        html: MENSAJE,
        icon: TIPO_ALERTA,
        focusConfirm: false,
        allowEnterKey: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: ColoButton,
        allowOutsideClick: false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    });
}

const mostrarSuccess = (titulo, mensaje = '') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    Swal.fire({
        title: titulo,
        html: mensaje.trim(),
        icon: 'success',
        focusConfirm: false,
        allowEnterKey: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4b8629',
        allowOutsideClick: false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    });
}

const mostrarWarning = (titulo, mensaje = '') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    Swal.fire({
        title: titulo,
        html: mensaje.trim(),
        icon: 'warning',
        focusConfirm: false,
        allowEnterKey: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#F9A826',
        allowOutsideClick: false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    });
}

const mostrarError = (titulo, mensaje = '') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    Swal.fire({
        title: titulo,
        html: mensaje.trim(),
        icon: 'error',
        focusConfirm: false,
        allowEnterKey: false,
        confirmButtonText: 'Aceptar',
        //imageHeight: 150,
        confirmButtonColor: '#E64F4F',
        //imageUrl: ImgBase64_Error(),
        allowOutsideClick: false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    });
}

const mostrarInfo = (titulo, mensaje = '', TextoDelBoton = 'Aceptar') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    Swal.fire({
        title: titulo,
        html: mensaje.trim(),
        icon: 'info',
        focusConfirm: false,
        allowEnterKey: false,
        //confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2D92A2',
        confirmButtonText: TextoDelBoton,
        allowOutsideClick: false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    });
}

/**
 * @param {string} mensaje Texto a mostrar
 * @param {string} PosicionPantalla 'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'
 */
const mostrarMensajeNull = (mensaje = '', PosicionPantalla = 'center') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    mensaje = `<span style="font-size: 20px;">${$.trim(mensaje)}</span>`;

    Swal.fire({
        title: mensaje,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: "#44a277",
        position: PosicionPantalla,
        allowOutsideClick: false,
        allowEscapeKey   : false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    })
}

const mostrarMensajeNullConFuncion = (fnAceptar, fnCancelar, mensaje = '', textButtonConfirm = 'Aceptar', textDebyButton = 'Cancelar') => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    mensaje = `<span style="font-size: 20px;">${$.trim(mensaje)}</span>`;
    Swal.fire({
        showCancelButton  : false,
        showDenyButton    : true,
        title             : mensaje,
        confirmButtonColor: '#4088a6',
        denyButtonColor   : '#b0b6bb',
        confirmButtonText : textButtonConfirm,
        denyButtonText    : textDebyButton,
        allowOutsideClick : false,
        allowEscapeKey    : false,
        reverseButtons    : true,
        allowEnterKey     : false,
        didOpen: () => {
            const isLoading = Swal.isLoading();
            if(isLoading){
                Swal.hideLoading();
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fnAceptar
        } else if (result.isDenied) {
            fnCancelar
        }
    });
}

/**
 * @description Muestra un modal con mensaje personalizado que le indica al usuario un momento de espera.
 * @param {string} texto Es el texto del titulo del mensaje
 * @param {string} Mensaje Sub mensaje a mostrar
 * @param {boolean} BloqueoGlobal Indica si el bloqueo sera total en la pantalla o solo en Frame donde se llama el bloqueo.
 */
const MostrarBLoqueo = (texto = 'Un momento...', Mensaje = '', BloqueoGlobal = true) => {
    if(BloqueoGlobal){
        window.parent.MostrarBloquePrincipal(texto, Mensaje)
    } else {
        BloqueoSwal(texto, Mensaje);
    }
}

const BloqueoSwal = (texto = 'Un momento...', Mensaje = '') => {
    Swal.fire({
        title            : texto,
        html             : `<span style = "color: #8d8f91;">${Mensaje}</span>`,
        allowOutsideClick: false,
        allowEscapeKey   : false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}

const MostrarMensajeConBloqueo = (TipoMensaje, titulo, Mensaje) => {
    if(window.parent.Swal.isVisible()){
        CerrarBloqueo();
    }
    Swal.fire({
        icon: TipoMensaje,
        title: titulo,
        html: Mensaje,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
    })
}

const CerrarBloqueo = (BloqueoGlobal = true) => {
    if(BloqueoGlobal){
        window.parent.CerrarBloquePrincipal();
    } else {
        CerrarBloqueoSwal();
    }
}

const CerrarBloqueoSwal = () => {
    if(Swal.isVisible()){
        Swal.close()
    }
}

const ConfirmarSwal = function(mensaje, Funcion, txtCancelbtn = "No, cancelar.", txtConfirmBtn = "Si, continuar.", loaderConfirm = true, Titulo = ''){
    try {
        Swal.fire({
            title: Titulo,
            html: mensaje,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: txtCancelbtn,
            confirmButtonColor: '#4088a6',
            cancelButtonColor: '#b0b6bb',
            confirmButtonText: txtConfirmBtn,
            allowOutsideClick: false,
            allowEscapeKey: false,      
            showLoaderOnConfirm: loaderConfirm,
            reverseButtons: true,
            focusConfirm: false,
            allowEnterKey: false,
            preConfirm: Funcion,
            didOpen: () => {
                const isLoading = Swal.isLoading();
                if(isLoading){
                    Swal.hideLoading();
                }
            }
          });
    } catch (error) {
        console.log(error);
        mostrarError('¡ALGO SALIO MAL!', 'Ocurrió un error al mostrar el mensaje de confirmación. Contacte con Soporte TI para solucionar el problema.');
    }
}

const RetornaOpcionesParaSwalConfirm = async function (Titulo = '', Mensaje = '', TextoBtnCancelar = 'Cancelar', TextoBtnConfirmar = 'Continuar'){
    return {
        title             : Titulo,
        html              : Mensaje,
        icon              : 'question',
        showCancelButton  : true,
        cancelButtonText  : TextoBtnCancelar,
        confirmButtonText : TextoBtnConfirmar,
        confirmButtonColor: '#4088a6',
        cancelButtonColor : '#b0b6bb',
        reverseButtons    : true,
        allowOutsideClick : false,
        allowEscapeKey    : false,
        allowEnterKey     : false
    }
}

const SwalQuestionAsync = async (Titulo = '', Mensaje = '', TextoBtnCancelar = 'Cancelar', TextoBtnConfirmar = 'Continuar') => {
    let retorno = null;
    try {
        const OPTIONS = await RetornaOpcionesParaSwalConfirm(Titulo, Mensaje, TextoBtnCancelar, TextoBtnConfirmar);
        retorno = await Swal.fire(OPTIONS);
    } catch (error) {
        console.error(`SwalQuestionAsync => ${error}`);
    }
    return retorno;
}

/*#endregion*/

/**
 * Valida el parametro "email" tiene el formato correcto para ser un correo electrónico.
 * @param {string} email 
 * @returns true si es un correo valido, de lo contrario false.
 */
function esEmailValido(email) {
    try {
        if (typeof email === 'string') {
            email = email.trim();
            const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return formatoCorreo.test(email.trim());
        } else {
            return false;
        }        
    } catch (error) {
        console.error(`esEmailValido => ${error}`);
    }
}

/**
 * @param {string} numero 
 * @returns true si el parametro es un numero y es mayor que cero, de lo contrario retorna false.
 */
function esNumeroMayorQueCero(numero) {
    let Okay = true;
    try {
        if(isNaN(numero)){
            Okay = false;
        } else if(Number(numero) <= 0){
            Okay = false;
        }
    } catch (error) {
        console.error("esNumeroMayorQueCero => ", error);
        Okay = false;
    }
    return Okay;
}

function EjecutarWebMethod(method, datos, success, failure) {
    if (typeof (success) != 'function')
        success = function (d) { alert("entra " + JSON.stringify(d)); };
    if (typeof (failure) != 'function')
        failure = function (d) { alert("entro " + JSON.stringify(d)); };
    $.ajax(
        {
            async: true,
            type: "POST",
            url: method,
            cache: false,
            dataType: "json",
            data: datos,
            contentType: 'application/json; charset=utf-8',
            success: success,
            error: failure

        });
    return;
}

function SerialiceJSON(value) {
    const data = { "value": JSON.stringify(value) };
    return JSON.stringify(data);
}

function RegresaHorariosConIntervaloDeMediaHora() {
    let ArrayRetorno = [];
    for (i = 0; i <= 23; i++) {
        for (j = 0; j <= 3; j++) {
            const HORA = Padd(i, 2) + ":" + Padd(j * 15, 2);
            ArrayRetorno.push(HORA)
        }
    }
    return ArrayRetorno;
}

function Padd(value, length) {
    return (value.toString().length < length) ? Padd("0" + value, length) : value;
}

function RetornaStringConLetraCapital(cadena) {
    let retorno = "";
    const PrimeraLetra = cadena.charAt(0);
    if (PrimeraLetra != '') {
        retorno = PrimeraLetra.toUpperCase() + cadena.slice(1).toLowerCase();
    }
    return retorno;
}

/** FUNCIONES QUE ESTAN EN EL ARCHIVO VIEJO DE UTILERIAS DE LA PLATAFORMA */
/** 
 * @param {String} Fecha Ejemplo: AA-MM-YYYY
 * @param {String} SeparadorFecha Caracter que separa el dia, mes y año, (/ ó -)
 * @returns cadena.Ejemplo; 01 de Enero del 2020
 */
function RegresaFechaFormatoTexto(Fecha, Formato_YYYY = true, SeparadorFecha = '-') {
    if (Formato_YYYY) {
        Fecha = Fecha.split(SeparadorFecha).reverse().join(SeparadorFecha);
    }

    let Retorno = Fecha,
        FechaSeparada = Fecha.split(SeparadorFecha),
        Dia = Number(FechaSeparada[0]) < 10 ? '0' + FechaSeparada[0] : FechaSeparada[0],
        NombreMes = MesesEsp[Number(FechaSeparada[1]) - 1],
        Anio = FechaSeparada[2];

    if (FechaSeparada.length > 0) {
        Retorno = Dia + " de " + NombreMes + " de " + Anio;
    }

    return Retorno;
}

/**
 * @param {string} Fecha Ejemplo: 15/02/2023
 * @param {*} SeparadorFecha Por default es (-)
 * @returns una cadena con el mes corto: ejemplo: 15/02/2023 -> 15/Feb/2023
 */
function RegresaFechaConNombreMesCorto(Fecha, SeparadorFecha = '-') {
    let Retorno = Fecha,
        FechaSeparada = Fecha.split(SeparadorFecha),
        Dia = Number(FechaSeparada[0]) < 10 ? '0' + Number(FechaSeparada[0]) : FechaSeparada[0],
        NombreMes = MesesCortos[Number(FechaSeparada[1]) - 1],
        Anio = FechaSeparada[2];

    if (FechaSeparada.length > 0) {
        Retorno = Dia + "/" + NombreMes + "/" + Anio;
    }
    return Retorno;
}

/**
 * @param {string} Fecha Ejemplo: 01/Enero/2020
 * @param {String} SeparadorFecha Caracter que separa el dia, mes y año, (/ ó -)
 * @param {String} SeparadorFechaRetorno Caracter que separa el dia, mes y año, (/ ó -) y con ese caracter sera el string de retorno
 * @returns {String} Ejemplo: 01/01/2020
 */
function RegresaFormatoFechaSoloNumeros (StringFecha, SeparadorFecha = '/', SeparadorFechaRetorno = '-') {
    try {
        let Split = StringFecha.split(SeparadorFecha),
            Dia = Split[0],
            Mes = '',
            Anio = Split[2];

        let IndexMes = MesesEsp.findIndex(mes => mes == Split[1]);

        if(IndexMes >= 0){
            IndexMes++;
            Mes = IndexMes < 10 ? '0' + IndexMes : IndexMes;   
            const retorno = `${Dia}${SeparadorFechaRetorno}${Mes}${SeparadorFechaRetorno}${Anio}`;
            return retorno;
        } else {
            return '';
        }
    } catch (error) {
        console.log(error);
        return '';
    }
}

function LeerArchivo(Elemento) {
    try {
        if (Elemento.files && Elemento.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
                vueLocalizaciones.GrabarIcono();
            }
            reader.readAsDataURL(Elemento.files[0]);

        }
    } catch (e) {
        mostrarError(e.message);
    }
}

function subirArchivo(IdElemento) {
    try {
        const Elemento = document.getElementById(IdElemento);
        LeerArchivo(Elemento);
    } catch (e) {
        mostrarError(e.message);
    }
}

function validateEmail(email) {
    return esEmailValido(email);
}

const rgbToHex = function (rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

const hexToRgba = function (hex, opacity) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
};

function TieneCaracteresNoPermitidos(text) {
    for (i = 0; i < text.length; i++) {
        if ((("<>/@=|\\$%&/()=!?¡¿*}{[]_:").indexOf(text.charAt(i)) > -1)) {
            return true;
        }
    }
    return false;
}

const fullColorHex = function (r, g, b) {
    const red = rgbToHex(r);
    const green = rgbToHex(g);
    const blue = rgbToHex(b);
    return '#' + red + green + blue;
};

function removeOverlay(elemento) {
    $(elemento).find(".widget-box-overlay").remove();
    setTimeout(() => {
        $(elemento).removeClass("position-relative")
    }, 100);
}

function formatoNumeroMiles(numero) {
    if (numero !== null && numero !== undefined) {
        var formatNumber = {
            separador: ",", // separador para los miles
            sepDecimal: '.', // separador para los decimales
            formatear: function (num) {
                num += '';
                var splitStr = num.split('.');
                var splitLeft = splitStr[0];
                var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
                var regx = /(\d+)(\d{3})/;
                while (regx.test(splitLeft)) {
                    splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
                }
                return this.simbol + splitLeft + splitRight;
            },
            new: function (num, simbol) {
                this.simbol = simbol || '';
                return this.formatear(num);
            }
        }
        return formatNumber.new(numero)
    } else {
        return ''
    }
}

function fechaTimeFromServer(fecha, separador = '/') {
    if (fecha != "")
        return fecha.substring(0, 10).split('-').reverse().join(separador) + " " + fecha.substring(11, 16);
    else
        return ''
}

function getHoraActualFormatoAMPM(retornarAMPM = true) {
    let date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes;
    if (retornarAMPM) {
        strTime += ' ' + ampm;
    }
    return strTime;
}

/**
 * Convierte la hora AM | PM a formato 24hrs
 * Ejemplo:  8:45 AM -> 8:45 | 8:45 PM -> 20:45
 * @param {string} fecha12hrasAmPm 
 */
function convertirAFormato24hras(fecha12hrasAmPm) {
    fecha12hrasAmPm = $.trim(fecha12hrasAmPm.toUpperCase());
    let d = new Date("1/1/2020 " + fecha12hrasAmPm),
        minutos = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    return d.getHours() + ':' + minutos;
}

function calcularMinutosEntreHoras(horaInicial, horaFinal) {
    let retorno = "";
    horaInicial = totalDeMinutosHora(horaInicial);
    horaFinal = totalDeMinutosHora(horaFinal);

    if (horaInicial < horaFinal) {
        retorno = horaFinal - horaInicial
    } else {
        retorno = "";
    }

    return retorno;
}

/*Funcion para obtener los minutos totales... 10:30=630 minutos*/
function totalDeMinutosHora(hora) {
    return (parseInt(hora.split(":")[0]) * 60) + parseInt(hora.split(":")[1]);
}

/**
 * @param {string} fechaInicial -> formtato dd-mm-aaaa
 * @param {string} FechaFinal -> formtato dd-mm-aaaa
 */
function calcularMinutosEntreFechas(fechaInicial, FechaFinal_o_Actual) {
    let esInferior = moment(fechaInicial).isBefore(FechaFinal_o_Actual);
    if (esInferior) {
        FechaFinal_o_Actual = new Date(FechaFinal_o_Actual);
        fechaInicial = new Date(fechaInicial);

        let diffMs = (fechaInicial - FechaFinal_o_Actual); // milliseconds between now & Christmas
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        alert(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");
    }
}

/*https://codeseven.github.io/toastr/demo.html*/
function muestraNotificacion(Mensaje = '', tipo = 1, titulo = '') {
    if (!toastr.options.hasOwnProperty('closeButton')) {
        toastr.options = {
            "closeButton": true,
            "debug": true,
            "newestOnTop": true,//muestra la notificacion mas reciente en la parte inferior
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": true,//previene que se muestren notificaciones duplicadas
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "15000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    if (Mensaje) Mensaje = Mensaje.toLowerCase()

    switch (tipo) {
        case 1:
            toastr.info(Mensaje);
            break;
        case 2:
            toastr.success(Mensaje);
            break;
        case 3:
            toastr.warning(Mensaje, titulo);
            break;
        case 4:
            toastr.error(Mensaje, titulo);
            break;
    }
}

function EliminarEnSessionStorage(key) {
    if (ValidaSessionStorage()) {
        localStorage.removeItem(key);
    }
}

function ValidaSessionStorage() {
    if (typeof (Storage) !== 'undefined') {
        return true;
    } else {
        mostrarError("Atención", "SessionStorage no compatible con el navegador");
        return false;
    }
}

/**
 * Despliega la vista tipo modal.
 * @param {string} IdElemento Id del modal.
 */
function AbrirModal(IdElemento) {
    modalShow("#" + IdElemento);
}

/**
 * Oculta el modal de la vista del usuario.
 * @param {string} IdElemento Id del modal.
 */
function OcultarModal(IdElemento) {
    modalHide("#" + IdElemento);
}

/**
 * 
 * @param {string} CadenaOriginal Cadena de donde buscará las coincidencia.
 * @param {*} textoBuscar 
 * @param {*} textoNuevo 
 * @returns 
 */
async function ReemplazarTodosLosCaracteres(CadenaOriginal, textoBuscar, textoNuevo) {
    do {
        CadenaOriginal = CadenaOriginal.replace(textoBuscar, textoNuevo);
    } while (CadenaOriginal.indexOf(textoBuscar) >= 0);

    return CadenaOriginal
}

/**
 * @param {string} Fecha1 Formato YYYY/MM/DD
 * @param {string} Fecha2 Formato YYYY/MM/DD
 * @returns {array} Retorna un arreglo [Dias, Horas, Minutos, Segundos]
 */
function fnDiferenciaEntreFechas(Fecha1, Fecha2) {

    var date1 = new Date(Fecha1);
    var date2 = new Date(Fecha2);

    var diff = (date2 - date1) / 1000;
    var diff = Math.abs(Math.floor(diff));

    var days = Math.floor(diff / (24 * 60 * 60));
    var leftSec = diff - days * 24 * 60 * 60;

    var hrs = Math.floor(leftSec / (60 * 60));
    var leftSec = leftSec - hrs * 60 * 60;

    var min = Math.floor(leftSec / (60));
    var leftSec = leftSec - min * 60;

    return [days, hrs, min, leftSec]

    //document.getElementById("showTime").innerHTML = "You have " + days + " days " + hrs + " hours " + min + " minutes and " + leftSec + " seconds before death.";
}

function RegresarOptionsEntradas() {
    let retorno = `<option value='0'>Ninguno</option>`;
    for (let i = 1; i <= 32; i++) {
        retorno += `<option value='${i}'>${i}</option>`;
    }
    return retorno;
}

function inicializaPopovers() {
    $('[data-toggle="popover"]').popover()
}

//Inicializa el tooltip y cuando se haga click quita el foco para que no quede visible
function inicializaTooltip() {
    $('[data-toggle="tooltip"]').tooltip().click(function (e) {
        $(this).blur();
    });
}

function ObtenerValoresMultiselect(id) {
    let controlSelect = $('#' + id + ' option:selected');
    if (controlSelect.length > 0) {
        let valores = "";
        let cont = 0;
        $('#' + id + ' option:selected').each(function () {
            if (cont == 0) {
                valores = $(this).val()
            }
            else {
                valores += '|' + $(this).val();
            }
            cont++;
        });
        return valores;
    }
    else {
        return '';
    }
}

async function setValueSelectPickerMultiple(el, values = []) {
    $(el).selectpicker('val', values)
}

/**
 * @description Inicializa un cbo con opciones
 * @param {string} Cbo nombre del ID o Clase de Cbo
 * @param {int} TotalLista es el tamaño del array en length 
 * @param {int} tamanio numero de elementos a mostrar en el combo
 * @param {string} placeholder texto que se visualiza en el campo de texto para buscar en las opciones dentro del cbo.
 */
function SelectPickerConfigVacio(Cbo, TotalLista = 0, tamanio = 8, placeholder = 'Buscar en esta lista...'){
    setTimeout(() => {
        creaSelectPicker(Cbo, tamanio, placeholder);
        setValueSelectPicker(Cbo);
        if(TotalLista > 0){
            EnableSelectPicker(Cbo);
        } else {
            DisabledSelectPicker(Cbo);
        }
    }, 100);    
}

function SelectPickerConfigConValorInicial(Cbo, value, TotalLista, tamanio = 8, placeholder = 'Buscar en esta lista...'){
    setTimeout(() => {
        creaSelectPicker(Cbo, tamanio, placeholder);
        if(TotalLista > 0){
            setValueSelectPicker(Cbo, value);
            EnableSelectPicker(Cbo);
        } else {
            setValueSelectPicker(Cbo, '');
            DisabledSelectPicker(Cbo);
        }
    }, 100);
}

/**
 * Habilita el elemento Select.
 * @param {string} elemento Id o clase del elemento.
 */
function EnableSelectPicker(elemento){
    let el = $(elemento);
    if(el.length > 0){
        if(el.is(':disabled')){
            $(el).prop('disabled', false);
            $(el).selectpicker('refresh');
        }
    }
}

/**
 * Deshabilita el control Select.
 * @param {string} elemento Id o clase del elemento.
 */
function DisabledSelectPicker(elemento){
    let el = $(elemento);
    if(el.length > 0){
        if(!el.is(':disabled')){
            $(el).prop('disabled', true);
            $(el).selectpicker('refresh');
        }
    }
}

/**
 * 
 * @param {string} horaHMS Ejemplo: 14:22:32
 * @returns Retorno la cantidad de segundos que tiene la hora del parametro
 */
function ConvertirHoras_a_Segundos(horaHMS) {
    let hora = horaHMS.split(":"),
        s = new Date();

    s.setHours(hora[0], hora[1], hora[2]);
    let hours = s.getHours(),
        minutos = s.getMinutes(),
        segundos = s.getSeconds(),
        segundosTotales = (hours * 3600) + (minutos * 60) + segundos;
    return segundosTotales;
}

/**
 * Valida que la tecla precionada sean solo numeros enteros
 * @param {*} e Event
 * @returns booleanom para indicar si es o no un numero entero
 */
function SoloNumerosEnteros(e){
    let key = e.keyCode || e.which,
        tecla = String.fromCharCode(key).toLowerCase(),
        numeros = "0123456789",
        especiales = [8,37,39];

    const EsTeclaEspecial = especiales.includes(key);

    if(numeros.indexOf(tecla)==-1 && !EsTeclaEspecial){
        return false;
    }
}

const IS_ONLINE = () => {
    return navigator.onLine
}

const BorrarDatosDeLaSesionActual = async () => {
    sessionStorage.removeItem('DatosSesion');
    sessionStorage.removeItem('SessionUserConfig');
}

const MostrarNoAutorizado = () => {
    BorrarDatosDeLaSesionActual();
    window.top.location.href = '../../../FrmNoAutorizado.html';
}
const MostrarScreenSinProceso = () => {
    BorrarDatosDeLaSesionActual();
    window.top.location.href = '../../../Emply.html';
}

/**
 * Devuelve los datos del usuario, como el nombre, Empresa. etc
 * @returns Objeto o null
 */
const ObtenerDatosUsuarioSession = () => {
    try {
        const DATOS_SESION = JSON.parse(sessionStorage.getItem('DatosSesion'));
        if(typeof(DATOS_SESION) !== 'object'){
            return null;
        }

        return {
            NombreUsuario : DATOS_SESION.NombreUsuario,
            Empresa : DATOS_SESION.Empresa
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @param {string} StringVal Cadena 
 * @returns True si cumple con las condiones de estar vacio, nulo, undefined
 */
function IsNullOrEmpty(StringVal){
    let tipo = typeof(StringVal),
        retorno = false;

    if(StringVal === null || StringVal === undefined){
        return true;
    }

    if(tipo == "undefined" || tipo == "null"){
        retorno = true;
    } else if(tipo == "string" || tipo == "number") {
        if(StringVal.toString().trim() == ""){
            retorno = true;
        }
    }

    return retorno;
}

/**
 * @description Regresa la url principal
 * @returns {string} 
 */
const GetBaseUrl = () => {
    if (document.location.host.includes("localhost") || document.location.pathname.startsWith("/Formas")) {
        return document.location.protocol + '//' + document.location.host
    } else {
        return document.location.protocol + '//' + document.location.host + "/" + document.location.pathname.replace("/", "").split("/")[0];
    }
}

/**
 * @description Convierte la fecha al formato MM/DD/YYYY
 * @param {string} strFecha Fecha a convertir, Ejemplo: 08/Diciembre/2020
 * @returns {string} 12/08/2020
 */
const ConvierteFechaToFormato_MM_DD_YYYY = (strFecha) => {
    let fechaRetorno = "";
    try {
        let split = strFecha.split('/');
        if(split.length === 3){
            let dia = split[0],
                mes = split[1],
                anio = split[2];

            let index = MesesEsp.findIndex(l => l == mes);

            if(index >= 0){
                let NumeroMes = index + 1;
                NumeroMes = NumeroMes < 10 ? '0' + NumeroMes : NumeroMes;
                fechaRetorno = `${NumeroMes}/${dia}/${anio}`;
            }
        }
    } catch (error) {
        console.log("ConvierteFormatoFecha_MM_DD_YYYY => ", error);
    }
    return fechaRetorno;
}
/**
 * @description Convierte la fecha al formato DD/MM/YYYY
 * @param {string} strFecha Fecha a convertir, Ejemplo: 08/Diciembre/2020
 * @returns fecha convertida -> 08/12/2020
 */
const ConvierteFechaToFormato__DD_MM_YYYY = (strFecha, separadorDeRetorno = '/') => {
    let fechaRetorno = "";
    try {
        let split = strFecha.split('/');
        if(split.length === 3){
            let dia = split[0],
                mes = split[1],
                anio = split[2];

            let index = MesesEsp.findIndex(l => l == mes);

            if(index >= 0){
                let NumeroMes = index + 1;
                NumeroMes = NumeroMes < 10 ? '0' + NumeroMes : NumeroMes;
                fechaRetorno = dia + separadorDeRetorno + NumeroMes + separadorDeRetorno + anio;
            }
        }
    } catch (error) {
        console.log("ConvierteFechaToFormato__DD_MM_YYYY => ", error);
    }
    return fechaRetorno;
}

/**
 * Retorna la fecha en formato yyyy-mm-dd. Ejemplo: 12/Abril/2023 -> 2023-04-12
 * @param {*} strFecha 
 * @param {*} separadorDeRetorno 
 * @returns 
 */
const ConvierteFechaToFormato_YYYY_MM_DD = (strFecha, separadorDeRetorno = '-') => {
    let fechaRetorno = "";
    try {
        let split = strFecha.split('/');
        if(split.length === 3){
            let dia = split[0],
                mes = split[1],
                anio = split[2];

            let index = MesesEsp.findIndex(l => l == mes);

            if(index >= 0){
                let NumeroMes = index + 1;
                NumeroMes = NumeroMes < 10 ? '0' + NumeroMes : NumeroMes;
                fechaRetorno = anio + separadorDeRetorno + NumeroMes + separadorDeRetorno + dia;
            }
        }
    } catch (error) {
        console.log("ConvierteFechaToFormato_YYYY_MM_DD => ", error);
    }
    return fechaRetorno;
}

/**
 * @returns regresa la fecha y hora actual, con formato yyyy-mm-ddThh:mm:ss
 */
const ObtenerFechaYhoraActual = () => {
    const HOY = getFechaActual('-', true);
    const d = new Date();
    let hora = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
        minutos = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        segundos = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    
    return `${HOY}T${hora}:${minutos}:${segundos}`;
}

/**
 * @description Genera el efecto collapse en el CardWidget
 * @param {string} ElWidget Es el elemento id o clase del CardWidget
 */
const WidgetCollapse = (ElWidget) =>{
    $(ElWidget).CardWidget('collapse')
}
/**
 * @description Genera el efecto Expand en el CardWidget y muestra el contenido del body
 * @param {string} ElWidget Es el elemento id o clase del CardWidget
 */
const WidgetExpand = (ElWidget) =>{
    $(ElWidget).CardWidget('expand')
}
const ToastSwal = (Icono = 'success', Titulo = 'MySapWeb', Posicion = 'top-end', TiempoSegundos = 15) => {
    const Milisegundos = esNumeroMayorQueCero(TiempoSegundos) ? Number(TiempoSegundos) * 1000 : 10000;
    const Toast = Swal.mixin({
        toast: true,
        position: Posicion,
        showConfirmButton: false,
        timer: Milisegundos,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        willClose: (toast) => {
            toast.removeEventListener('mouseenter', Swal.stopTimer)
            toast.removeEventListener('mouseleave', Swal.resumeTimer)
        }
    });
      
    Toast.fire({
        icon: Icono,
        title: Titulo.trim()
    });
}
/**
 * Visualmente quita el color rojo del combo y regresa sus valores al estado original.
 * @param {string} Cbo Id o clase del combo.
 */
const LimpiaSelectPicker = (Cbo) => {
    buttonSelectValid(Cbo);
    setValueSelectPicker('#' + Cbo);
}

/**
 * 
 * @param {string} fInicio Fecha de inicio
 * @param {string} fFin FechaFin
 * @returns regresa true si la fecha de inicio es menor ala fecha final, de lo contrario regresa false.
 */
const fechaInicioEsMenorQueFechaFin = async (fInicio, fFin) => {
    if(fInicio.includes('/')){
        fInicio = fInicio.split('/');
    } else {
        fInicio = fInicio.split('-');
    }

    fInicio = fInicio.reverse().join('-');
    
    if(fFin.includes('/')){
        fFin = fFin.split('/');
    } else {
        fFin = fFin.split('-');
    }
    fFin = fFin.reverse().join('-');

    return moment(fInicio).isBefore(fFin)
}

/**
 * Convierte cadena de texto a Base64
 * @param {string} text 
 * @returns stringo en formato Base64.
 */
const textToBase64 = async (text) => {
    return btoa(text)
}

/**
 * Convierte una cadena de Base64 a Texto legible.
 * @param {string} base64String 
 * @returns string
 */
function base64ToText(base64String) {
    return atob(base64String);
}

/**
 * Valida que el formato del folio fiscal sea correcto.
 * @param {string} folioFiscal 
 * @returns true si el folio fiscal es correcto, de lo contrario regresa false.
 */
function validarFolioFiscal(folioFiscal) {
    const regex = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;
    return regex.test(folioFiscal);
}

/**
 * Comprueba si una cadena cualquiera es una fecha real.
 * Usa la libreria momentJ
 * @param {string} cadena 
 * @param {string} formato por default es YYYY-MM-DD
 * @returns true si es una fecha real, de lo contrario retorna false.
 */
function esFechaValida(cadena, formato = "YYYY-MM-DD") {
    return moment(cadena, formato, true).isValid();
}

/**
 * // Array de horas ("00" a "23")
 * @returns 
 */
const retornarHorasArrayFormat24 = () => {
    let horas = [];
    for (let i = 0; i < 25; i++) {
        // Formato "00" a "09"
        const hora = i.toString().padStart(2, '0');
        horas.push(hora);
    }
    return horas;
}

/**
 * Array de minutos ("00" a "59")
 * @returns 
 */
const retornarMinutosArray = () => {
    const minutos = [];
    for (let i = 0; i < 60; i++) {
    const minuto = i.toString().padStart(2, '0'); // Formato "00" a "09"
    minutos.push(minuto);
    }
    return minutos;
}

/*#region Mapa de Relaciones*/
const ContruirMapaDeRelaciones = async (miTipo, docNum) => {
    let Obj = {
        Titulo         : `Relacion de ${miTipo} con folio: ${docNum}`,
        miEntrega      : null,
        miFactura      : null,
        miOrden        : null,
        listaFactura   : [],
        listaOrdenVenta: [],
        listaEntrega   : []
    }

    let Query = "";
        
    try {
        const NombreTabla = await laTabla(miTipo);
        switch (miTipo) {
            case "Factura":
                Obj.miFactura = await miTipoObjeto(docNum, NombreTabla);
                if(!Obj.miFactura){
                    throw 'miFactura es nullo.'
                }

                if(!IsNullOrEmpty(Obj.miFactura.BaseEntry))
                {
                    if(!esNumeroMayorQueCero(Obj.miFactura.BaseType))
                    {
                        throw 'BaseType no es es mayor que cero.'
                    }
                    Query = await elQueryAtras(Obj.miFactura.BaseEntry, Obj.miFactura.BaseType);
                    let res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                    if(res && res.Valido && res.Datos.length > 0)
                    {
                        Obj.listaEntrega = res.Datos;

                        Obj.listaEntrega.forEach( async it => {
                            if(!IsNullOrEmpty(it.BaseEntry))
                            {
                                if(!esNumeroMayorQueCero(it.BaseType))
                                {
                                    throw 'BaseType no es es mayor que cero.'
                                }
                                Query = await elQueryAtras(it.BaseEntry, it.BaseType);
                                res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                                if(res && res.Valido && res.Datos.length > 0)
                                {
                                    Obj.listaOrdenVenta = res.Datos;
                                }
                            }
                        });

                        Obj.listaOrdenVenta.forEach(async it => {
                            Query = await elQueryAdelante(it.DocEntry, it.ObjType);
                            res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                            if(res && res.Valido && res.Datos.length > 0)
                            {
                                Obj.listaEntrega.push(res.Datos);
                            }
                        });

                        Obj.listaEntrega.forEach(async it2 => {
                            if(!IsNullOrEmpty(it2.DocEntry))
                            {
                                Query = await elQueryAdelante(it2.DocEntry, it2.ObjType);
                                res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                                if(res.Valido){
                                    const r = res.Datos;
                                    if(r.length > 0){
                                        if(Obj.listaFactura.length <= 0){
                                            Obj.listaFactura = r;
                                        } else {
                                            Obj.listaFactura = Obj.listaFactura.concat(r);
                                        }
                                    } else {
                                        console.warn('r.length no es mayor a cero en <<listaEntrega>>')
                                    }
                                } else {
                                    console.warn('res no valido en el for de <<listaEntrega>>')
                                }
                            }
                        })
                    }
                }

                break;
            case "Entrega":
                Obj.miEntrega = await miTipoObjeto(docNum, NombreTabla);
                if(!Obj.miEntrega){
                    throw 'miEntrega es nullo.'
                }
                
                if(!IsNullOrEmpty(Obj.miEntrega.BaseEntry))
                {
                    if(Obj.miEntrega.BaseType != 13)
                    {
                        if(!esNumeroMayorQueCero(Obj.miEntrega.BaseType))
                        {
                            throw 'BaseType no es es mayor que cero.'
                        }
                        Query = await elQueryAtras(Obj.miEntrega.BaseEntry, Obj.miEntrega.BaseType);
                        let res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                        if(res && res.Valido && res.Datos.length > 0)
                        {
                            Obj.listaOrdenVenta = res.Datos;
                            //Obtener la Entrega
                            const it = Obj.listaOrdenVenta[Obj.listaOrdenVenta.length - 1];
                            Query = await elQueryAdelante(it.DocEntry, it.ObjType);
                            res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                            if(res && res.Valido && res.Datos.length > 0)
                            {
                                Obj.listaEntrega = res.Datos;

                                //Obtener las Facturas
                                for (let i = 0; i < Obj.listaEntrega.length; i++)
                                {
                                    const it2 = Obj.listaEntrega[i];
                                    Query = await elQueryAdelante(it2.DocEntry, it2.ObjType);
                                    res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                                    if(res.Valido){
                                        const r = res.Datos;
                                        if(r.length > 0){
                                            if(Obj.listaFactura.length <= 0){
                                                Obj.listaFactura = r;
                                            } else {
                                                Obj.listaFactura = Obj.listaFactura.concat(r);
                                            }
                                        } else {
                                            console.warn('r.length no es mayor a cero en <<listaEntrega>>')
                                        }
                                    } else {
                                        console.warn('res no valido en el for de <<listaEntrega>>')
                                    }
                                }
                            } else {
                                console.warn('No hay datos para mostrar <<listaEntrega>>')
                            }
                        } else {
                            console.warn('No hay datos para mostrar <<Orden de Ventas>>')
                        }
                    } else {
                        Query = await elQueryAdelante(Obj.miEntrega.BaseEntry, Obj.miEntrega.BaseType);

                        if(IsNullOrEmpty(Query)){
                            throw 'El query de elQueryAdelante es nulo.'
                        }

                        const res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                        if(!res){
                            throw 'La peticion POST regreso nulo'
                        }
                        if(res.Valido){
                            Obj.listaFactura = res.Datos;
                        } else {
                            throw res.Mensaje;
                        }
                    }
                } else {
                    Query = await elQueryAdelante(Obj.miEntrega.DocEntry, Obj.miEntrega.ObjType);

                    if(IsNullOrEmpty(Query)){
                        throw 'El query de elQueryAdelante es nulo.'
                    }

                    const res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                    if(!res){
                        throw 'La peticion POST regreso nulo'
                    }
                    if(res.Valido){
                        Obj.listaFactura= res.Datos;
                    } else {
                        throw res.Mensaje;
                    }
                }

                break;
            case 'OrdenVenta':
                Obj.miOrden = await miTipoObjeto(docNum, NombreTabla);
                if(!Obj.miOrden){
                    throw 'miOrden es nullo.'
                }

                if(!IsNullOrEmpty(Obj.miOrden.TrgetEntry))
                {
                    if(Obj.miOrden.TargetType == 13)
                    {
                        Query = await elQueryAdelante(Obj.miOrden.TrgetEntry, Obj.miOrden.TargetType);
                        res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                        if(res && res.Valido && res.Datos.length > 0)
                        {
                            Obj.listaFactura = res.Datos;

                            for (let i = 0; i < Obj.listaFactura.length; i++) {
                                const item = Obj.listaFactura[i];
                                if(!esNumeroMayorQueCero(item.TargetType)){
                                    throw 'TargetType no es es mayor que cero.'
                                }
                                Query = await elQueryAtras(item.TrgetEntry, item.TargetType);
                                res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                                if(res.Valido){
                                    const r = res.Datos;
                                    if(r.length > 0){
                                        if(Obj.listaEntrega.length <= 0){
                                            Obj.listaEntrega = r;
                                        } else {
                                            Obj.listaEntrega = Obj.listaEntrega.concat(r);
                                        }
                                    } else {
                                        console.warn('r.length no es mayor a cero en <<listaEntrega>>')
                                    }
                                } else {
                                    console.warn('res no valido en el for de <<listaEntrega>>')
                                }
                            }
                        }
                    }
                    else if(Obj.miOrden.TargetType == 15)
                    {
                        Query = await elQueryAdelante(Obj.miOrden.DocEntry, Obj.miOrden.ObjType);
                        res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                        if(res && res.Valido && res.Datos.length > 0)
                        {
                            Obj.listaEntrega = res.Datos;

                            for (let i = 0; i < Obj.listaEntrega.length; i++) {
                                const it2 = Obj.listaEntrega[i];
                                Query = await elQueryAdelante(it2.DocEntry, it2.ObjType);
                                res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
                                if(res.Valido){
                                    const r = res.Datos;
                                    if(r.length > 0){
                                        if(Obj.listaFactura.length <= 0)
                                        {
                                            Obj.listaFactura = r;
                                        } 
                                        else
                                        {
                                            Obj.listaFactura = Obj.listaFactura.concat(r);
                                        }
                                    }
                                    else
                                    {
                                        console.warn('r.length no es mayor a cero en <<listaFactura>>')
                                    }
                                } 
                                else 
                                {
                                    console.warn('res no valido en el for de <<listaFactura>>')
                                }
                            }
                        }
                    }
                }

                break;
            default:
                break;
        }
    } catch (error) {
        Obj = null;
        console.error(`ContruirMapaDeRelaciones => ${error}`);
    }
    return Obj;
}

const laTabla = async (elTipo) => {
    let resultado = "";
    switch (elTipo)
    {
        case "Factura":
            resultado = "OINV";
            break;
        case "Entrega":
            resultado = "ODLN";
            break;
        case "OrdenVenta":
            resultado = "ORDR";
            break;
        case "Solicitud":
            resultado = "OWTQ";
            break;
        case "Transferencia":
            resultado = "OWTR";
            break;
        default:
            resultado = null;
            break;
    }
    return resultado;
}

const miTipoObjeto = async (DocNum, NombreTabla) => {
    let retorno = null;
    try {
        const Query = 
            `SELECT T1.DocEntry,T1.ObjType,T1.DocNum,T0.BaseType,T0.BaseEntry,T0.TrgetEntry,
            T0.TargetType,T1.DocTotal,T1.DocStatus,T1.CANCELED,T1.CardCode,T1.CardName
            FROM ${NombreTabla} T1 
            INNER JOIN ${NombreTabla.replace("O", "")}1 T0 on T0.docentry=T1.docentry 
            WHERE T1.Docnum=${DocNum}`

        const res = await PeticionPostAxios('Utiles/SelectAll', { sQuery : Query});
        if(!res){
            throw MsjError.post_null
        }
        if(res.Valido){
            if(res.Datos.length > 0){
                retorno = res.Datos[0];
            } else {
                throw 'No hay datos disponibles.'
            }
        }
    } catch (error) {
        console.error(`miTipoObjeto => ${error}`);
        retorno = null;
    }
    return retorno;
}

const elQueryAtras = async (DocEntry, ObjType) => {
    let query = "";
    try {
        query += "select distinct(T1.DocEntry),T1.ObjType,T1.DocNum,T0.BaseType,T0.BaseEntry,T0.TrgetEntry,T0.TargetType,T1.DocTotal,T1.DocStatus,T1.CANCELED,T1.CardCode,T1.CardName from ";
        if(ObjType == 17){
            //Busca Entrega en ORDR
            query += "RDR1 T0 inner join ORDR T1 on T1.docentry=T0.docentry ";
        } else if(ObjType == 13 || ObjType == 15){
            //Busca Facturas en ODLN
            query += "DLN1 T0 inner join ODLN T1 on T1.docentry=T0.docentry ";
        }
        query += `where T0.DocEntry=${DocEntry} AND T0.ObjType=${ObjType}`
    } catch (error) {
        query = "";
        console.error(`elQueryAtras => ${error}`);
    }
    return query;
}

const elQueryAdelante = async (DocEntry, ObjType) => {
    let query = "";
    try {
        query += "select distinct(T1.DocEntry),T1.ObjType,T1.DocNum,T0.BaseType,T0.BaseEntry,T0.TrgetEntry,T0.TargetType,T1.DocTotal,T1.DocStatus,T1.CANCELED,T1.CardCode,T1.CardName from ";
        if(ObjType == 17){
            //Busca orden de venta en ODLN
            query += "DLN1 T0 inner join ODLN T1 on T1.docentry=T0.docentry ";
        } else if(ObjType == 13 || ObjType == 15){
            //Busca Entregas en OINV
            query += "INV1 T0 inner join OINV T1 on T1.docentry=T0.docentry ";
        }

        if(ObjType != 13){
            query += `WHERE T0.BaseEntry=${DocEntry} AND T0.BaseType=${ObjType}`
        } else {            
            query += `where T0.DocEntry=${DocEntry} AND T0.ObjType=${ObjType}`
        }
    } catch (error) {
        query = "";
        console.error(`elQueryAdelante => ${error}`);
    }
    return query;
}

function tipoObjeto(eltipo, numero = false) {
    try {
      let resultado = "";
      if (!numero) {
        switch (eltipo) {
          case "Factura":
            resultado = "13";
            break;
          case "Entrega":
            resultado = "15";
            break;
          case "OrdenVenta":
            resultado = "17";
            break;
          case "Solicitud":
            resultado = "1250000001";
            break;
          case "Transferencia":
            resultado = "67";
            break;
          default:
            resultado = null;
            break;
        }
      } else {
        switch (eltipo) {
          case "13":
            resultado = "Factura";
            break;
          case "15":
            resultado = "Entrega";
            break;
          case "17":
            resultado = "OrdenVenta";
            break;
          case "1250000001":
            resultado = "Solicitud";
            break;
          case "67":
            resultado = "Transferencia";
            break;
          default:
            resultado = null;
            break;
        }
      }
      return resultado;
    } catch (error) {
      console.error("Error en la función tipoObjeto:", error);
      return null;
    }
}  

function RetornaNombreNodo(DocNum, objDoc){
    let NewNode = null;
    try {
        let estado = '';
        if(objDoc.DocStatus.trim() === "C"){
            estado = '<span class="text-orange">Cerrado</span>';
        } else if(objDoc.DocStatus.trim() === "O"){
            estado = '<span class="text-primary">Abierto</span>';
        } else {
            estado = 'Otro';
        }

        if(objDoc.CANCELED.trim() === "Y"){
            estado += ' <span class="text-muted">|</span> <ate>Cancelada</ate>';
        }

        const DocTotal = (Number(objDoc.DocTotal)).toFixed(2);
        const NombreCliente = `<span class="text-muted">${RetornaStringConLetraCapital(objDoc.CardName)}</span>`;

        NewNode = `<strong>${DocNum}</strong> (${estado}, $ ${formatoNumeroMiles(DocTotal)}) > ${NombreCliente}`
    } catch (error) {
        NewNode = null;
        console.error(`RetornaNombreNodo => ${error}`);
    }
    return NewNode;
}

/*#endregion Mapa de Relaciones*/

const copiarAlPortapapeles = async (texto) => {
    let copiado = false;
    try {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('Texto copiado al portapapeles');
        copiado = true;
    } catch (error) {
        console.error(`copiarAlPortapapeles => ${error}`);
    }
    return copiado;
}

/**
 * Comprueba si el objeto contiene la propiedad que se le pase por parametro.
 * @param {object} objeto
 * @param {string} clave 
 * @returns true o false
 */
const tienePropiedad = (objeto, clave) => {
    return objeto.hasOwnProperty(clave);
}

/**
 * Recorre las propiedades del objeto, si son valores numericos los suma y retorna el total.
 * @param {object} obj 
 * @returns 
 */
const calcularTotalNotificaciones = (obj) => {
    let total = 0;
    try {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
              // Si la propiedad es un objeto, llamamos recursivamente la función
              total += calcularTotalNotificaciones(obj[key]);
            } else if (typeof obj[key] === 'number') {
              // Si la propiedad es un número, lo sumamos al total
              total += obj[key];
            }
          }
    } catch (error) {
        console.error(`calcularTotalNotificaciones => ${error}`);
    }
    return total;
};

/**
 * Verifica si una variable es un array y que contiene al menos un elemento.
 * @param {Array} _array 
 * @returns True o False
 */
const isArrayWithData = _array => _array && Array.isArray(_array) && _array.length > 0;

/**
 * Valida que una cadena sea un numero y que tenga la cantidad maxima de decimales permitidos.
 * @param {string} valor valor que se va a validar.
 * @param {number} maxDecimales Es la cantidad maxima de decimales permitidos, por default son 3.
 * @returns True si la validacion es correcta y False cuando no se cumple con la condición.
 */
const ValidarDecimales = (valor, maxDecimales = 3) => {
    try {
        // Expresión regular para validar un número con hasta 3 decimales
        const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimales}})?$`);
        
        // Validar si el valor cumple con la expresión regular
        if (regex.test(valor)) {
            return true; // Es un valor válido con hasta 3 decimales
        } else {
            return false; // No es un valor válido o tiene más de 3 decimales
        }
    } catch (error) {
        console.error(`ValidarDecimales => ${error}`);
        return false
    }
}

/**
 * Valida que el texto no tenga palabras antisonantes.
 * Retorna true si el texto esta limpio de esas "palabrotas", de lo contrario retorna false.
 * @param {string} texto 
 * @returns true o false.
 */
const ValidaPalabrasAntisonantes = (texto) => {
    try {
        for (let palabra of palabrasAntisonantes) {
            if (texto.toLowerCase().includes(palabra)) {
                return false; // Comentario no válido
            }
        }
        return true; // Comentario válido
    } catch (error) {
        console.error(`ValidaPalabrasAntisonantes => ${error}`);
        return false;
    }   
}

/**
 * Convierte una cadena a un número si es mayor que cero, de lo contrario retorna 0.
 * @param {string} strValor - La cadena a convertir.
 * @returns {number} El número convertido o 0 si no es mayor que cero.
 */
const convertStringToNumber = (strValor) => {
    try {
        return esNumeroMayorQueCero(strValor) ? Number(strValor) : 0        
    } catch (error) {
        console.error(`convertStringToNumber => ${error}`);
        return 0;
    }
}