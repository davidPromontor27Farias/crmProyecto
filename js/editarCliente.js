(function(){
    let DB;
    let idCliente;
    //Selectores
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('.formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
        conectarDB();

        //Obtener el id
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        //Si hay resuktados se ejecutara la funcion
        if(idCliente){

            setTimeout(() => {
               obtenerCliente(idCliente); 
            }, 100);
            
        }

        formulario.addEventListener('submit', editarCliente );
    })
    //Obtener el cliente
    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readonly');
        //interactuamos con la base de datos
        const objectStore = transaction.objectStore('crm');
        //Abrir solo una conexion
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            //Si hay un resultado se ejecutara lo siguiente
            if(cursor){

                //Para que solo nos traiga el seleccionado
                if(cursor.value.id === Number(id)){

                    //Mandar a llamar la funcion que llenara el formulario
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }
    //Conectarnos a la base de datos
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        }
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }

    function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;


    }
    //Editamos
    function editarCliente(e){
        e.preventDefault();
        //Validamos
        if(nombreInput.value === ''|| emailInput.value === '' || telefonoInput.value === ''|| empresaInput.value === ''){
            imprimirAlerta('Los campos no pueden ir vacios', 'error');

            return;
        }
        //Actualizar los datos
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente),
        }
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }
        transaction.oncomplete = function(){
            imprimirAlerta('Actualizado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
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