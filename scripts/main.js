import * as poli from '../scripts/polinomio'

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
