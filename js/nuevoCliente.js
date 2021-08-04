(function(){
    let DB;
    //Creamos un selector para el formulario
    const formulario = document.querySelector('.formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
       
        //Nos conectamos a la base de datos que creamos en app.js
        conectarDB();

        formulario.addEventListener('submit', validarFormulario);
    });
    

    function validarFormulario(e){
        e.preventDefault();

        //Creamos selectores locales para cada campo del formulario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;


        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            
            imprimirAlerta('Los campos no pueden estar vacios', 'error');
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

})();