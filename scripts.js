const url = "https://docs.google.com/forms/d/e/1FAIpQLScMAcjLI2OJkVzkWZNQTOSCRDGWraUUDrk52POJVIaom4J4Yg/viewform?usp=pp_url&entry.1436956763="
$(document).ready(function() { 
    $("#celu,#enteras,#descremadas").change(function validacion() {
      datos = [];
      
      datos.push($("#distrito").val());
      datos.push($("#celu").val());
      datos.push($("#enteras").val());
      datos.push($("#descremadas").val());
      //console.log(datos)
      if (datos[2] + datos[3] > 1 && datos[1].length > 10) {
        cadena = datos.join("|")
        $("#pedido").show();
      } else {
        $("#pedido").hide();
      }
    })
    $("#celu").change(function limpiezaCelu(){
      var celsucio = $("#celu").val();
      if (celsucio[0] === "+"|| celsucio[0] === 5) {
        var cellimpio = celsucio.replace('+','').replace(/ /g,'').replace('-','')
        //console.log(cellimpio)
        $("#celu").val(cellimpio)
      } else {
        var cellimpio = 549 + celsucio.replace('+','').replace(/ /g,'').replace('-','')
        $("#celu").val(cellimpio)
    }})
    
    $("#pedido").click(function modalRegistroPedido() {
      var requestURL = "https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/1/public/values?alt=json";
      var request = new XMLHttpRequest();
      request.open('GET', requestURL);
      request.responseType = 'json';
      request.send();
    
      request.onload = function() {
        console.log(request.response.feed.entry.gs$cell)
        var lista = request.response.feed.entry;
        nro_pedido = parseInt(lista[0].gs$cell.$t)+1;
        console.log(parseInt(nro_pedido))
        var titulo = "Registrar Pedido N°" + nro_pedido
        var boton = "Enviar Confirmación Pedido N°" + nro_pedido
        $("#myModalLabel").text(titulo)
        $('iframe').attr('src',url + cadena);
        $("#conf").show()
        $("#conf").text(boton)
      }
    })
    $("#conf").click(function respuestaConfirmacion() {
      var celu = $("#celu").val();
      var desc = parseInt($("#descremadas").val());
      var ent = parseInt($("#enteras").val());
      var total = (desc + ent)*40;
      var pedido = "\n\nEnteras: *"+ ent + "*\nDescremadas: *" + desc + "*\nTotal *$" + total + "*";
      var mje ="Nro Pedido: *" + nro_pedido + "*\n" + $("#mensaje").val() + pedido;
      window.open("http://wa.me/" + celu + "?text=" + encodeURI(mje));
      $("#celu").val('');
      $("#enteras").val(0);
      $("#descremadas").val(0);

      $('#myModal').on('hidden.bs.modal', function (e) {
        $("#celu").focus();
        $("#pedido").hide();
      })
    })
  
})