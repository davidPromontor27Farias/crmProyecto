(function(){
    let DB;
    //Creamos un selector para el formulario
    const formulario = document.querySelector('.formulario');

    document.addEventListener('DOMContentLoaded', ()=>{

        //Nos conectamos a la base de datos que creamos en app.js
        conectarDB();

        formulario.addEventListener('submit', validarFormulario);
    });
    
    function conectarDB(){
        //Nos conectamos a la base de datos
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        }
        abrirConexion.onsuccess = function(){
            //Instancia de que todo se conecto bien
            DB = abrirConexion.result;
        }
    
    }    

    function validarFormulario(e){
        e.preventDefault();

        //Creamos selectores locales para cada campo del formulario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;


        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            
            imprimirAlerta('Los campos no pueden estar vacios', 'error');

            return;
        }

        //Creamos un objeto con la informacion obtenida

        const cliente = {
            nombre, 
            email,
            telefono,
            empresa,
            id : Date.now()
        }
        
        //Creamos una funcion
        nuevoCliente(cliente);
    }
    function nuevoCliente(cliente){
        //Nos conectamos a la base de datos
        const transaction = DB.transaction(['crm'], 'readwrite');
        
        //Crear un objeto
        const objectStore = transaction.objectStore('crm');
        //Lo añadimos
        objectStore.add(cliente);

        transaction.onerror = function(){
            imprimirAlerta('Lo sentimos, el correo ya ha sido registrado', 'error');
        }
        transaction.oncomplete = function(){
            imprimirAlerta('Agregado Correctamente')

            //que nos lleve a la pagina principal al agregarlo correctamente

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

    function imprimirAlerta(alerta, tipo){
        const mensaje = document.createElement('DIV');
        mensaje.textContent = alerta;
    
        const advertencia = document.querySelector('.alerta');
    
        if(!advertencia){
            
            mensaje.classList.add('alerta');
    
            if( tipo === 'error'){
                mensaje.classList.add('mensaje-error');
            }
            else{
                mensaje.classList.add('mensaje-correcto');
            }
    
            formulario.insertBefore(mensaje, document.querySelector('.boton-agregar'));
    
        
            setTimeout(() => {
                mensaje.remove();
            }, 2000);
    
        }
    
    
    }    

})();