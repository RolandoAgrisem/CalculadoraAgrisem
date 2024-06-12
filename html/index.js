const app = new Vue({
    el: '#app',
    data: {
        isMobil: IS_MOBILE(),
        oValor: null,
        oDataMaiz: {
            Semilla:{
                Unidad: ''
            }
        }
    },
    methods: {
        FormatoNumero: function(NumberString = ''){
            try {
                return formatoNumeroMiles(NumberString);                
            } catch (error) {
                console.log(error);
                return "0.00";
            }
        },
        ObtenerCantidadesFile: async function(){
            try {
                const rutaValores = "./Contenido/valores.json";
                let errorAxios = null;
                const res = await axios.get(rutaValores).catch(error => {errorAxios = error; });                
                if (errorAxios) { throw errorAxios } 
                const oValoresFromFileJson = res.data;
                if(!oValoresFromFileJson || typeof(oValoresFromFileJson) !== 'object'){throw 'Los valores son incorrectos.'}
                this.oValor = $.extend(true, {}, oValoresFromFileJson);
                console.log(this.oValor)
            } catch (error) {
                console.error(`ObtenerCantidadesFile => ${error}`);
                mostrarError("ALGO SALIO MAL", "No es posible obtener los valores iniciales.");
            }
        }
    },
    computed: {
        
    },
    mounted: async function (){
        try{
            await this.ObtenerCantidadesFile();
        } catch (error) {
            mostrarError('ERROR AL INICIAR', 'No es posible cargar la aplicación, contacte al administrador del sistema.');
        }
     }
});