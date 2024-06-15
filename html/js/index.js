$(document).ready(function(){
    if(IS_MOBILE()){
        $("#CardTabs").addClass('card-tabs-mobil');
    }
    CambiarNombreTitulo('Maíz Blanco');
});

function CambiarNombreTitulo (nombre){
    const NuevoTitulo = `C&aacute;lculo de Utilidad "${nombre}"`;
    $("#Titulo").html(NuevoTitulo);
}