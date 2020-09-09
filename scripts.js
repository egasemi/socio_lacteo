
const urls = {"D3":"https://docs.google.com/forms/d/e/1FAIpQLScMAcjLI2OJkVzkWZNQTOSCRDGWraUUDrk52POJVIaom4J4Yg/viewform?usp=pp_url&entry.1436956763=",
              "D4":"https://docs.google.com/forms/d/e/1FAIpQLSdBK6YLm6ueGb0fG5vvLNp17jEU1DzfYuJt21NqdopcvYM25A/viewform?usp=pp_url&entry.1436956763="};

const requestURLS = {"D3":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/1/public/values?alt=json",
                    "D4":"https://spreadsheets.google.com/feeds/cells/1qDfmW1_zmA9zVq-dk8XV3YwREsJCUxFEcLAz37LwTPE/7/public/values?alt=json"};

var distrito = $("#distrito");
var celu = $("#celu");

async function ultimoPedido() {
  return json = $.getJSON(requestURLS[distrito.val()], function() {
    ultimo_pedido = parseInt(json.responseJSON.feed.entry[0].content.$t);
  });
}
async function nuevoPedido() {
  await ultimoPedido();
  nuevo_pedido = ultimo_pedido + 1;
  return nuevo_pedido;
}
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
    celu.removeClass("is-invalid");
  } else {
    var cellimpio = 549 + celsucio.replace('+','').replace(/ /g,'').replace('-','')
    celu.val(cellimpio);
    celu.removeClass("is-invalid");
  }
}
function modalRegistroPedido() {
  if (distrito.val() === null) {
    distrito.toggleClass("is-invalid");
  } else if (celu.val() === '') {
    celu.toggleClass("is-invalid");
  } else {
    nuevoPedido();
    celu.removeClass("is-invalid")
    validacion();
    var datos = [];
    datos.push($("#distrito").val());
    datos.push($("#celu").val());
    datos.push(parseInt(ent));
    datos.push(parseInt(desc));
    var cadena = datos.join("|")
    $("#myModal").modal();
    $('iframe').attr('src',urls[datos[0]] + cadena);
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
  var mje ="Nro Pedido: *" + nuevo_pedido + "*\n" + $("#mensaje").val() + pedido;
  window.open("http://wa.me/" + celu.val() + "?text=" + encodeURI(mje));
  reiniciar();
}
function reiniciar() {
  celu.val('');
  celu.removeClass("is-invalid");
  $("#enteras").val('');
  $("#descremadas").val('');

  $('#myModal').on('hidden.bs.modal', function (e) {
    $("#celu").focus();
  })
  $("#conf").show();
  $("#spinner").show();
  $("#iframe").show();
  $("#iframe").attr('');
  $("#mBody").show();
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
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}
async function chequeo() {
  await ultimoPedido();
  while (nuevo_pedido !== ultimo_pedido) {
    await ultimoPedido();
    await timer(1000);
  }
  $("#iframe").hide();
  $("#mBody").hide();
  $("#conf")
  .text('Enviar Confirmación pedido Nro ' + ultimo_pedido)
  .show()
  $("#spiner").hide();
};

$(document).ready(async function() {

  $("#celu").change(function() {
    limpiezaCelu();
  })
  $("#distrito").change(async function () {
    mensaje();
    await ultimoPedido();
    await nuevoPedido();
  })  
  $("#pedido").click(async function() {
    modalRegistroPedido();
    await chequeo();
  })
  $("#conf").click(function(){
    respuestaConfirmacion();
    reiniciar();
  })
  $("#x").click(function () {
    reiniciar();
  })
})