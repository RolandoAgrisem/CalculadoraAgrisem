const appMaiz = new Vue({
    el: '#custom-tabs-maiz-blanco',
    data: {
        txtUnidad: 'txt_Unidad_',
        txtCosto: 'txtCosto_',
        decimales: 0,
        TasaInteresAnual: 0,
        isMobil: IS_MOBILE(),
        oValor: null,
        listaDetalles: [],
        oCultivo:{
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
                NumberString = Number(NumberString);
                const partes = NumberString.toFixed(2).split('.'); // Asegurar dos decimales
                partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return partes.join('.');
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

                    x.oValor = $.extend(true, {}, oValoresFromFileJson.MaizBlanco);

                    if(esNumeroMayorQueCero(oValoresFromFileJson.TasaInteresAnual)){
                        const tasaInteresAnualPorcentaje = Number(oValoresFromFileJson.TasaInteresAnual) / 100;
                        x.TasaInteresAnual = tasaInteresAnualPorcentaje > 0 
                                            ? convertStringToNumber(tasaInteresAnualPorcentaje.toFixed(2))
                                            : 0;
                    }

                    x.decimales = esNumeroMayorQueCero(oValoresFromFileJson?.DecimalesAdmitidos) 
                                    ? convertStringToNumber(oValoresFromFileJson.DecimalesAdmitidos)
                                    : 2;

                    console.log(x.oValor);
                    
                    await x.llenarDatos();
                    await x.CalculaIngresoPorHa();
                    await x.CalcularCostoPorRegistro();
                    await x.CalculaTotales();
                    setTimeout(() => { CerrarBloqueo() }, 300);
                })
                .catch(error => {
                    mostrarError(
                        "ALGO SALIO MAL", 
                        "Error al leer los valores de los cultivos. <p class='mb-0'>" + error + "</p>"
                    );
                });
            } catch (error) {
                console.error(`ObtenerCantidadesFile => ${error}`);
                mostrarError("ALGO SALIO MAL", "No es posible obtener los valores iniciales.");
            }
        },
        llenarDatos: async function(){
            const x = this;
            x.listaDetalles = [];
            try {
                x.listaDetalles = x.oValor.Lista.map(item => {
                    item["Id"] = generaIdUnico();
                    return item
                });
            } catch (error) {
                console.log(`llenarDatos => ${error}`)
            }
        },
        CalculaIngresoPorHa: async function(){
            const x = this;
            try {
                x.oValor.IngresoPorHectarea = 0;
                const PrecioTonMaiz = x.oValor?.PrecioTonelada ? convertStringToNumber(x.oValor?.PrecioTonelada) : 0;
                const RendimientoHa = x.oValor?.RendimientoHectarea ? convertStringToNumber(x.oValor?.RendimientoHectarea) : 0;
                const calculo = PrecioTonMaiz * RendimientoHa;
                x.oValor.IngresoPorHectarea = Number(calculo.toFixed(x.decimales));
            } catch (error) {
                console.log(`CalculaIngresoPorHa => ${error}`);
            }
        },
        /**
         * Se dispara despues de llenar la lista de detalles.
         * Verifica si unidad tienen valor por default desde el .json
         * Si tiene valor hace la operacion para poner el valor el el costo.
         * Al final calcula todos los los costos generales.
         */
        CalcularCostoPorRegistro: async function(){
            const x = this;
            try {

                for (let index = 0; index < x.listaDetalles.length; index++) {
                    const item = x.listaDetalles[index];
                    const input = $(`#${x.txtUnidad}${item.Id}`);
                    if(input.length === 0){
                        console.warn(`El input con id (${item.Id}) no existe.`);
                        continue;
                    }                    
                    const valorTxtUnidad = input.attr("data-value");
                    const valorUnidad = parseFloat(valorTxtUnidad);
                    if (!isNaN(valorUnidad)) {
                        const IdInput = input.attr("data-id");
                        if(!IsNullOrEmpty(IdInput)){
                            const oData = x.listaDetalles.find(l => l.Id === IdInput);                            
                            const txtCosto = $(`#${x.txtCosto}${IdInput}`);
                            if(txtCosto.length === 1){
                                let costoCalculado = 0;
                                const Split = oData.calcularCon.split('|');
                                const ultimoValor = Split[Split.length - 1];
                                if(esNumero(ultimoValor)){
                                    if(oData.calcularCon.includes("%")){
                                        costoCalculado = (valorUnidad * Number(ultimoValor)) / 100;
                                    } else {
                                        costoCalculado = valorUnidad * Number(ultimoValor);
                                    }
                                } else {
                                    const propiedad = esNumeroMayorQueCero(x.oValor[ultimoValor]) ? Number(x.oValor[ultimoValor]) : 0;
                                    if(oData.calcularCon.includes("%")){
                                        costoCalculado = (valorUnidad * Number(propiedad)) / 100;
                                    } else {
                                        costoCalculado = valorUnidad * Number(propiedad);
                                    }
                                }
                                if(esNumeroMayorQueCero(costoCalculado)){
                                    txtCosto.val(costoCalculado.toFixed(x.decimales));
                                    /*const costoFormat = x.FormatoNumero(costoCalculado.toFixed(x.decimales));
                                    txtCosto.val(costoFormat.toString());*/
                                } else {
                                    txtCosto.val("");
                                }
                                $(`#${x.txtUnidad}${IdInput}`).val(valorTxtUnidad);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`CalcularCostoPorRegistro => ${error}`);
                throw error;
            }
        },
        ValidarTxtUnidad: async function(idItemMaiz){
            const x = this;
            try {
                if(!idItemMaiz){throw 'El Id del Item Maiz no exite.'}
                const oData = x.listaDetalles.find(l => l.Id === idItemMaiz);
                if(!oData){throw 'No se pudo encontrar el item por el id.'}
                let costoCalculado = 0;
                const txtUnidad = $(`#${x.txtUnidad}${idItemMaiz}`);
                if(txtUnidad.length !== 1){throw 'No hay ningun elemento unidad Maiz con el id:' + idItemMaiz}
                const txtCostoMaiz = $(`#${x.txtCosto}${idItemMaiz}`);
                if(txtCostoMaiz.length !== 1){throw 'No hay ningun elemento Costo Maiz con el id:' + idItemMaiz}

                if(!IsNullOrEmpty(oData.calcularCon)){
                    const Split = oData.calcularCon.split('|');
                    const ultimoValor = Split[Split.length - 1];
                    if(esNumero(ultimoValor)){
                        const valorUnidad = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        if(oData.calcularCon.includes('%')){
                            costoCalculado = (valorUnidad * Number(ultimoValor)) / 100;
                        } else {
                            costoCalculado = valorUnidad * Number(ultimoValor);
                        }
                    } else {
                        const valorUnidad = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        const propiedad = esNumeroMayorQueCero(x.oValor[ultimoValor]) ? Number(x.oValor[ultimoValor]) : 0;
                        if(oData.calcularCon.includes('%')){
                            costoCalculado = (valorUnidad * Number(propiedad)) / 100;
                        } else {
                            costoCalculado = valorUnidad * Number(propiedad);
                        }
                    }
                }
                if(costoCalculado > 0){
                    txtCostoMaiz.val(x.FormatoNumero(costoCalculado.toFixed(x.decimales)));
                } else {
                    txtCostoMaiz.val("");
                }
                await x.CalculaTotales();
            } catch (error) {
                console.error(`ValidarTxtUnidad => ${error}`);
            }
        },
        CalculaTotales: async function(){
            const x = this;
            try {
                x.oCultivo.CostoProduccion = 0;
                x.oCultivo.CostoFinanciero = 0;

                for (let i = 0; i < x.listaDetalles.length; i++) {
                    const item = x.listaDetalles[i];
                    const input = $(`#${x.txtCosto}${item.Id}`);
                    if(input.length === 0){
                        console.warn(`El input con id (${item.Id}) no existe.`);
                        continue;
                    }
                    //debugger;
                    const valorTxtCosto = input.val();
                    const valorLimpio = valorTxtCosto.replace(/[^\d.-]/g, "");//sin comas | 1,343.34 -> 1343.34
                    const totalCosto = parseFloat(valorLimpio);
                    if (!isNaN(totalCosto)) {
                        x.oCultivo.CostoProduccion += totalCosto;
                    }                    
                }

                /*$('.costoMaiz').each(function() {
                    // Obtener el valor del input y convertirlo a número
                    const valor = parseFloat($(this).val());
          
                    // Sumar el valor si es un número válido
                    if (!isNaN(valor)) {
                        x.oCultivo.CostoProduccion += valor;
                    }
                });*/

                if(x.oCultivo.CostoProduccion > 0){
                    const calculo = (x.TasaInteresAnual / 365) * Number(x.oValor.DiasDeRiesgo);
                    const calculoFixed = truncarADecimalesSinRedondear(calculo);
                    x.oCultivo.CostoFinanciero = x.oCultivo.CostoProduccion * calculoFixed;
                }

                await x.RecalcularCostoPorHaMaiz();
                x.RecalcularUtilidadPorHa();
    
            } catch (error) {
                console.log(`CalculaTotales => ${error}`);
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
                const valorActual = esNumeroMayorQueCero(x.oValor[nomPropiedad])
                                ? Number(x.oValor[nomPropiedad])
                                : 0;
                Swal.fire({
                    title: `NUEVO VALOR`,
                    input: x.isMobil ? 'number' : 'text',
                    position: x.isMobil ? 'top' : 'center',
                    html: `<span class="text-muted">El valor actual es ${x.FormatoNumero(valorActual.toFixed(x.decimales))}</span>`,
                    inputPlaceholder: 'Ingresa el total.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#144D2A',
                    cancelButtonColor: '#b0b6bb',
                    reverseButtons: true,
                    focusConfirm: false,
                    showLoaderOnConfirm: true,
                    inputAttributes: {
                        step: 'any' // Permite decimales
                    },
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
                            x.oValor[nomPropiedad] = nuevoTotal.toFixed(x.decimales);

                            if(nomPropiedad === 'RendimientoHectarea'){
                                //Recalcular el ingreso por hectarea
                                const nuevoIngresoPorHa = Number(x.oValor.PrecioTonelada) * Number(x.oValor.RendimientoHectarea);
                                x.oValor.IngresoPorHectarea = nuevoIngresoPorHa.toFixed(x.decimales);
                                await x.validarDependenciasMaiz(x.oValor.IngresoPorHectarea, 'IngresoPorHectarea');
                            }

                            //Verificamos si hay actividades que dependen de dicho valor.
                            const dependencia = x.oValor.Lista.filter(l => l.calcularCon.includes(nomPropiedad));
                            if(dependencia.length > 0){
                                for (let i = 0; i < dependencia.length; i++) {
                                    const item = dependencia[i];
                                    const txtUnidad = $(`#${x.txtUnidad}${item.Id}`);
                                    const txtCostoMaiz = $(`#${x.txtCosto}${item.Id}`);
                                    if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                                        console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                                        continue;
                                    }
                                    const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                                    let nuevoCostoCalculado = 0;
                                    if(item.calcularCon.includes("%")){
                                        nuevoCostoCalculado = (Number(x.oValor[nomPropiedad]) * valorUnidadMaiz) / 100;
                                        } else {
                                        nuevoCostoCalculado = Number(x.oValor[nomPropiedad]) * valorUnidadMaiz;
                                    }
                                    txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                                    await x.CalculaTotales();
                                }
                            }
                            x.RecalcularUtilidadPorHa();
                        }
                    }
                });
            } catch (error) {
                console.error(`editarValorGeneral => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar editar el valor.")
            }
        },
        validarDependenciasMaiz: async function(valor, nomPropiedad){
            const x = this;
            try {
                const dependencia = x.oValor.Lista.filter(l => l.calcularCon.includes(nomPropiedad));
                if(dependencia.length > 0){
                    for (let i = 0; i < dependencia.length; i++) {
                        const item = dependencia[i];
                        const txtUnidad = $(`#${x.txtUnidad}${item.Id}`);
                        const txtCostoMaiz = $(`#${x.txtCosto}${item.Id}`);
                        if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                            console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                            continue;
                        }
                        const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                        let nuevoCostoCalculado = 0;
                        if(item.calcularCon.includes('%')){
                            nuevoCostoCalculado = (Number(valor) * valorUnidadMaiz) / 100;
                            } else {
                            nuevoCostoCalculado = Number(valor) * valorUnidadMaiz;
                        }
                        txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                        await x.CalculaTotales();
                    }
                }
                x.RecalcularUtilidadPorHa();
            } catch (error) {
                console.error(`validarDependencias => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar validar.")
            }
        },
        ObtenerTipoDeCambio: async function(){
            try {
                const urlAPIBanxico = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=d69e1f799d361bba0d721d9d40d85256c563762de87c8daa1a98f6b4c87234dd";
                const response = await fetch(urlAPIBanxico);
                if (response.ok){
                    const data = await response.json();
                    if(data)
                    {
                        const oTipoCambio = data.bmx.series[0].datos[0];
                        if(oTipoCambio){
                            return oTipoCambio
                        } else {
                            return 0
                        }
                    }
                }
            } catch (error) {
                console.error(error)
                return 0;
            }
        },
        editarPrecioTonelada: async function(nomPropiedadPadre){
            const x = this;
            try {
                let oDataLocalStorage;
                const valorActual = esNumeroMayorQueCero(x.oValor.PrecioTonelada)
                                    ? Number(x.oValor.PrecioTonelada)
                                    : 0;

                const FECHA_ACTUAL = fechaActual_yyyy_mm_dd();
                try {

                    //localStorage.removeItem("priceFutureCorn");

                    const oPriceFutureLocal = localStorage.getItem("priceFutureCorn");

                    if(oPriceFutureLocal)
                    {
                        oDataLocalStorage = JSON.parse(oPriceFutureLocal);
                    } 
                    
                    //Validamos que la fecha del registro sea diferente a la actual para obtener de nuevo los datos desde la API.
                    if(!oDataLocalStorage || oDataLocalStorage?.FechaRegistro !== FECHA_ACTUAL)
                    {
                        if(!IsNullOrEmpty(x.oValor.UrlPriceFuture) && !IsNullOrEmpty(x.oValor.BaseDolares) && !isNaN(x.oValor.BaseDolares))
                        {
                            MostrarBLoqueo('Un momento...', 'Obteniendo precio futuro y tipo de cambio.');
                            const response = await fetch(x.oValor.UrlPriceFuture);
                            if (response.ok)
                            {
                                const data = await response.json();
                                const nDate = new Date();
                                const anioFuture = nDate.getFullYear() + 1 + "";
                                //obtener los ultimos 2 digitos de anioFuture
                                const numYearOnly = anioFuture.slice(-2);
                                const julAnioFutureMonth = "JUL " + numYearOnly;
                                const julAnioFuture = `${anioFuture}0701`
                                const quotes = data.quotes.find(l => l.expirationDate == julAnioFuture);
                                if(quotes){
                                    const bushelCornFutures = quotes.last.includes("'") ? Number(quotes.last.replace("'", ".")) : Number(quotes.last);
                                    if(!isNaN(bushelCornFutures))
                                    {
                                        const formula = bushelCornFutures * 0.3936825;
                                        const Base = Number(x.oValor.BaseDolares);
                                        const precioEnDolares = formula + Base;
                                        const oTipoCambio = await x.ObtenerTipoDeCambio();
                                        if(!oTipoCambio || oTipoCambio == 0){
                                            throw 'No fue posible obtener el tipo de cambio.'
                                        }
                                        if(IsNullOrEmpty(oTipoCambio.dato)){
                                            throw 'No hay valor numerico para el tipo de cambio.'
                                        }
                                        const PrecioEnPesos = precioEnDolares * Number(oTipoCambio.dato)
                                        const PrecioEnPesosFix = !isNaN(PrecioEnPesos) ? Number(PrecioEnPesos.toFixed(2)) : 0;

                                        oDataLocalStorage = {
                                            "Bushel" : bushelCornFutures,
                                            "DateBushel" : julAnioFutureMonth,
                                            "Base" : x.oValor.BaseDolares,
                                            "PrecioToneladaMXP": PrecioEnPesosFix,
                                            "TipoCambio": {
                                                "dato": oTipoCambio.dato,
                                                "fecha" : oTipoCambio.fecha
                                            },
                                            "FechaRegistro" : FECHA_ACTUAL
                                        };

                                        localStorage.setItem("priceFutureCorn", JSON.stringify(oDataLocalStorage));
                                    }
                                } else {
                                    localStorage.removeItem("priceFutureCorn")
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(error)
                }

                CerrarBloqueo();

                let inputValue = "",
                    titulo = "PRECIO TONELADA",
                    shtml = 
                        `<p class="text-muted">
                            El valor actual es ${x.FormatoNumero(valorActual.toFixed(x.decimales))}
                        </p>
                        <span class="text-orange text-sm">
                            <i class="fas fa-exclamation-triangle mr-1"></i>No fue posible obtener el precio futuro.
                        </span>`;
                if(oDataLocalStorage){
                    //existe bushel
                    inputValue = oDataLocalStorage.PrecioToneladaMXP;
                    titulo += " FUTURO";
                    shtml = 
                        `<div class="row mx-1">
                            <div class="col-sm-4 border-right">
                                <div class="description-block my-2">
                                    <h5 class="description-header mb-1">${oDataLocalStorage.Bushel}</h5>
                                    <span class="text-sm text-muted">Bushel ${oDataLocalStorage.DateBushel}</span>
                                </div>
                            </div>
                            <div class="col-sm-4 border-right">
                                <div class="description-block my-2">
                                    <h5 class="description-header mb-1">${oDataLocalStorage.Base}</h5>
                                    <span class="text-sm text-muted">Base</span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="description-block my-2">
                                    <h5 class="description-header mb-1">${oDataLocalStorage.TipoCambio.dato}</h5>
                                    <span class="text-sm text-muted">Tipo Cambio</span>
                                </div>
                            </div>
                        </div>`
                }

                Swal.fire({
                    title: titulo,
                    input: x.isMobil ? 'number' : 'text',
                    inputValue,
                    position: x.isMobil ? 'top' : 'center',
                    html: shtml,
                    inputPlaceholder: 'Ingresa el precio por tonelada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#144D2A',
                    cancelButtonColor: '#b0b6bb',
                    reverseButtons: true,
                    focusConfirm: false,
                    showLoaderOnConfirm: true,
                    inputAttributes: {
                        step: 'any' // Permite decimales
                    },
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
                            x.oValor.PrecioTonelada = nuevoTotal.toFixed(x.decimales);
                            const RendimientoPorHa = esNumeroMayorQueCero(x.oValor.RendimientoHectarea)
                                                    ? Number(x.oValor.RendimientoHectarea)
                                                    : 0;

                            //Recalcular el ingreso por hectarea
                            const nuevoIngresoPorHa = Number(x.oValor.PrecioTonelada) * RendimientoPorHa;
                            x.oValor.IngresoPorHectarea = nuevoIngresoPorHa.toFixed(x.decimales);

                            //Verificamos si hay actividades que dependen de IngresoPorHectarea.
                            const dependencia = x.oValor.Lista.filter(l => l.calcularCon.includes('IngresoPorHectarea'));
                            if(dependencia.length > 0){
                                for (let i = 0; i < dependencia.length; i++) {
                                    const item = dependencia[i];
                                    const txtUnidad = $(`#${x.txtUnidad}${item.Id}`);
                                    const txtCostoMaiz = $(`#${x.txtCosto}${item.Id}`);
                                    if(txtUnidad.length !== 1 || txtCostoMaiz.length !== 1){
                                        console.warn("No se encontro el txtunidadMaiz o txtCostoMaiz con id=" + item.Id)
                                        continue;
                                    }
                                    const valorUnidadMaiz = esNumeroMayorQueCero(txtUnidad.val()) ? Number(txtUnidad.val()) : 0;
                                    let nuevoCostoCalculado = 0;
                                    if(item.calcularCon.includes('%')){
                                        nuevoCostoCalculado = (Number(x.oValor.IngresoPorHectarea) * valorUnidadMaiz) / 100;
                                        } else {
                                        nuevoCostoCalculado = Number(x.oValor.IngresoPorHectarea) * valorUnidadMaiz;
                                    }
                                    txtCostoMaiz.val(nuevoCostoCalculado.toFixed(x.decimales));
                                    await x.CalculaTotales();
                                }
                            }
                            x.RecalcularUtilidadPorHa();
                        }
                    }
                });
            } catch (error) {
                console.error(`editarPrecioTonelada => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al intentar editar el valor.")
            }
        },
        RecalcularUtilidadPorHa: function(){
            try {
                //IngresoPorHa - CostoPorHa  
                this.oCultivo.UtilidadPorHa = 0;
                const IngresoPorHa = esNumero(this.oValor.IngresoPorHectarea)
                                    ? Number(this.oValor.IngresoPorHectarea)
                                    : 0;
                if(IngresoPorHa > 0){
                    this.oCultivo.UtilidadPorHa = IngresoPorHa - this.oCultivo.CostoPorHa;
                }
            } catch (error) {
                console.error(`RecalcularUtilidadPorHa => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al recalcular la utilidad por Ha.")
            }
        },
        RecalcularCostoPorHaMaiz: async function(){
            try {
                //La suma de CostoProduccion y Costo Financiero
                this.oCultivo.CostoPorHa = this.oCultivo.CostoProduccion + this.oCultivo.CostoFinanciero
            } catch (error) {
                console.error(`RecalcularCostoPorHaMaiz => ${error}`);
                mostrarError("ALGO SALIO MAL", "Error al recalcular la utilidad por Ha.")
            }
        }
    },
    computed: {
        Rentabilidad: function(){
            const calculo = this.oCultivo.UtilidadPorHa / this.oCultivo.CostoPorHa;
            if(!isNaN(calculo)){
                // Convierte el calculo a porcentaje
                const porcentaje = calculo * 100;
                
                // Redondea el resultado al número de decimales deseado (2 en este caso)
                return Number(porcentaje.toFixed(2))
            } else {
                return 0
            }
        },
        CostoTonelada: function(){
            const RendimientoHaMaiz = this.oValor?.RendimientoHectarea 
                ? convertStringToNumber(this.oValor?.RendimientoHectarea) 
                : 0;

            const calculo = this.oCultivo.CostoPorHa / RendimientoHaMaiz;
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