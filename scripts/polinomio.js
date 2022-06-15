function ordenarClaves(obj){
    return [...Object.keys(obj)] //Devuelve un array con las claves del diccionario obj
    .map(parseFloat) // convierte string a float
    .sort((a,b) => b - a); //ordena en forma descendente 
}


//----------------------------------------------------------------------------------
//Funcion que dado un string valida si representa un objeto de la clase polinomio

function validarInput(poly_str){
    let msj_error = "";
    let res = true;                         //inicializo la salida como true, solo la voy a cambiar si algo no cumple con la validacion
    let poly_arr = poly_str.split("");      //separo el  string por caracter en forma de un array

    const char_validos = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9", "x", ".", "^", "+", "-"]; // estos son los unicos char validos 

    const char_nros = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9"]

    //Verifico que no sea una entrada vacía


    if(poly_str ==""){
        res = false; 
        msj_error  = msj_error.concat("Entrada vacía");
        console.log(msj_error);
    }
    
    
    //Verifico que todos los caracteres de poly_str sean validos:

    for(let i = 0 ; i < poly_arr.length; i++){
        if(!char_validos.includes(poly_arr[i])){
            res = false;
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Hay caractereres no validos");
        }      
         
    }

    //Toda potencia(^) tiene una x antes y un numero despues.
    let pwd_indices = poly_arr.reduce((c, v, i) => v =="^" ? c.concat(i) : c, []);  // busco los indices de poly_arr donde esta "^"
    for(let j = 0; j < pwd_indices.length; j++){
        if(!char_nros.includes(poly_arr[pwd_indices[j]+1])){
            res = false;
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Despues de ^ no hay un numero, la entrada no es valida");
        }

        if(!(poly_arr[pwd_indices[j]-1] == "x")){
            res = false;    // si antes de ^ no esta x, la entrada no es valida
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Antes de ^ no esta x, la entrada no es valida");
        }
         
    }
    //Toda puntito (.) tiene un nro antes y un nro despues.
    let puntito_indices = poly_arr.reduce((c, v, i) => v =="." ? c.concat(i) : c, []); //busco los indices de poly_arr donde esta "."
    for(let j = 0; j < puntito_indices.length; j++){

        if(!char_nros.includes(poly_arr[puntito_indices[j]+1])){
            res  = false;
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Despues de '.' no hay un numero la entrada no es valida");
        }
       
        if(!char_nros.includes(poly_arr[puntito_indices[j]-1])){
            res  = false;
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Antes de '.' no hay un numero la entrada no es valida");
        }
    }

    // No hay dos signos juntos:
    let signos_indices = poly_arr.reduce((c, v, i) => (v == "+" || v == "-") ? c.concat(i) : c, []);    //busco los indices de poly_arr donde hay o un "+" o un "-"
    for(let k = 1; k < signos_indices.length; k++){
        if(signos_indices[k] - signos_indices[k-1] == 1){
            res = false;
            msj_error = msj_error.concat("\n");
            msj_error = msj_error.concat("Hay dos signos seguidos, la entrada no es valida")
        }
    }
   
    // Verifico que todas las potencias sean numeros enteros//
    
    for(let j of pwd_indices){
        
        let s = signos_indices.find(i => i > j);
        
        if(s === undefined){
            for(let k = j+1 ; k < poly_arr.length; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    msj_error = msj_error.concat("\n");
                    msj_error = msj_error.concat("Hay una potencia que no es entera, la entrada no es valida")
                }
            }
        }else{
            for(let k = j+1 ; k < s; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    msj_error = msj_error.concat("\n");
                    msj_error = msj_error.concat("Hay una potencia que no es entera, la entrada no es valida")
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
                    msj_error = msj_error.concat("\n");
                    msj_error = msj_error.concat("Hay mas de un '.' en un numero, la entrada no es valida")
                }
            }
        }else{
            for(let k = p+1 ; k < s; k++ ){
                if(!char_nros.includes(poly_arr[k])){
                    res = false;
                    msj_error = msj_error.concat("\n");
                    msj_error = msj_error.concat("Hay mas de un '.' en un numero, la entrada no es valida")
                }
            }
        }
    }


    if(res == false){
        console.table(msj_error);
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

//---------------Gauss, para buscar raices racionales de polinomio de coeficientes enteros---------------------------//

function raicesRacionales(poly_obj){
    let res = {};                   //res {raiz:multiplicidad}
    let n = poly_obj.grado;
    let coef_ppal = poly_obj.coeffs[n];
    let coef_indep;
    if(poly_obj.coeffs[0] === undefined){ 
        // Si coef_indep == 0 --> una raiz es cero, busco la multiplicidad de esta raiz:
        let grado_minimo = Object.keys(poly_obj.coeffs)[0];
        res[0] = grado_minimo;
        // Saco factor comun la x de menor grado:
        let potencias = Object.keys(poly_obj.coeffs);
        let coef = {} //donde voy a guardar el dicc para crear el polinomio resultante de sacar factor comun x de menor grado
        for(const p of potencias){
            coef[p-grado_minimo] = poly_obj.coeffs[p];
        }
        poly_obj = new Polinomio(coef);
        coef_indep = poly_obj.coeffs[0]; 
    }else{
        coef_indep = poly_obj.coeffs[0]; 
    }

    const divisores_indep = divisores(coef_indep);
    const divisores_ppal = divisores(coef_ppal);


    
    return res;


}
// Funcion auxiliar que busca divisores de un numero entero:

function divisores(n){
    res = [];
    for(let i = 1; i <= Math.abs(n); i++){
        n%i==0? res.push(i) : true;
    }
    return res;
}

//Funcion auxiliar que dada dos listas (lsA lsB) de enteros te devuelve una lista con los elementos de la lsA divido los elementos de la lsB

function divisionEntreListas(lsA, lsB){
    let res = [];
    for(let a of lsA){
        for(let b of lsB){
            res.push(a/b);
        }
    }

    res = [...new Set(res)];
    return res;
}


//--------------------------------- Clase Polinomio--------------------------------------------------------//

class Polinomio{
    constructor(coeffs, x = "x"){
        this.x = x; //Variable
        this.coeffs = {}; //coeficientes

        if(Array.isArray(coeffs)){
            coeffs.map((e,i) => {       //Recorro array y solo me quedo con los coeficientes no nulos
                if(e != 0){
                    this.coeffs[i] = e;
                }else if(e == 0 && i == 0){
                    this.coeffs[i] = e;
                }
            });
        }else if(typeof coeffs === "object"){           //Recorro el diccionario y solo me quedo con los coeficientes no nulos
                const keys = ordenarClaves(coeffs);
                for(let k of keys){
                    if(coeffs[k] != 0){
                        const e = coeffs[k];
                        this.coeffs[k] = e;
                    } else if(coeffs[k] == 0 && k ==0){
                        const e = coeffs[k];
                        this.coeffs[k] = e;
                    }
                }
        }

        this.grado = ordenarClaves(this.coeffs)[0]; //El grado es la potencia mas grande del polinomio
    }

    completarCoeffs(){
        const n = this.grado;
        const coeffsCompletos = {}
        for(let i = 0; i < n + 1; i++ ){
            if(typeof this.coeffs[i] === 'undefined'){
                coeffsCompletos[i] = 0;
            }else{
                coeffsCompletos[i] = this.coeffs[i];
            }
        }
        return coeffsCompletos;
    }

    sumar(otro){
        const coeffs1 = this.coeffs;
        const coeffs2 = otro.coeffs;
        const coeffsSuma = {};
        const gradoMax = Math.max(this.grado, otro.grado);
        for(let i = 0; i< gradoMax + 1; i++){
            if(typeof coeffs1[i] === 'undefined' && typeof coeffs2[i] != 'undefined'){
                coeffsSuma[i] = coeffs2[i];
            } else if(typeof coeffs2[i] === 'undefined' && typeof coeffs1[i] != 'undefined'){
                coeffsSuma[i] = coeffs1[i];
            }else if(typeof coeffs2[i] != 'undefined' && typeof coeffs1[i] != 'undefined'){
                coeffsSuma[i] = coeffs1[i] + coeffs2[i];
            }
        }
        return new Polinomio(coeffsSuma);
    }

    opuesto(){
        const coeffsOpuesto={}
        const n = this.grado;
        for(let i = 0; i <= n; i++){
            if(typeof this.coeffs[i] != 'undefined'){
                coeffsOpuesto[i] = - this.coeffs[i];
            }
        }
        return new Polinomio(coeffsOpuesto);
    }

    poliToString(){
        let potencias = Object.keys(this.coeffs);
        if(this.coeffs[0]==0){
            potencias.shift();
        }
        let poly_str = "";
        for(let i  = 0 ; i<potencias.length; i++){
            if(i != 0 &&  this.coeffs[potencias[i]] > 0 ){
                poly_str = poly_str.concat("+");
                if(this.coeffs[potencias[i]]!=1){
                    poly_str = poly_str.concat(this.coeffs[potencias[i]].toString());
                }
                
            }else{
                if(this.coeffs[potencias[i]]!=1 && this.coeffs[potencias[i]]!=-1){
                    poly_str = poly_str.concat(this.coeffs[potencias[i]].toString());
                }else{
                    if(potencias[i] == 0){
                        poly_str = poly_str.concat(this.coeffs[potencias[i]].toString());
                    }else{
                        if(this.coeffs[potencias[i]]==-1){
                            poly_str = poly_str.concat("-");
                        }
                    }
                }
            }


            if(potencias[i]==1){
                poly_str = poly_str.concat("x");
            }else if(potencias[i]==0){
                if(this.grado == 0){}
                
            }else{
                poly_str = poly_str.concat("x^{");
                poly_str = poly_str.concat(potencias[i].toString());
                poly_str = poly_str.concat("}");
            }  
        }

        if (poly_str == ""){
            poly_str = poly_str.concat("0");
        }


        return poly_str;
    }

    evaluar(x){
        let res = 0;
        let potencias = Object.keys(this.coeffs);
        for(let p of potencias){
            res = res + this.coeffs[p]*(Math.pow(x, p));
        }
        return res;
    }

    coeficientesEnteros(){
            let res = true;
            let potencias = Object.keys(this.coeffs);
            for(p of potencias){
                Number.isInteger(this.coeffs[p]) ? res &= true : res &= false;
            }
            return res;
    }
  
}



//------------------------------------------------------------------------------------------------------------------------
//Consulto DOM//

let i = 1; // numera cada polinomio ingresado

let polinomios_cargados = [] // lista donde agrego los polinomios que carga el usuario

let btn_cargar_polnomio = document.getElementById("cargar_Polinomio"); // capturo el boton de carga de polinomios

btn_cargar_polnomio.addEventListener('click', () => cargar()); // Le asigno al btn la funcion cargar cuando se clickea

function cargar(){
    
    const poly = document.getElementById('input_poly');     // capturo el bloque donde va a estar el input
    const polinomios = document.getElementById('polinomios');   // capturo la seccion polinomios
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
        
        polinomios.appendChild(div);
        //-------- creo un parrafo <p></p> y le asigno la clase poli_i (donde i cuenta la cantidad de polinomios) ---//
       
        let p = document.createElement("p");    
        p.classList.add("poli_" + i);
        //---------------------------------------//

        let poly_text = document.createTextNode("P" + "\\(_{" + i + "}\\)" + "(x) = " +  "\\( " + poly_obj.poliToString() +" \\)  " );
        p.appendChild(poly_text);
        div.appendChild(p);
        let p2 = document.createElement("p");
        p2.classList.add("poli_" + i);
        let propiedades = document.createTextNode("El grado de P" + "\\(_{" + i +"}\\)(x)" + " es " +  poly_obj.grado  );
        p2.appendChild(propiedades);
        div.appendChild(p2);
        MathJax.typesetPromise();
        i++;
    }
}



