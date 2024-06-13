const app = new Vue({
    el: '#app',
    data: {
        decimales: 2,
        tabSelected: 'Maíz Blanco',
        isMobil: IS_MOBILE(),
        oValor: null,
        aMaiz: [],
        Maiz:{
            CostoProduccion : 0,
            CostoFinanciero: 0,
            CostoPorHa: 0,
            UtilidadPorHa: 0,
            Rentabilidad: 0,
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
                return "0";
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
            const x = this;
            try {
                MostrarBLoqueo();
                const pathFileJson = "./Contenido/valores.json";
                await fetch(pathFileJson)
                .then(response => response.json())
                .then(async data => {
                    const oValoresFromFileJson = data;
                    if(!oValoresFromFileJson || typeof(oValoresFromFileJson) !== 'object'){throw 'Los valores son incorrectos.'}
                    x.oValor = $.extend(true, {}, oValoresFromFileJson);
                    x.decimales = esNumeroMayorQueCero(oValoresFromFileJson?.DecimalesAdmitidos) 
                                    ? convertStringToNumber(oValoresFromFileJson.DecimalesAdmitidos)
                                    : 2;
                    console.log(x.oValor);
                    
                    await x.llenarDatosMaiz();
                    await x.CalculaIngresoPorHaMaiz();

                    setTimeout(() => { CerrarBloqueo() }, 300);
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
        llenarDatosMaiz: async function(){
            const x = this;
            x.aMaiz = [];
            try {
                const existePropiedad = 'MaizBlanco' in x.oValor;
                if(!existePropiedad){throw 'No existe propiedad MaizBlanco'}

                x.aMaiz = x.oValor.MaizBlanco.Lista.map(item => {
                    item["Id"] = generaIdUnico();
                    return item
                });
            } catch (error) {
                console.log(`llenarDatosMaiz => ${error}`)
            }
        },
        CalculaIngresoPorHaMaiz: async function(){
            const x = this;
            try {
                x.oValor.MaizBlanco.IngresoPorHectarea = 0;
                if('MaizBlanco' in x.oValor){
                    const PrecioTonMaiz = x.oValor?.MaizBlanco?.PrecioTonelada ? convertStringToNumber(x.oValor?.MaizBlanco?.PrecioTonelada) : 0;
                    const RendimientoHaMaiz = x.oValor?.MaizBlanco?.RendimientoHectarea ? convertStringToNumber(x.oValor?.MaizBlanco?.RendimientoHectarea) : 0;
                    const calculo = PrecioTonMaiz * RendimientoHaMaiz
                    x.oValor.MaizBlanco.IngresoPorHectarea = Number(calculo.toFixed(x.decimales));
                }
            } catch (error) {
                console.log(`CalculaIngresoPorHaMaiz => ${error}`);
            }
        },
        ValidarTxtUnidadMaiz: async function(idItemMaiz){
            const x = this;
            try {
                if(!idItemMaiz){throw 'El Id del Item Maiz no exite.'}
                const oData = x.aMaiz.find(l => l.Id === idItemMaiz);
                if(!oData){throw 'No se pudo encontrar el item por el id.'}
                let costoCalculado = 0;
                const txtUnidad = $(`#txt_Unidad_Maiz_${idItemMaiz}`);
                if(txtUnidad.length !== 1){throw 'No hay ningun elemento unidad Maiz con el id:' + idItemMaiz}
                const txtCostoMaiz = $(`#txtCosto_Maiz_${idItemMaiz}`);
                if(txtCostoMaiz.length !== 1){throw 'No hay ningun elemento Costo Maiz con el id:' + idItemMaiz}

                if(!IsNullOrEmpty(oData.calcularCon)){
                    const Split = oData.calcularCon.split('|');
                    const valor3 = Split[2];
                    if(esNumero(valor3)){
                        const valorUnidad = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        if(oData.unidad === "%"){
                            costoCalculado = (valorUnidad * Number(valor3)) / 100;
                        } else {
                            costoCalculado = valorUnidad * Number(valor3);
                        }
                    } else {
                        const valorUnidad = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        const propiedad = esNumeroMayorQueCero(x.oValor.MaizBlanco[valor3]) ? Number(x.oValor.MaizBlanco[valor3]) : 0;
                        if(oData.unidad === "%"){
                            costoCalculado = (valorUnidad * Number(propiedad)) / 100;
                        } else {
                            costoCalculado = valorUnidad * Number(propiedad);
                        }
                    }
                }
                if(costoCalculado > 0){
                    txtCostoMaiz.val(costoCalculado.toFixed(x.decimales));
                } else {
                    txtCostoMaiz.val(0);
                }
                await x.CalculaTotalesMaiz();
            } catch (error) {
                console.error(`ValidarTxtUnidadMaiz => ${error}`);
            }
        },
        CalculaTotalesMaiz: async function(){
            const x = this;
            try {
                x.Maiz.CostoProduccion = 0;
                x.Maiz.CostoFinanciero = 0;

                $('.costoMaiz').each(function() {
                    // Obtener el valor del input y convertirlo a número
                    const valor = parseFloat($(this).val());
          
                    // Sumar el valor si es un número válido
                    if (!isNaN(valor)) {
                        x.Maiz.CostoProduccion += valor;
                    }
                });

                if(x.Maiz.CostoProduccion > 0){
                    x.Maiz.CostoFinanciero = (x.Maiz.CostoProduccion * 0.7) * 0.16;
                }

                await x.RecalcularCostoPorHaMaiz();
                x.RecalcularUtilidadPorHa('MaizBlanco');
            } catch (error) {
                console.log(`CalculaTotalesMaiz => ${error}`);
            }
        },
        setFocusNextElement: function(nameElement, index){
            try {
                //const elemento = $('[data-index="unidad_1"]');
                const nameDataindex = `${nameElement}_${index + 1}`;
                const elemento = $(`[data-index="${nameDataindex}"]`);
                if(elemento.length === 1 && !elemento.is(':disabled')){
                    elemento.focus()
                } else {
                    $(`[data-index="${nameElement}_${index}"]`).blur();
                }
            } catch (error) {
                console.log(`setFocusNextElement => ${error}`)
            }
        },
        editarValorGeneral: async function(nomPropiedad){
            const x = this;
            try {
                const valorActual = esNumeroMayorQueCero(x.oValor?.MaizBlanco[nomPropiedad])
                                ? Number(x.oValor?.MaizBlanco[nomPropiedad])
                                : 0;
                Swal.fire({
                    title: `NUEVO VALOR`,
                    input: 'text',
                    html: `<span class="text-muted">El valor actual es ${x.FormatoNumero(valorActual.toFixed(x.decimales))}</span>`,
                    inputPlaceholder: 'Ingresa el total.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#4088a6',
                    cancelButtonColor: '#b0b6bb',
                    reverseButtons: true,
                    focusConfirm: false,
                    showLoaderOnConfirm: true,
                    preConfirm: async (nuevoTotal) => {
                        if(IsNullOrEmpty(nuevoTotal)){
                            Swal.showValidationMessage("Ingresa el valor.");
                        } else if(isNaN(nuevoTotal)){
                            Swal.showValidationMessage("Cantidad incorrecta, ingresa solo números.");
                        } else if(Number(nuevoTotal) <= 0){
                            Swal.showValidationMessage("La cantidad debe ser mayor a cero.");
                        } else 
                        {
                            nuevoTotal = Number(nuevoTotal);
                            x.oValor.MaizBlanco[nomPropiedad] = nuevoTotal.toFixed(x.decimales);

                            if(nomPropiedad === 'RendimientoHectarea'){
                                //Recalcular el ingreso por hectarea
                                const nuevoIngresoPorHa = Number(x.oValor.MaizBlanco.PrecioTonelada) * Number(x.oValor.MaizBlanco.RendimientoHectarea);
                                x.oValor.MaizBlanco.IngresoPorHectarea = nuevoIngresoPorHa.toFixed(x.decimales);
                                await x.validarDependenciasMaiz(x.oValor.MaizBlanco.IngresoPorHectarea, 'IngresoPorHectarea');
                            }

                            //Verificamos si hay actividades que dependen de dicho valor.
                            const dependencia = x.oValor.MaizBlanco.Lista.filter(l => l.calcularCon.includes(nomPropiedad));
                            if(dependencia.length > 0){
                                for (let i = 0; i < dependencia.length; i++) {
                                    const item = dependencia[i];
                                    const txtUnidad = $(`#txt_Unidad_Maiz_${item.Id}`);
                                    const txtCostoMaiz = $(`#txtCosto_Maiz_${item.Id}`);
                                    if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                                        console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                                        continue;
                                    }
                                    const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                                    let nuevoCostoCalculado = 0;
                                    if(item.unidad === "%"){
                                        nuevoCostoCalculado = (Number(x.oValor.MaizBlanco[nomPropiedad]) * valorUnidadMaiz) / 100;
                                        } else {
                                        nuevoCostoCalculado = Number(x.oValor.MaizBlanco[nomPropiedad]) * valorUnidadMaiz;
                                    }
                                    txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                                    await x.CalculaTotalesMaiz();
                                }
                            }
                            x.RecalcularUtilidadPorHa('MaizBlanco');
                        }
                    }
                });
            } catch (error) {
                console.error(`editarSacoSemillaMaiz => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar editar el valor.")
            }
        },
        validarDependenciasMaiz: async function(valor, nomPropiedad){
            const x = this;
            try {
                const dependencia = x.oValor.MaizBlanco.Lista.filter(l => l.calcularCon.includes(nomPropiedad));
                if(dependencia.length > 0){
                    for (let i = 0; i < dependencia.length; i++) {
                        const item = dependencia[i];
                        const txtUnidad = $(`#txt_Unidad_Maiz_${item.Id}`);
                        const txtCostoMaiz = $(`#txtCosto_Maiz_${item.Id}`);
                        if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                            console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                            continue;
                        }
                        const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        let nuevoCostoCalculado = 0;
                        if(item.unidad === "%"){
                            nuevoCostoCalculado = (Number(valor) * valorUnidadMaiz) / 100;
                            } else {
                            nuevoCostoCalculado = Number(valor) * valorUnidadMaiz;
                        }
                        txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                        await x.CalculaTotalesMaiz();
                    }
                }
                x.RecalcularUtilidadPorHa('MaizBlanco');
            } catch (error) {
                console.error(`validarDependencias => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar validar.")
            }
        },
        editarPrecioTonelada: async function(nomPropiedadPadre){
            const x = this;
            try {
                const valorActual = esNumeroMayorQueCero(x.oValor[nomPropiedadPadre].PrecioTonelada)
                                ? Number(x.oValor[nomPropiedadPadre].PrecioTonelada)
                                : 0;

                Swal.fire({
                    title: `NUEVO VALOR`,
                    input: 'text',
                    html: `<span class="text-muted">El valor actual es ${x.FormatoNumero(valorActual.toFixed(x.decimales))}</span>`,
                    inputPlaceholder: 'Ingresa el nuevo valor',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#4088a6',
                    cancelButtonColor: '#b0b6bb',
                    reverseButtons: true,
                    focusConfirm: false,
                    showLoaderOnConfirm: true,
                    preConfirm: async (nuevoTotal) => {
                        if(IsNullOrEmpty(nuevoTotal)){
                            Swal.showValidationMessage("Ingresa el valor.");
                        } else if(isNaN(nuevoTotal)){
                            Swal.showValidationMessage("Cantidad incorrecta, ingresa solo números.");
                        } else if(Number(nuevoTotal) <= 0){
                            Swal.showValidationMessage("La cantidad debe ser mayor a cero.");
                        } else 
                        {
                            nuevoTotal = Number(nuevoTotal);
                            x.oValor[nomPropiedadPadre].PrecioTonelada = nuevoTotal.toFixed(x.decimales);
                            const RendimientoPorHa = esNumeroMayorQueCero(x.oValor[nomPropiedadPadre].RendimientoHectarea)
                                                    ? Number(x.oValor[nomPropiedadPadre].RendimientoHectarea)
                                                    : 0;

                            //Recalcular el ingreso por hectarea
                            const nuevoIngresoPorHa = Number(x.oValor[nomPropiedadPadre].PrecioTonelada) * RendimientoPorHa;
                            x.oValor[nomPropiedadPadre].IngresoPorHectarea = nuevoIngresoPorHa.toFixed(x.decimales);

                            //Verificamos si hay actividades que dependen de IngresoPorHectarea.
                            const dependencia = x.oValor.MaizBlanco.Lista.filter(l => l.calcularCon.includes('IngresoPorHectarea'));
                            if(dependencia.length > 0){
                                for (let i = 0; i < dependencia.length; i++) {
                                    const item = dependencia[i];
                                    const txtUnidad = $(`#txt_Unidad_Maiz_${item.Id}`);
                                    const txtCostoMaiz = $(`#txtCosto_Maiz_${item.Id}`);
                                    if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                                        console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                                        continue;
                                    }
                                    const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                                    let nuevoCostoCalculado = 0;
                                    if(item.unidad === "%"){
                                        nuevoCostoCalculado = (Number(x.oValor[nomPropiedadPadre].IngresoPorHectarea) * valorUnidadMaiz) / 100;
                                        } else {
                                        nuevoCostoCalculado = Number(x.oValor[nomPropiedadPadre].IngresoPorHectarea) * valorUnidadMaiz;
                                    }
                                    txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                                    await x.CalculaTotalesMaiz();
                                }
                            }
                            x.RecalcularUtilidadPorHa('MaizBlanco');
                        }
                    }
                });
            } catch (error) {
                console.error(`editarPrecioTonelada => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar editar el valor.")
            }
        },
        RecalcularUtilidadPorHa: function(nomPropiedadPadre){
            try {
                //IngresoPorHa - CostoPorHa  
                this.Maiz.UtilidadPorHa = 0;
                const IngresoPorHa = esNumero(this.oValor[nomPropiedadPadre].IngresoPorHectarea)
                                    ? Number(this.oValor[nomPropiedadPadre].IngresoPorHectarea)
                                    : 0;
                if(IngresoPorHa > 0){
                    this.Maiz.UtilidadPorHa = IngresoPorHa - this.Maiz.CostoPorHa;
                }
            } catch (error) {
                console.error(`RecalcularUtilidadPorHa => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al recalcular la utilidad por Ha.")
            }
        },
        RecalcularCostoPorHaMaiz: async function(){
            try {
                //La suma de CostoProduccion y Costo Financiero
                this.Maiz.CostoPorHa = this.Maiz.CostoProduccion + this.Maiz.CostoFinanciero
            } catch (error) {
                console.error(`RecalcularCostoPorHaMaiz => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al recalcular la utilidad por Ha.")
            }
        }
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
        },
        IngresoPorHectareaMaiz: function(){
            const x = this;
            try {
                const PrecioTonMaiz = x.oValor?.MaizBlanco?.PrecioTonelada ? convertStringToNumber(x.oValor?.MaizBlanco?.PrecioTonelada) : 0;
                const RendimientoHaMaiz = x.oValor?.MaizBlanco?.RendimientoHectarea ? convertStringToNumber(x.oValor?.MaizBlanco?.RendimientoHectarea) : 0;
                return PrecioTonMaiz * RendimientoHaMaiz;
            } catch (error) {
                console.log(`IngresoPorHectareaMaiz => ${error}`)
                return 0;
            }
        },
        RentabilidadMaiz: function(){
            const calculo = this.Maiz.UtilidadPorHa / this.Maiz.CostoPorHa;
            if(!isNaN(calculo)){
                // Convierte el calculo a porcentaje
                const porcentaje = calculo * 100;
                
                // Redondea el resultado al número de decimales deseado (2 en este caso)
                return Number(porcentaje.toFixed(2))
            } else {
                return 0
            }
        },
        CostoToneladaMaiz: function(){
            const RendimientoHaMaiz = this.oValor?.MaizBlanco?.RendimientoHectarea 
                ? convertStringToNumber(this.oValor?.MaizBlanco?.RendimientoHectarea) 
                : 0;

            const calculo = this.Maiz.CostoPorHa / RendimientoHaMaiz;
            return !isNaN(calculo) ? calculo : 0
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