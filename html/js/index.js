$(document).ready(function(){
    if(IS_MOBILE()){
        $("#CardTabs").addClass('card-tabs-mobil');
        //$("#TabHeader").hide();
    } else {
        $("#TabFooter").hide();
    }
    CambiarNombreTitulo('Maíz Blanco');
});

async function CambiarNombreTitulo (nombre){
    const NuevoTitulo = `C&aacute;lculo de Utilidad "${nombre}"`;
    $("#Titulo").html(NuevoTitulo);
    if(nombre === "Resumen"){
        await MostrarResumen()
    }
}

/**
 * Consulta y muestra los datos del resumen de cada cultivo.
 */
async function MostrarResumen(){
    try {
        const tabResumen = $("#rowTabResumen");
        tabResumen.html("");

        const Cultivos = ['MaizBlanco', 'Sorgo', 'Garbanzo', 'Frijol'];

        let html = "";
        for (let i = 0; i < Cultivos.length; i++) {
            const item = Cultivos[i];
            const app = item === 'MaizBlanco' ? appMaiz
                        : item === 'Sorgo' ? appSorgo
                        : item === 'Garbanzo' ? appGarbanzo
                        : item === 'Frijol' ? appFrijol
                        : null;

            if(app){

                let tipColor = "success";
                switch (item) {
                    case 'MaizBlanco':
                        tipColor = "success"
                        break;
                    case 'Sorgo':
                        tipColor = "info"
                        break;
                    case 'Garbanzo':
                        tipColor = "warning"
                        break;
                    case 'Frijol':
                        tipColor = "danger"
                        break;
                }

                const CostoTonelada = esNumero(app.CostoTonelada) 
                                    ? app.FormatoNumero(app.CostoTonelada.toFixed(app.decimales))
                                    : 0;

                html += "<div class='col-12 col-sm-12 col-md-6'>";
                
                html += 
                    `<div class="card card-outline card-${tipColor}">
                        <div class="card-header py-1 px-2">
                            <h3 class="card-title font-weight-bold text-${tipColor}">${item}</h3>
                            <div class="card-tools">            
                                <button type="button" class="btn btn-tool" data-card-widget="maximize"><i class="fas fa-expand"></i></button>
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="card-body py-1 px-2">
                            <div class="row">
                                <div class="col-6">
                                    <div class="callout callout-${tipColor}">
                                        <h5 class="mb-0">
                                            $ ${app.FormatoNumero(app.oValor.PrecioSacoSemilla)}
                                        </h5>
                                        <p class="text-muted">Saco de Semilla</p>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="callout callout-${tipColor}">
                                        <h5 class="mb-0">
                                            $ ${app.FormatoNumero(app.oValor.PrecioTonelada)}
                                        </h5>
                                        <p class="text-muted">Precio Tonelada</p>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="callout callout-${tipColor}">
                                        <h5 class="mb-0">
                                            ${app.FormatoNumero(app.oValor.RendimientoHectarea)}
                                        </h5>
                                        <p class="text-muted">Rendimiento por Ha.</p>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="callout callout-${tipColor}">
                                        <h5 class="mb-0">
                                            $ ${app.FormatoNumero(app.oValor.IngresoPorHectarea)}
                                        </h5>
                                        <p class="text-muted">Ingreso por Ha.</p>
                                    </div>
                                </div>
                            </div>

                            <ul class="list-group list-group-unbordered mb-3">
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Costo Producci&oacute;n</span> 
                                    <a class="float-right">
                                        <b class="text-primary">$ ${app.FormatoNumero(app.oCultivo.CostoProduccion.toFixed(app.decimales))} </b>
                                    </a>
                                </li>
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Costo Financiero</span> 
                                    <a class="float-right">
                                        <b class="text-indigo">$ ${app.FormatoNumero(app.oCultivo.CostoFinanciero.toFixed(app.decimales))} </b>
                                    </a>
                                </li>
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Costo por Ha.</span> 
                                    <a class="float-right">
                                        <b class="text-primary">$ ${app.FormatoNumero(app.oCultivo.CostoPorHa.toFixed(app.decimales))} </b>
                                    </a>
                                </li>
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Utilidad por Ha.</span> 
                                    <a class="float-right">
                                        <b class="text-olive">$ ${app.FormatoNumero(app.oCultivo.UtilidadPorHa.toFixed(app.decimales))} </b>
                                    </a>
                                </li>
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Costo Tonelada</span> 
                                    <a class="float-right">
                                        <b class="text-primary">$ ${CostoTonelada} </b>
                                    </a>
                                </li>
                                <li class="list-group-item py-2">
                                    <span class="text-muted">Rentabilidad</span> 
                                    <a class="float-right">
                                        <b class="text-orange">${app.FormatoNumero(app.Rentabilidad.toFixed(0))}%</b>
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </div>`;
                
                html += "</div>";
            }
        }

        tabResumen.html(html);
    } catch (error) {
        console.error(`error => ${error}`)
    }
}

/*

<div class="card card-success">
    <div class="card-header">
        <h3 class="card-title">All together</h3>

        <div class="card-tools">            
            <button type="button" class="btn btn-tool" data-card-widget="maximize"><i class="fas fa-expand"></i></button>
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
        </div>
    </div>
    <div class="card-body">
        The body of the card
    </div>
</div>


*/