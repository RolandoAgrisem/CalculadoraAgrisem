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
 * Valida que una cadena sea un numero y que tenga la cantidad maxima de decimales permitidos.
 * @param {string} valor valor que se va a validar.
 * @param {number} maxDecimales Es la cantidad maxima de decimales permitidos, por default son 3.
 * @returns True si la validacion es correcta y False cuando no se cumple con la condición.
 */
const ValidarDecimales = (valor, maxDecimales = 2) => {
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
 * Verifica si una variable es un array y que contiene al menos un elemento.
 * @param {Array} _array 
 * @returns True o False
 */
const isArrayWithData = _array => _array && Array.isArray(_array) && _array.length > 0;

/**
 * Muestra un mensaje emergente y espera a que el usuario precione aceptar para continuar con la ejecucion del codigo.
 * @param {object} oMensaje {Titulo: '', Mensaje: '', Tipo: ''}
 */
const mostrarAlertaAsync = async (oMensaje) => {
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
    BloqueoSwal(texto, Mensaje);
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
    CerrarBloqueoSwal();
}

const CerrarBloqueoSwal = () => {
    if(Swal.isVisible()){
        Swal.close()
    }
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