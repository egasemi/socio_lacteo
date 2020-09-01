
const urls = {"D3":"https://docs.google.com/forms/d/e/1FAIpQLScMAcjLI2OJkVzkWZNQTOSCRDGWraUUDrk52POJVIaom4J4Yg/viewform?usp=pp_url&entry.1436956763=",
              "D4":"https://docs.google.com/forms/d/e/1FAIpQLSdBK6YLm6ueGb0fG5vvLNp17jEU1DzfYuJt21NqdopcvYM25A/viewform?usp=pp_url&entry.1436956763="};

const requestURLS = {"D3":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/1/public/values?alt=json",
                    "D4":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/7/public/values?alt=json"};

var distrito = $("#distrito");
var celu = $("#celu");

function validacion(){
  ent = $("#enteras").val();
  desc = $("#descremadas").val();
  if (ent === '' && desc === '') {
    ent = 0;
    desc = 0;
  } else if (desc === ''){
    desc = 0;
  } else if (ent === ''){
    ent = 0;
  }
}

function limpiezaCelu(){
    var celsucio = celu.val();
    if (celsucio[0] === "+"|| celsucio[0] === 5) {
      var cellimpio = celsucio.replace('+','').replace(/ /g,'').replace('-','')
      celu.val(cellimpio);
      celu.toggleClass("is-invalid");
    } else {
      var cellimpio = 549 + celsucio.replace('+','').replace(/ /g,'').replace('-','')
      celu.val(cellimpio);
      celu.toggleClass("is-invalid");
    }
}
function modalRegistroPedido() {
  if (distrito.val() === null) {
    distrito.toggleClass("is-invalid");
  } else if (celu.val() === '') {
    celu.toggleClass("is-invalid");
  } else {
    celu.removeClass("is-invalid")
    validacion();
    var datos = [];
    datos.push($("#distrito").val());
    datos.push($("#celu").val());
    datos.push(parseInt(ent));
    datos.push(parseInt(desc));
    var cadena = datos.join("|")
    var requestURL = requestURLS[datos[0]];
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
      var lista = request.response.feed.entry;
      nro_pedido = parseInt(lista[0].gs$cell.$t)+1;
      var titulo = "Registrar Pedido N°" + nro_pedido
      var boton = "Enviar Confirmación Pedido N°" + nro_pedido
      $("#myModal").modal();
      $("#myModalLabel").text(titulo)
      $('iframe').attr('src',urls[datos[0]] + cadena);
      $("#conf").show()
      $("#conf").text(boton)
    }
  }
}
function respuestaConfirmacion() {
  validacion();
  if (desc === 0) {
    var total = ent*40;
    var pedido = "\n\nEnteras: *"+ ent + "*\nTotal: *$" + total + "*"
  } else if (ent === 0){
    var total = desc*40;
    var pedido = "\n\nDescremadas: *"+ desc + "*\nTotal: *$" + total + "*"
  } else {
    var total = desc*40 + ent*40
    var pedido = "\n\nEnteras: *"+ ent + "*\nDescremadas: *" + desc + "*\nTotal *$" + total + "*"; 
  }
  var mje ="Nro Pedido: *" + nro_pedido + "*\n" + $("#mensaje").val() + pedido;
  window.open("http://wa.me/" + celu.val() + "?text=" + encodeURI(mje));
  celu.val('');
  celu.removeClass("is-invalid");
  $("#enteras").val('');
  $("#descremadas").val('');

  $('#myModal').on('hidden.bs.modal', function (e) {
    $("#celu").focus();
  })
}
function cancelarPedido() {
  $("#celu").val('');
  $("#enteras").val('');
  $("#descremadas").val('');
  $('#myModal').on('hidden.bs.modal', function (e) {
    $("#celu").focus();
  })
}
function mensaje() {
  if (distrito.val() === "D3") {
    distrito.removeClass("is-invalid");
    $("#mensaje").val("\nListo, ya están reservadas tus leches. No te olvides de traer tu nro de pedido para que podamos registrar que lo retiraste. La entrega es el Jueves de 10 a 15 en Viamonte 4139 (entre Avellaneda y Godoy).")
  } else if (distrito.val() === "D4"){
    distrito.removeClass("is-invalid");
    $("#mensaje").val("\nListo, ya están reservadas tus leches. No te olvides de traer tu nro de pedido para que podamos registrar que lo retiraste. La entrega es el Jueves de 10 a 15 en Eva Perón 6678 (casi Prov. Unidas).")
  }
}

$(document).ready(function() {    
  $("#celu").change(function() {
    limpiezaCelu();
  })
  $("#distrito").change(function () {
    mensaje();
  })  
  $("#pedido").click(function() {
    modalRegistroPedido();
  })
  $("#conf").click(function(){
    respuestaConfirmacion();
  })
  $("#x").click(function () {
    cancelarPedido();
  }) 
})