function ordenarClaves(obj){
    return [...Object.keys(obj)] //Devuelve un array con las claves del diccionario obj
    .map(parseFloat) // convierte string a float
    .sort((a,b) => b - a); //ordena en forma descendente 
}



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
                if(this.coeffs[potencias[i]]!=1){
                    poly_str = poly_str.concat(this.coeffs[potencias[i]].toString());
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
  
}




//Consulto DOM//
let i = 1;
function cargar(){
    const poly = document.getElementById('input_poly');
    const polinomios = document.getElementById('polinomios');
    let poly_str = poly.value;
    poly_str = poly_str.replace(/\s+/g,''); // elimino todos los espacios
    if(poly_str[0]=="+"){                          //elimino el + adelante de todo
        let arr = poly_str.split("");
        arr.shift();
        poly_str = arr.join("");
    }
    if(validarInput(poly_str)){         //Si es entrada valida
        let poli_obj = inputToPolinomio(poly_str);
        let p = document.createElement("p");
        p.classList.add("poli_" + i);
        let funcion = document.createTextNode("P" + "\\(_{" + i + "}\\)" + "(x) = " +  "\\( " + poli_obj.poliToString() +" \\)  " );
        p.appendChild(funcion);
        polinomios.appendChild(p);
        let p2 = document.createElement("p");
        p.classList.add("poli_" + i);
        let propiedades = document.createTextNode("El grado de P" + "\\(_{" + i +"}\\)(x)" + " es " +  poli_obj.grado  );
        p.appendChild(propiedades);
        polinomios.appendChild(p2);
        MathJax.typesetPromise();
        i++;
    }
}

//Funcion que dado un string valido lo convierte en un polinomio de la clase polinomio

function validarInput(poly_str){
    let res = true;
    let poly_arr = poly_str.split("");

    let char_validos = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9", "x", ".", "^", "+", "-"];

    let char_nros = ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9"]

    //Verifico que todos los caracteres de poly_str sean validos:

    for(let i = 0 ; i < poly_arr.length; i++){
        char_validos.includes(poly_arr[i]) ? res : res = false;
    }

    //Toda potencia(^) tiene una x antes y un numero despues.
    let pwd_indices = poly_arr.reduce((c, v, i) => v =="^" ? c.concat(i) : c, []);
    for(let j = 0; j < pwd_indices.length; j++){
        char_nros.includes(poly_arr[pwd_indices[j]+1]) ? res : res = false;
        (poly_arr[pwd_indices[j]-1] == "x") ? res : res = false;
    }
    //Toda potencia(.) tiene un nro antes y un nro despues.
    let puntito_indices = poly_arr.reduce((c, v, i) => v =="." ? c.concat(i) : c, []);
    for(let j = 0; j < puntito_indices.length; j++){
        char_nros.includes(poly_arr[puntito_indices[j]+1]) ? res : res = false;
        char_nros.includes(poly_arr[puntito_indices[j]-1]) ? res : res = false;
    }

    // No hay dos signos juntos:
    
    

    return res;
}

function inputToPolinomio(poly_str){        
    let poly_obj = new Polinomio([0]);
    let poly_arr = poly_str.split("");
    let n = poly_arr.length;
    let coef = [];
    let pwd = [];
    for(let i = 0; i < n; i++){
        if((poly_arr[i] == "+" || poly_arr[i] == "-") && i!=0  ){
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
            coef = [];
            coef.push(poly_arr[i]);
            pwd = [];
        }else{
            if(poly_arr[i] != "x"){
                coef.push(poly_arr[i]);
            }else{
                if(poly_arr[i+1] == "^"){
                    for(let j = i+2; j< n && (poly_arr[j] != "+" && poly_arr[j] != "-"); j++){
                        pwd.push(poly_arr[j]);
                        i = j;  // i+1 hay signo o termina array
                    }

                }else{
                    pwd = ["1"];
                }
            }
        }
    }
    //Agrego el ultimo monomio
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

