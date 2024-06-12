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
 * Verifica si una variable es un array y que contiene al menos un elemento.
 * @param {Array} _array 
 * @returns True o False
 */
const isArrayWithData = _array => _array && Array.isArray(_array) && _array.length > 0;
