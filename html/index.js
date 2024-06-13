const app = new Vue({
    el: '#app',
    data: {
        decimales: 2,
        tabSelected: 'Maíz Blanco',
        isMobil: IS_MOBILE(),
        oValor: null,
        Maiz: {
            Semilla:{
                Unidad: {
                    Valor: '',
                    Error: ''
                }
            },
            Fertilizante: {
                Costo:{
                    Valor: "",
                    Error: ""
                }
            },
            SeguroAgricola: {
                Costo:{
                    Valor: "",
                    Error: ""
                }
            },
            PagoAgua: {
                Costo:{
                    Valor: "",
                    Error: ""
                }
            },
        }
    },
    methods: {
        focusElement: function(element){
            $(element).focus();
        },
        FormatoNumero: function(NumberString = ''){
            try {
                return formatoNumeroMiles(NumberString);                
            } catch (error) {
                console.log(error);
                return "0.00";
            }
        },
        /**
         * Valida que se ingresen solo valores decimales en el campo de texto.
         * @param {*} $event 
         * @param {number} DecimalesAdmitidos 
         */
        SoloDecimales: function($event, DecimalesAdmitidos = 2) {
            try {
                let keyCode = ($event.keyCode ? $event.keyCode : $event.which),
                    el = $($event.target),
                    valor = el.val(),
                    FindPunto = valor.indexOf('.');

                if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || FindPunto != -1)) {
                    $event.preventDefault();
                }

                if(isNaN(DecimalesAdmitidos)){
                    DecimalesAdmitidos = 2;
                }

                if(Number(DecimalesAdmitidos) <= 0){
                    DecimalesAdmitidos = 2;
                }

                const TotalDecimales = !IsNullOrEmpty(valor) && valor.toString().includes(".") ? valor.split('.')[1].length : 0;
                if(valor != null && FindPunto > -1 && (TotalDecimales === DecimalesAdmitidos)){
                    $event.preventDefault();
                }   
            } catch (error) {
                console.error(`SoloDecimales => ${error}`);
            }
        },
        ObtenerCantidadesFile: async function(){
            try {
                MostrarBLoqueo();
                const pathFileJson = "./Contenido/valores.json";
                fetch(pathFileJson)
                .then(response => response.json())
                .then(data => {
                    const oValoresFromFileJson = data;
                    if(!oValoresFromFileJson || typeof(oValoresFromFileJson) !== 'object'){throw 'Los valores son incorrectos.'}
                    this.oValor = $.extend(true, {}, oValoresFromFileJson);
                    this.decimales = esNumeroMayorQueCero(oValoresFromFileJson?.DecimalesAdmitidos) 
                                    ? convertStringToNumber(oValoresFromFileJson.DecimalesAdmitidos)
                                    : 2;
                    console.log(this.oValor);
                    setTimeout(() => {
                        CerrarBloqueo();
                    }, 300);
                })
                .catch(error => {
                    mostrarError(
                        "ALGO SALIO MAL", 
                        "Error al leer los valores de los cultivos. <p class='mb-0'>" + error + "</p>"
                    );
                });
            } catch (error) {
                debugger;
                console.error(`ObtenerCantidadesFile => ${error}`);
                mostrarError("ALGO SALIO MAL", "No es posible obtener los valores iniciales.");
            }
        },
        ValidarUnidadSemillaMaiz: function(){
            const x = this;
            try {
                x.Maiz.Semilla.Unidad.Error = '';
                let value = x.Maiz.Semilla.Unidad.Valor;
                if(value === ""){
                    x.Maiz.Semilla.Unidad.Valor = 0;
                } else if(isNaN(value)){
                    x.Maiz.Semilla.Unidad.Error = 'Solo números.'
                } else {
                    if(!ValidarDecimales(value, x.decimales)){
                        //Si hay mas decimales
                        value = Number(value);
                        x.Maiz.Semilla.Unidad.Valor = value.toFixed(x.decimales);
                    }
                }
            } catch (error) {
                console.error(`ValidarUnidadSemillaMaiz => ${error}`);
                x.Maiz.Semilla.Unidad.Error = 'Error al validar.'
            }
        },
        ValidarCostoFertilizanteMaiz: function(){
            const x = this;
            try {
                x.Maiz.Fertilizante.Costo.Error = '';
                let value = x.Maiz.Fertilizante.Costo.Valor;
                if(value === ""){
                    x.Maiz.Fertilizante.Costo.Valor = 0;
                } else if(isNaN(value)){
                    x.Maiz.Fertilizante.Costo.Error = 'Solo números.'
                } else {
                    if(!ValidarDecimales(value, x.decimales)){
                        //Si hay mas decimales
                        value = Number(value);
                        x.Maiz.Fertilizante.Costo.Valor = value.toFixed(x.decimales);
                    }
                }
            } catch (error) {
                console.error(`ValidarCostoFertilizante => ${error}`);
                x.Maiz.Fertilizante.Costo.Error = 'Error al validar.'
            }
        },
        ValidarCostoSeguroAgricolaMaiz: function(){
            const x = this;
            try {
                x.Maiz.SeguroAgricola.Costo.Error = '';
                let value = x.Maiz.SeguroAgricola.Costo.Valor;
                if(value === ""){
                    x.Maiz.SeguroAgricola.Costo.Valor = 0;
                } else if(isNaN(value)){
                    x.Maiz.SeguroAgricola.Costo.Error = 'Solo números.'
                } else {
                    if(!ValidarDecimales(value, x.decimales)){
                        //Si hay mas decimales
                        value = Number(value);
                        x.Maiz.SeguroAgricola.Costo.Valor = value.toFixed(x.decimales);
                    }
                }
            } catch (error) {
                console.error(`ValidarCostoFertilizante => ${error}`);
                x.Maiz.SeguroAgricola.Costo.Error = 'Error al validar.'
            }
        },
        ValidarCostoPagoAguaMaiz: function(){
            const x = this;
            try {
                x.Maiz.PagoAgua.Costo.Error = '';
                let value = x.Maiz.PagoAgua.Costo.Valor;
                if(value === ""){
                    x.Maiz.PagoAgua.Costo.Valor = 0;
                } else if(isNaN(value)){
                    x.Maiz.PagoAgua.Costo.Error = 'Solo números.'
                } else {
                    if(!ValidarDecimales(value, x.decimales)){
                        //Si hay mas decimales
                        value = Number(value);
                        x.Maiz.PagoAgua.Costo.Valor = value.toFixed(x.decimales);
                    }
                }
            } catch (error) {
                console.error(`ValidarCostoPagoAguaMaiz => ${error}`);
                x.Maiz.PagoAgua.Costo.Error = 'Error al validar.'
            }
        },
    },
    computed: {
        MaizSemillaCosto: function(){
            try {
                const unidad = convertStringToNumber(this.Maiz.Semilla.Unidad.Valor);
                const PrecioSemilla = convertStringToNumber(this.oValor?.MaizBlanco?.PrecioSacoSemilla);
                if(unidad > 0){
                    return unidad * PrecioSemilla
                } else {
                    return 0
                }
            } catch (error) {
                console.log(`MaizSemillaCosto => ${error}`);
                return 0
            }
        }
    },
    mounted: async function (){
        try{
            await this.ObtenerCantidadesFile();
        } catch (error) {
            mostrarError('ERROR AL INICIAR', 'No es posible cargar la aplicación, contacte al administrador del sistema.');
        }
     }
});