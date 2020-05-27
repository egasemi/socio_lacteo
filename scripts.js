const urls = {"D3":"https://docs.google.com/forms/d/e/1FAIpQLScMAcjLI2OJkVzkWZNQTOSCRDGWraUUDrk52POJVIaom4J4Yg/viewform?usp=pp_url&entry.1436956763=",
              "D5":"https://docs.google.com/forms/d/e/1FAIpQLSdEVa08UTV7maT5vYMMJsNzFe9N2AICHOUzL4zOX9l0aCGT0w/viewform?usp=pp_url&entry.1964618817="};

const requestURLS = {"D3":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/1/public/values?alt=json",
                    "D5":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/2/public/values?alt=json"};
$(document).ready(function() { 
    $("#celu,#enteras,#descremadas").keyup(function validacion() {
      datos = [];
      datos.push($("#distrito").val());
      datos.push($("#celu").val());
      if ($("#enteras").val() === '') {
        datos.push(0)
      }
      if ($("#descremadas").val() === '') {
        datos.push(0)
      }
      datos.push($("#enteras").val());
      datos.push($("#descremadas").val());
      //console.log(parseInt(datos[2]) + parseInt(datos[3]))
      if (parseInt(datos[2]) + parseInt(datos[3]) > 0 && datos[1].length > 10) {
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
      var requestURL = requestURLS[datos[0]];
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
        $('iframe').attr('src',urls[datos[0]] + cadena);
        $("#conf").show()
        $("#conf").text(boton)
      }
      console.log(this)
    })
    $("#conf").click(function respuestaConfirmacion() {
      var celu = $("#celu").val();
      var desc = parseInt($("#descremadas").val());
      var ent = parseInt($("#enteras").val());
      var total = (desc + ent)*40;
      if (desc === 0 || desc === null || isNaN(desc)) {
        var pedido = "\n\nCantidad: *"+ ent + "*\nTotal: *$" + total + "*"
      } else if (ent === 0 || ent === null || isNaN(ent)){
        var pedido = "\n\nCantidad: *"+ desc + "*\nTotal: *$" + total + "*"
      } else {
        var pedido = "\n\nEnteras: *"+ ent + "*\nDescremadas: *" + desc + "*\nTotal *$" + total + "*"; 
      }
      //var pedido = "\n\nEnteras: *"+ ent + "*\nDescremadas: *" + desc + "*\nTotal *$" + total + "*";
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
    $("#x").click(function cancelarPedido() {
      $("#celu").val('');
      $("#enteras").val('');
      $("#descremadas").val('');
      $('#myModal').on('hidden.bs.modal', function (e) {
        $("#celu").focus();
        $("#pedido").hide();
      })
    })
  
})