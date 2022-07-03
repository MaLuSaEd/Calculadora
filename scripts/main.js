import {Polinomio} from "../scripts/polinomio_class.js";
import * as aux from '../scripts/aux.js'

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
    
    if(aux.validarInput(poly_str)){         //Verifico si el string representa a un polinomio
        if(poly_str[0]=="+"){                          //elimino, si lo tiene,  el "+" adelante de todo
            let arr = poly_str.split("");
            arr.shift();
            poly_str = arr.join("");
        }
        let poly_obj = aux.inputToPolinomio(poly_str);  // paso el string que representa a u polinomio a un objeto de la clase polinomio
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
                if(poly_obj.grado==0){
                    C0_text =  "\\( C_{0} =    \\mathbb{R}  \\)";    
                }else{
                    C0_text =  "\\( C_{0} =  \\)" + "{" + C0_text + "}";
                }
            }
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
            let facto = document.createTextNode("La forma factorizada de P"+ "\\(_{" + i +"}\\)(x) " + "es " +"P" +  "\\(_{" + i + "}\\)" + "(x) = " +  "\\( " + aux.strFactorizada(poly_obj) +" \\)  " );
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





