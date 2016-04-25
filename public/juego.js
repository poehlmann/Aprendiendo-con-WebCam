var orden;
var intentos;
var puntaje;
var combinacionjugador = Array(5);
var j;
var activar=true;
var activado=false;
var espera=0;
/*
$(document).ready(function(){
    $("p").hover(function(){
        $(this).css("background-color", "yellow");
    }, function(){
        $(this).css("background-color", "pink");
    });
});

$( "button.fade" ).hover(function() {
    $( this ).fadeOut( 100 );
    $( this ).fadeIn( 500 );
});
*/
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 1;
    }, 1000);
}
function limpiararray()
{
    for(i=0;i<6;i++){
        combinacionjugador[i]=0;
    }
}
function presionado(id)
{
    if(activado) {
        espera++;
        document.getElementById("espera").innerHTML = "ESPERE!!!";
    if(espera==1) {
        setTimeout(function () {
            evaluar(id);
        }, 3000);

        var elemento =
            document.getElementById(id);
        fade(elemento);
        setTimeout(function () {
            unfade(elemento);
        }, 3000);
     }
    }

}
function evaluar(id){
    if(intentos<3)
    {
        if (orden == 6)
        {
            combinacionjugador[j] = id;
            j++;
            if(j==3)
            {
                console.log(combinacionjugador[0]);
                console.log(combinacionjugador[1]);
                if (((combinacionjugador[0] == "CirculoPequenho")&&(combinacionjugador[1] == "CirculoGrande")&&(combinacionjugador[2]=="CuadradoPequenho"))||
                ((combinacionjugador[1] == "CirculoPequenho")&&(combinacionjugador[0] == "CirculoGrande")&&(combinacionjugador[2]=="CuadradoPequenho"))||
                ((combinacionjugador[2] == "CirculoPequenho")&&(combinacionjugador[1] == "CirculoGrande")&&(combinacionjugador[0]=="CuadradoPequenho"))||
                ((combinacionjugador[2] == "CirculoPequenho")&&(combinacionjugador[0] == "CirculoGrande")&&(combinacionjugador[1]=="CuadradoPequenho"))||
                ((combinacionjugador[1] == "CirculoPequenho")&&(combinacionjugador[2] == "CirculoGrande")&&(combinacionjugador[0]=="CuadradoPequenho"))||
                ((combinacionjugador[0] == "CirculoPequenho")&&(combinacionjugador[2] == "CirculoGrande")&&(combinacionjugador[1]=="CuadradoPequenho")))
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }

        }
        if (orden == 5)
        {
            combinacionjugador[j] = id;
            for (k = 0; k <= j; k++)
            {
                if (combinacionjugador[k] == "CirculoGrande")
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }
        }
        if (orden == 4)
        {
            combinacionjugador[j] = id;
            j++;
            if(j==2)
            {
                console.log(combinacionjugador[0]);
                console.log(combinacionjugador[1]);
                if ((combinacionjugador[0] == "CirculoPequenho")&&(combinacionjugador[1] == "CuadradoGrande"))
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }

        }
        if (orden == 3)
        {
            combinacionjugador[j] = id;
            j++;
            if(j==2)
            {
                console.log(combinacionjugador[0]);
                console.log(combinacionjugador[1]);
                if (((combinacionjugador[0] == "CirculoPequenho")&&(combinacionjugador[1] == "CuadradoGrande"))||
                    ((combinacionjugador[1] == "CirculoPequenho")&&(combinacionjugador[0] == "CuadradoGrande")))
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }

        }
        if (orden == 2)
        {
            combinacionjugador[j] = id;
            j++;
            if(j==2)
            {
                console.log(combinacionjugador[0]);
                console.log(combinacionjugador[1]);
                if (((combinacionjugador[0] == "CirculoPequenho")&&(combinacionjugador[1] == "CuadradoPequenho"))||
                ((combinacionjugador[0] == "CuadradoPequenho")&&(combinacionjugador[1] == "CirculoPequenho")))
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }

        }
        if (orden == 1)
        {
            combinacionjugador[j] = id;
            for (k = 0; k <= j; k++)
            {
                if (combinacionjugador[k] == "CuadradoPequenho")
                {
                    orden++;
                    puntaje++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                    combinacion(orden);
                }
                else {
                    intentos++;
                    document.getElementById("puntaje").innerHTML = "orden:"+orden+"\nintentos:"+intentos+"\npuntaje:"+puntaje;
                    limpiararray();
                    j=0;
                }
            }
        }
    }
    else{
        activar=false;
    }
    espera=0;
    document.getElementById("espera").innerHTML = "CONTINUE";

}
function combinacion(orden){
    pintarorden(orden);
}
function iniciar()
{
    if(activar) {
        orden = 1;
        j = 0;
        intentos = 0;
        puntaje = 0;
        document.getElementById("puntaje").innerHTML = "orden:" + orden + "\nintentos:" + intentos + "\npuntaje:" + puntaje;
        combinacion(orden);
        activado=true;
    }else{
        document.getElementById("orden1").innerHTML ="";
        document.getElementById("orden2").innerHTML ="";
        document.getElementById("orden3").innerHTML ="";
        document.getElementById("orden4").innerHTML ="";
        document.getElementById("orden5").innerHTML ="";
        document.getElementById("orden6").innerHTML ="";
    }
}

function pintarorden(orden)
{
    if(orden==1){document.getElementById("orden1").innerHTML = "1. Se&ntilde;ale el cuadrado peque&ntilde;o";}
    if(orden==2){
        document.getElementById("orden1").innerHTML ="";
            document.getElementById("orden2").innerHTML = "2. Se&ntilde;ale el circulo peque&ntilde;o y un cuadrado peque&ntilde;o";}
    if(orden==3){
        document.getElementById("orden1").innerHTML ="";
        document.getElementById("orden2").innerHTML ="";
            document.getElementById("orden3").innerHTML = "3. Se&ntilde;ale el circulo peque&ntilde;o y un cuadrado grande";}
    if(orden==4){
        document.getElementById("orden1").innerHTML ="";
        document.getElementById("orden2").innerHTML ="";
        document.getElementById("orden3").innerHTML ="";
            document.getElementById("orden4").innerHTML = "4. Se&ntilde;ale el circulo peque&ntilde;o y luego los cuadrados grandes";}
    if(orden==5){
        document.getElementById("orden1").innerHTML ="";
        document.getElementById("orden2").innerHTML ="";
        document.getElementById("orden3").innerHTML ="";
        document.getElementById("orden4").innerHTML ="";
            document.getElementById("orden5").innerHTML = "5. Se&ntilde;ale el circulo grande si hay un cuadrado peque&ntilde;o";}
    if(orden==6){
        document.getElementById("orden1").innerHTML ="";
        document.getElementById("orden2").innerHTML ="";
        document.getElementById("orden3").innerHTML ="";
        document.getElementById("orden4").innerHTML ="";
        document.getElementById("orden5").innerHTML ="";
            document.getElementById("orden6").innerHTML = "6. Ademas de se&ntilde;alar los circulos se&ntilde;ale el cuadrado peque&ntilde;o";}
}