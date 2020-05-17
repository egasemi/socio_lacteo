const url = "https://docs.google.com/forms/d/e/1FAIpQLScMAcjLI2OJkVzkWZNQTOSCRDGWraUUDrk52POJVIaom4J4Yg/viewform?usp=pp_url&entry.1436956763="
$(document).ready(function() {            
    $("#celu,#enteras,#descremadas").change(function validacion() {
      datos = [];
      
      datos.push($("#distrito").val());
      datos.push($("#celu").val());
      datos.push($("#enteras").val());
      datos.push($("#descremadas").val());
      console.log(datos)
      if (datos[2] + datos[3] > 1 && datos[1].length > 10) {
        cadena = datos.join("|")
        $("#pedido").show();
      } else {
        $("#pedido").hide();
      }
    })
    $("#celu").change(function limpiezaCelu(){
      var celsucio = $("#celu").val();
      if (celsucio[0] === "+") {
        var cellimpio = celsucio.replace('+','').replace(/ /g,'').replace('-','')
        //console.log(cellimpio)
        $("#celu").val(cellimpio)
      } else {
        var cellimpio = 549 + celsucio.replace('+','').replace(/ /g,'').replace('-','')
        $("#celu").val(cellimpio)
    }})
    
    $("#pedido").click(function modalRegistroPedido() {
      $('iframe').attr('src',url + cadena);
    })

    $("#bnro_pedido").click(function obtenerNroPedido(){
      $("#bnro_pedido").hide();
      $("#spinner").show();
      setTimeout(function(){
        var requestURL = "https://spreadsheets.google.com/feeds/list/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/1/public/values?alt=json";
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();

        request.onload = function() {
          var lista = request.response.feed.entry;
          nro_pedido = lista[lista.length - 1].gsx$nrodepedido.$t;
          var boton = "Confirmar Pedido N°" + nro_pedido
          $("#spinner").hide();
          $("#conf").text(boton);
          $("#conf").show();
        }
      },3000)

      //console.log(nro_pedido)
    })
    $("#conf").click(function respuestaConfirmacion() {
      var celu = $("#celu").val();
      var desc = parseInt($("#descremadas").val());
      var ent = parseInt($("#enteras").val());
      var total = (desc + ent)*40;
      var pedido = "\n\nEnteras: *"+ ent + "*\nDescremadas: *" + desc + "*\nTotal *$" + total + "*\nNro Pedido: *" + nro_pedido + "*";
      var mje = $("#mensaje").val() + pedido;
      window.open("http://wa.me/" + celu + "?text=" + encodeURI(mje));
      $("#celu").val('');
      $("#enteras").val(0);
      $("#descremadas").val(0);

      $('#myModal').on('hidden.bs.modal', function (e) {
        $("#celu").focus();
        $("#conf").hide();
        $("#bnro_pedido").show();
        $("#pedido").hide();
      })
    })
})