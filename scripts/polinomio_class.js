function ordenarClaves(obj){
    return [...Object.keys(obj)] //Devuelve un array con las claves del diccionario obj
    .map(parseFloat) // convierte string a float
    .sort((a,b) => b - a); //ordena en forma descendente 
}



//---------------Gauss, para buscar raices racionales de polinomio de coeficientes enteros---------------------------//

function raicesRacionales(poly_obj){
    let res = {};                   //res {raiz:multiplicidad}
    let n = poly_obj.grado;
    let coef_ppal = poly_obj.coeffs[n];
    let coef_indep;
    if(poly_obj.coeffs[0] == 0){ 
        // Si coef_indep == 0 --> una raiz es cero, busco la multiplicidad de esta raiz:
        let grado_minimo = Object.keys(poly_obj.coeffs)[1];
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

    const posibles_raices = divisionEntreListas(divisores_indep,divisores_ppal);

    for(const r of posibles_raices){
        if(poly_obj.evaluar(r) == 0){
            let multiplicidad = 1;
            let p_deriv = poly_obj.derivada();
            while(p_deriv.evaluar(r) == 0 ){
                multiplicidad += 1;
                p_deriv = p_deriv.derivada();
            }
            res[r] = multiplicidad;
        }
        if(poly_obj.evaluar(-r) == 0){
            let multiplicidad = 1;
            let p_deriv = poly_obj.derivada();
            while(p_deriv.evaluar(-r) == 0 ){
                multiplicidad += 1;
                p_deriv = p_deriv.derivada();
            }
            res[-r] = multiplicidad;
        }
    }

    return res;


}
// Funcion auxiliar que busca divisores de un numero entero:

function divisores(n){
    let res = [];
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

export class Polinomio{
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
        let poly_str = "";
        let potencias = Object.keys(this.coeffs);
        if(this.grado == 0){
            poly_str = poly_str.concat(this.coeffs[0].toString());
        }else{
            if(this.coeffs[0]==0){
                potencias.shift();
            }
            
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


    derivada(){
        let coef_deriv = {};
        const potencias = Object.keys(this.coeffs);
        for(let p of potencias){
            if( p != 0){
                coef_deriv[p-1] = p*this.coeffs[p];
            }
        }
        return new Polinomio(coef_deriv);
    }

    raices(){
        let res = {};

        if(this.grado == 1){
            if(Object.keys(this.coeffs) == 1){
                res[0] = 1;
            }else{
                const raiz = -(this.coeffs[0]/this.coeffs[1]);
                res[raiz] = 1;
            } 
        }else if(this.grado == 2){
            let a,b,c;
            this.coeffs[0] == undefined?  c = 0 : c = this.coeffs[0];
            this.coeffs[1] == undefined?  b = 0 : b = this.coeffs[1];
            a = this.coeffs[2];
            if(b == 0){
                if(c == 0){
                    res[0] = 2;
                }else{
                    if(a*c < 0){
                        const r1 = Math.sqrt(-(c/a));
                        const r2 = -r1;
                        res[r1] = 1;
                        res[r2] = 1; 
                    }
                }
            }else if(b != 0 && c == 0){
                res[0] = 1;
                const r = -b/a;
                res[r] = 1;
            }else{
                const DELTA = b*b - 4*a*c;
                if(DELTA > 0){
                    const r1 = (-b + DELTA)/(2*a);
                    const r2 = (-b - DELTA)/(2*a);
                    res[r1] = 1;
                    res[r2] = 1;
                }else if (DELTA == 0){
                    const r = -b/(2*a);
                    res[r] = 2;
                }
            }
        }else{
            res = raicesRacionales(this);
        }
        
        return res;
    }

    
  
}
