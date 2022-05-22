function validarNro(nro, string) {
    while(isNaN(nro)){
        alert("Entrada no valida, vuelva a intentarlo:");
        nro = prompt(string);
        nro = parseFloat(nro);
    }
    return nro;
}

function discriminante(a,b,c){
    return b*b - 4*a*c;
}



function calculadora(){
    while(true){
        alert("Bienvenidx a la calculadora de funciones!");

        let nro = prompt("Ingresa el número de la función queres analizar:\n 1. Funcion Lineal y = mx + b \n 2. Función Cuadrática y = ax^2 + bx + c \n 3. Para salir"); 

        nro = parseInt(nro);

        /* valido entrada */

        while(isNaN(nro) || (nro != 1 && nro != 2 && nro != 3)){
            alert("Entrada no valida, vuelva a intentarlo.");
            nro = prompt("Ingresa el número de la función queres analizar:\n 1. Funcion Lineal y = mx + b \n 2. Función Cuadrática y = ax^2 + bx + c");
            nro = parseInt(nro);
        }

        if(nro == 1){ /* Funcion Lineal */
            alert("Elegiste funcion lineal y = mx + b, a continuación necesito:");
            let m = prompt("cual es valor de m (la pendiente) ?");
            m = parseFloat(m);
            /*while(isNaN(m)){
                alert("Entrada no valida, vuelva a intentarlo:");
                m = prompt("cual es valor de m (la pendiente) ?");
                m = parseFloat(m);
            }*/
            m = validarNro(m, "cual es valor de m (la pendiente) ?");
            let b = prompt("cual es el valor de b (la ordenada al origen) ?");
            b = parseFloat(b);
            /*while(isNaN(b)){
                alert("Entrada no valida, vuelva a intentarlo:");
                let b = prompt("cual es el valor de b (la ordenada al origen) ?");
                b = parseFloat(b);
            }*/
            b = validarNro(b , "cual es el valor de b (la ordenada al origen) ?")
            /* Calculo la raiz si tiene:*/
        
            if( m == 0 && b == 0){
                alert("La función ingresada es: y = " + m + "x + " + b + " = 0\n Por lo tanto las raices de la función son todos los números reales.\n Y su ordenada al origen es y = 0" );
            }else if (m == 0 && b!=0) {
                alert("La función ingresada es: y = " + m + "x + " + b + " = " + b + "\n Por lo tanto la función no tiene raíces.\n Y su ordenada al origen es y = " + b );
            } else {
                let raiz = -b/m;
                alert("La función ingresada es: y = " + m + "x + " + b +  "\n Por lo tanto la raíz de la función es: x = " + raiz + "\n Y su ordenada al origen es y = " + b );
            }
        
        }else if (nro == 2) { /*funcion cuadrática*/
            alert("Elegiste funcion cuadrática y = ax^2 + bx + c, a continuación necesito:");
            let a = prompt("Cual es el valor de a (coeficiente ppal)?");
            a = parseFloat(a);
            validarNro(a,"Cual es el valor de a (coeficiente ppal)?");
            let b = prompt("Cual es el valor de b (coeficiente lineal)?");
            b = parseFloat(b);
            validarNro(b, "Cual es el valor de b (coeficiente lineal)?");
            let c = prompt("Cual es el valor de c (coeficiente independiente)?")
            c = parseFloat(c);
            validarNro(c , "Cual es el valor de c (coeficiente independiente)?");

            let discr = discriminante(a,b,c);

            /*Raices*/

            if(discr > 0 ){
                let r1 = (-b + discr)/(2*a);
                let r2 = (-b - discr)/(2*a);
                alert("La función ingresada es y = " + a + "x^2 + " + b + "x + " + c + "\n veamos si tiene raices, para esto calculamos su discriminante: \n " + "b^2-4ac = " + discr + "\n como el discirminate es positivo la función tiene dos raices \n: " + "x1 = "+ r1 + ", x2 = " + r2);
            }else if (discr == 0) {
                let r = -b/(2*a);
                alert("La función ingresada es y = " + a + "x^2 + " + b + "x + " + c + "\n veamos si tiene raices, para esto calculamos su discriminante: \n " + "b^2-4ac = " + discr + "\n como el discirminate es cero la función tiene una única raiz \n: " + "x = "+ r );
            } else {
                alert("La función ingresada es y = " + a + "x^2 + " + b + "x + " + c + "\n veamos si tiene raices, para esto calculamos su discriminante: \n " + "b^2-4ac = " + discr + "\n como el discirminate es negativo la función no tiene raices reales." );
            }  
        
        } else {
            break;    
        }

    }
}

calculadora();
