import {Polinomio} from "../scripts/polinomio_class.js";
//----------------------------------------------------------------------------------
//Funcion que dado un string valida si representa un objeto de la clase polinomio

function validarInput(poly_str){
    let res = true;                         //inicializo la salida como true, solo la voy a cambiar si algo no cumple con la validacion
    let poly_arr = poly_str.split("");      //separo el  string por caracter en forma de un array

    const char_validos = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9", "x", ".", "^", "+", "-"]; // estos son los unicos char validos 

    const char_nros = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9"]

    //Verifico que no sea una entrada vacía


    if(poly_str ==""){
        res = false;
        iziToast.show({
            title: 'Input no valido',
            message: 'Entrada vacia',
            position: 'topRight' 
        });
    }
    
    
    //Verifico que todos los caracteres de poly_str sean validos:

    for(let i = 0 ; i < poly_arr.length; i++){
        if(!char_validos.includes(poly_arr[i])){
            res = false;
            iziToast.show({
                title: 'Input no valido',
                message: "Hay caractereres no validos",
                position: 'topRight' 
            });
        }      
         
    }

    //Toda potencia(^) tiene una x antes y un numero despues.
    let pwd_indices = poly_arr.reduce((c, v, i) => v =="^" ? c.concat(i) : c, []);  // busco los indices de poly_arr donde esta "^"
    for(let j = 0; j < pwd_indices.length; j++){
        if(!char_nros.includes(poly_arr[pwd_indices[j]+1])){
            res = false;
            iziToast.show({
                title: 'Input no valido',
                message: "Despues de ^ no hay un numero, la entrada no es valida",
                position: 'topRight' 
            });
            
        }

        if(!(poly_arr[pwd_indices[j]-1] == "x")){
            res = false;    // si antes de ^ no esta x, la entrada no es valida
            iziToast.show({
                title: 'Input no valido',
                message: "Antes de ^ no esta x, la entrada no es valida",
                position: 'topRight' 
            });
        }
         
    }
    //Toda puntito (.) tiene un nro antes y un nro despues.
    let puntito_indices = poly_arr.reduce((c, v, i) => v =="." ? c.concat(i) : c, []); //busco los indices de poly_arr donde esta "."
    for(let j = 0; j < puntito_indices.length; j++){

        if(!char_nros.includes(poly_arr[puntito_indices[j]+1])){
            res  = false;
            iziToast.show({
                title: 'Input no valido',
                message: "Despues de '.' no hay un numero la entrada no es valida",
                position: 'topRight' 
            });
        }
       
        if(!char_nros.includes(poly_arr[puntito_indices[j]-1])){
            res  = false;
            iziToast.show({
                title: 'Input no valido',
                message: "Antes de '.' no hay un numero la entrada no es valida",
                position: 'topRight' 
            });
        }
    }

    // No hay dos signos juntos:
    let signos_indices = poly_arr.reduce((c, v, i) => (v == "+" || v == "-") ? c.concat(i) : c, []);    //busco los indices de poly_arr donde hay o un "+" o un "-"
    for(let k = 1; k < signos_indices.length; k++){
        if(signos_indices[k] - signos_indices[k-1] == 1){
            res = false;
            iziToast.show({
                title: 'Input no valido',
                message: "Hay dos signos seguidos, la entrada no es valida",
                position: 'topRight' 

            });
        }
    }
   
    // Verifico que todas las potencias sean numeros enteros//
    
    for(let j of pwd_indices){
        
        let s = signos_indices.find(i => i > j);
        
        if(s === undefined){
            for(let k = j+1 ; k < poly_arr.length; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    iziToast.show({
                        title: 'Input no valido',
                        message: "Hay una potencia que no es entera, la entrada no es valida",
                        position: 'topRight' 
                    });
                }
            }
        }else{
            for(let k = j+1 ; k < s; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    iziToast.show({
                        title: 'Input no valido',
                        message: "Hay una potencia que no es entera, la entrada no es valida",
                        position: 'topRight' 
                    });
                }
            }
        }
    }
    //----------Verifico que un numero decimal no tenga mas de un '.'---------------------//
    
    for(let p of puntito_indices){
        
        let s = signos_indices.find(i => i > p);
        
        if(s === undefined){
            for(let k = p+1 ; k < poly_arr.length; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    iziToast.show({
                        title: 'Input no valido',
                        message: "Hay mas de un '.' en un numero, la entrada no es valida",
                        position: 'topRight' 
                    });
                }
            }
        }else{
            for(let k = p+1 ; k < s; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    iziToast.show({
                        title: 'Input no valido',
                        message: "Hay mas de un '.' en un numero, la entrada no es valida",
                        position: 'topRight' 
                    });
                }
            }
        }
    }

    return res;
}


//-----------------------------------------------------------------------------------------------------
//Funcion que dado un string que representa a un polinomio P, devuelvo P representado por la class polinomio  

function inputToPolinomio(poly_str){                
    let poly_obj = new Polinomio([0]);          // arranco con el polinomio P(x) = 0
    let poly_arr = poly_str.split("");          // transformo la entrada string en un array
    let n = poly_arr.length;                    // n es la cantidad de elementos del arrar poly_arr
    let coef = [];                              // inicializo el arr coef donde ire armanado cada coef de cada termino
    let pwd = [];                               // inicializo el arr pwd donde ire armanado cada potencia de cada termino
    for(let i = 0; i < n; i++){
        if((poly_arr[i] == "+" || poly_arr[i] == "-") && i!=0  ){ // si aparece un "+" o un "-" quiere decir que termino un termino
            let coef_str = coef.join("");                          // Uno el array coef y lo trasnformo en string
            if(coef_str == "" || coef_str == "+" || coef_str == "-"){   // Si estoy en alguno de estos tres casos es como si hubiese un 1 : x = 1x; +x = 1x; -x = -1x
                coef_str = coef_str.concat("1");
             }
            let coef_float = parseFloat(coef_str); // paso el string a float
            let pwd_str = pwd.join("");         // Uno el array que representa la potencia
            let pwd_int = 0                     
            if(pwd_str==""){                    // si no hay potencia es que la potencia es 0
               pwd_int = 0;
            }else{
                pwd_int = parseInt(pwd_str);    //paso la potencia a entero
            }
            let mono_dicc = {};                //guardo en un diccionario {potencia :  coeficiente}
            mono_dicc[pwd_int] = coef_float;
            let monomio =  new Polinomio (mono_dicc);       // creo un polinomio con un solo termino 
            poly_obj = poly_obj.sumar(monomio);             // sumo el polinomio creado al polinomio que quiero como respuesta
            coef = [];                                      // reinicio coeficiente
            coef.push(poly_arr[i]);                         // sigo con el proximo termini
            pwd = [];                                   // reinicio pwd
        }else{                                      // como no es "+", ni "-", ni i = 0 no termine ningun termnino
            if(poly_arr[i] != "x"){                 // si no es x todavia estoy armando el coeficiente, como valide el input antes estoy seguro que es un numero
                coef.push(poly_arr[i]);             // agrego el nro al array que representa al coef
            }else{                                  // si poly_arr[i] es x, hay dos casos que siga con "^" (tiene potencia distinto de 1) o que no (osea la potencia sea 1)
                if(poly_arr[i+1] == "^"){             
                    for(let j = i+2; j< n && (poly_arr[j] != "+" && poly_arr[j] != "-"); j++){
                        pwd.push(poly_arr[j]);
                        i = j;  // i = j  hay signo o termina array
                    }

                }else{
                    pwd = ["1"];
                }
            }
        }
    }
    //Agrego el ultimo monomio, el ciclo for me agrega todos los terminos salvo el ultimo que lo tengo que agregar manualmente
    let coef_str = coef.join("");
    if(coef_str == "" || coef_str == "+" || coef_str == "-"){
        coef_str = coef_str.concat("1");
    }
    let coef_float = parseFloat(coef_str);
    let pwd_str = pwd.join("");
    let pwd_int = 0
    if(pwd_str==""){
       pwd_int = 0;
    }else{
        pwd_int = parseInt(pwd_str);
    }
    let mono_dicc = {};
    mono_dicc[pwd_int] = coef_float;
    let monomio =  new Polinomio (mono_dicc);
    poly_obj = poly_obj.sumar(monomio);

    return poly_obj;
}

//------------Funcion que verifica que el polinomio tiene coeficientes enteros----------------//
function coeficientesEnteros(poly_obj){
    let res = true;
    let potencias = Object.keys(poly_obj.coeffs);
    for(p of potencias){
        Number.isInteger(poly_obj.coeffs[p]) ? res &= true : res &= false;
    }
    return res;
}

//-------------------------Factorizada - String ---------------------------//

function strFactorizada(poly_obj){
    let res = "";
    let rs = poly_obj.raices();
    for(let [raiz, mult] of Object.entries(rs)){
        let tmp = "";
        if(raiz < 0){
            tmp = "(x + " + -raiz +")";
        }else if(raiz == 0){
            tmp = "x";
        }else{
            tmp = "(x - " + raiz +")";
        }
        if(mult > 1){
            tmp = tmp + "^{" + mult + "}";
        }
        res = res.concat(tmp);
        while(mult != 0){
            poly_obj = ruffini(poly_obj,raiz);
            mult--;
        }
      }
      const str_sinRaices = poly_obj.poliToString(); 
      
      if(str_sinRaices.includes("x") == false){
        if(str_sinRaices != '1'){
            res = str_sinRaices + res;
        }else{
            if(res ===""){
                res = str_sinRaices + res;
            }
        }
      }else{
        res = res + "(" + str_sinRaices + ")";
      }
    return res;
}

//--------Ruffini---------------Cociente de hacer P(x):(x-r)----------//
function ruffini(poly_obj, r){
    const coeff_completos = poly_obj.completarCoeffs();
    const n = poly_obj.grado;
    let coeff_cociente = {};
    coeff_cociente[n-1] = coeff_completos[n];
    for(let p = n-2; p >= 0; p--){
        coeff_cociente[p] = coeff_cociente[p+1]*r + coeff_completos[p+1];
    }
    return new Polinomio(coeff_cociente);
}



//Consulto DOM//

let i = 1; // numera cada polinomio ingresado

let polinomios_cargados = [] // lista donde agrego los polinomios que carga el usuario

let btn_cargar_polnomio = document.getElementById("cargar_Polinomio"); // capturo el boton de carga de polinomios

btn_cargar_polnomio.addEventListener('click', () => cargar()); // Le asigno al btn la funcion cargar cuando se clickea

function cargar(){
    
    const C0 = document.getElementById('C_0').checked;
    const Cpos = document.getElementById('C_+').checked;
    const Cneg = document.getElementById('C_-').checked;
    const grafico = document.getElementById('Grafico').checked;
    const derivada = document.getElementById('Derivada').checked;
    const factorizada = document.getElementById('Factorizada').checked;
    

    const poly = document.getElementById('input_poly');     // capturo el bloque donde va a estar el input
    const polinomios = document.getElementById('polinomios-ingresados');   // capturo la seccion polinomios
    let poly_str = poly.value;                                  // guardo el valor del input como poly_str (el polinomio en forma de string)
    //poly.value = ""; // reseteo el input
    poly_str = poly_str.replace(/\s+/g,''); // elimino todos los espacios
    
    if(validarInput(poly_str)){         //Verifico si el string representa a un polinomio
        if(poly_str[0]=="+"){                          //elimino, si lo tiene,  el "+" adelante de todo
            let arr = poly_str.split("");
            arr.shift();
            poly_str = arr.join("");
        }
        let poly_obj = inputToPolinomio(poly_str);  // paso el string que representa a u polinomio a un objeto de la clase polinomio
        polinomios_cargados.push(poly_obj); // guardo en polinomios cargados

        //-------------guardo el objeto en JSON-------------

        let poly_json = JSON.stringify(poly_obj);

        localStorage.setItem("poli_"+i, poly_json);

        // ---- creo un div de con id poli_i------//

        let div = document.createElement("div");
        div.setAttribute("id", "poli_"+i);
        div.className = "poli";
        polinomios.insertAdjacentElement("afterbegin", div);
        //polinomios.appendChild(div);
        //-------- creo un parrafo <p></p> y le asigno la clase poli_i (donde i cuenta la cantidad de polinomios) ---//
       
        let p = document.createElement("p");    
        p.classList.add("poli_" + i);
        //---------------------------------------//

        let poly_text = document.createTextNode("El polinomio ingresado es " + "P" + "\\(_{" + i + "}\\)" + "(x) = " +  "\\( " + poly_obj.poliToString() +" \\) " + " , el cual es un polinomio de grado "  + poly_obj.grado + ".");
        p.appendChild(poly_text);
        div.appendChild(p);

        if(C0){
            let p_raices = document.createElement("p");
            p_raices.classList.add("poli_" + i);
            let C0_text = "";
            let raices = Object.keys(poly_obj.raices());
            for(const r of raices){
                if(C0_text == ""){
                    C0_text = C0_text + r;
                }else{
                    C0_text = C0_text  + ", " + r;
                }
            }

            if(C0_text == ""){
                C0_text = C0_text + "\\( C_{0} = \\emptyset  \\)";
            }else{
                C0_text =  "\\( C_{0} =  \\)" + "{" + C0_text + "}";
            }
            console.log(C0_text)
            let ceros = document.createTextNode(C0_text);
            p_raices.appendChild(ceros);
            div.appendChild(p_raices);
        }

        if(Cpos){
            let p_pos = document.createElement("p");
            p_pos.classList.add("poli_" + i);
            let positividad = document.createTextNode(poly_obj.positividad());
            p_pos.appendChild(positividad);
            div.appendChild(p_pos);
        }

        if(Cneg){
            let p_neg = document.createElement("p");
            p_neg.classList.add("poli_" + i);
            let negatividad = document.createTextNode(poly_obj.negatividad());
            p_neg.appendChild(negatividad);
            div.appendChild(p_neg);
        }

        if(factorizada){
            let p4 = document.createElement("p");
            p4.classList.add("poli_" + i);
            let facto = document.createTextNode("La forma factorizada de P"+ "\\(_{" + i +"}\\)(x) " + "es " +"P" +  "\\(_{" + i + "}\\)" + "(x) = " +  "\\( " + strFactorizada(poly_obj) +" \\)  " );
            p4.appendChild(facto);
            div.appendChild(p4);
        }
        if(derivada){
            let p3 = document.createElement("p");
            p3.classList.add("poli_" + i);
            let derivada = document.createTextNode("La derivada de P"+ "\\(_{" + i +"}\\)(x) " + "es " + "P'" + "\\(_{" + i +"}\\)(x) = " + "\\( " +  poly_obj.derivada().poliToString() + " \\) "  );
            p3.appendChild(derivada);
            div.appendChild(p3);
        }

        if(grafico){
            let div_graph = document.createElement("div");
            div_graph.setAttribute("id","poli_"+i+"_graph");
            div_graph.className = "graph";
            div.appendChild(div_graph);
            let calculator = Desmos.GraphingCalculator(div_graph, {expressions: false});
            calculator.setExpression({ id: 'graph1', latex: "P" + "_{" + i + "}" + "(x) = " + poly_str });
        }else{
            document.getElementById("poli_"+i).style.height = "auto";
        }

        MathJax.typesetPromise();
        i++;
    }
   
}


let polinomios_ejemplos = [] // lista donde agrego los polinomios que carga el usuario
fetch('ejemplos.json')
    .then((resp)=>(resp.json()))
    .then((data) => {
        for(let i = 0; i < data.length; i++){
            let p = new Polinomio(data[i].coeffs);
            polinomios_ejemplos.push(p);
        }

    }
)





