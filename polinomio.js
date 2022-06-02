function ordenarClaves(obj){
    return [...Object.keys(obj)] //Devuelve un array con las claves del diccionario obj
    .map(parseFloat) // convierte string a float
    .sort((a,b) => b - a); //ordena en forma descendente 
}


const coeffs = {1:4, 3:2, 2:0, 0:-3};
console.log(ordenarClaves(coeffs));

class Polinomio{
    constructor(coeffs, x = "x"){
        this.x = x; //Variable
        this.coeffs = {}; //coeficientes

        if(Array.isArray(coeffs)){
            coeffs.map((e,i) => {       //Recorro array y solo me quedo con los coeficientes no nulos
                if(e != 0){
                    this.coeffs[i] = e;
                }
            });
        }else if(typeof coeffs === "object"){           //Recorro el diccionario y solo me quedo con los coeficientes no nulos
                const keys = ordenarClaves(coeffs);
                for(let k of keys){
                    if(coeffs[k] != 0){
                        const e = coeffs[k];
                        this.coeffs[k] = e;
                    }
                }
        }
        this.grado = ordenarClaves(this.coeffs)[0]; //El grado es la potencia mas grande del polinomio
    }
}

const poliA = new Polinomio([3,1,2]);
const poliB = new Polinomio({5:4, 10:2});

console.log(poliA.grado);
console.log(poliB.grado);