(function(){
    let DB;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('.formulario')


    document.addEventListener('DOMContentLoaded', ()=>{
        //Nos conectamos a la base de datos
        conectarDB();

        formulario.addEventListener('submit', guardarEdicion);
        //Verificamos el url 
        const parametroURL = new URLSearchParams(window.location.search);
        //obtenemos el id
        const idCliente = parametroURL.get('id');
        
        //SI hay un id nos ejecutara la funcion

        if(idCliente){
            //Ponemos dentro de un settimeout ya que tarda cierto tiempo en consultar la base de datos
            //
            setTimeout(() => {
                editarCliente(idCliente);  
            }, 100);
          
        }

        


    });

    function editarCliente(id){
        //Accedemos a la base de datos crm en su modo lectura y escritura
        const transaction = DB.transaction(['crm'], 'readonly');
        //interactuamos con el objectStore
        const objectStore = transaction.objectStore('crm');
        
        //Vamos a iterar sobe los resultados con un cursor
        const cursorCliente = objectStore.openCursor()
        cursorCliente.onsuccess = function(e){
            //Le añadimos el resultado a la variable cursor
            const cursor = e.target.result;
            //Si todo salio bien se ejecutara lo siguiente
            if(cursor){
        
                //Si el cursor es igual al id del que queremos editar
                if(cursor.value.id === Number(id)){

                    //Funcion que llenara el formulario previo
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }
    //Llenamos los campos con la informacion previa
    function llenarFormulario(valores){
        const {nombre, email, telefono, empresa} = valores;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
    


    function conectarDB(){
        //Abrimos la conexion
        const conexionDB = window.indexedDB.open('crm', 1);
        
        conexionDB.onerror = function(){
            console.log('Hubo un error');
        }

        conexionDB.onsuccess = function(){
            DB = conexionDB.result;
        }
    }
    function guardarEdicion(e){
        e.preventDefault();
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }
    }
})();