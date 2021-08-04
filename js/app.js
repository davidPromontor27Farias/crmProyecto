//Creamos un ife para que lo que creemos aqui no se tope con lo demas
(function(){
    let DB;
    const divInformacion = document.querySelector('.body-informacion');

    document.addEventListener('DOMContentLoaded', ()=>{

       crearDB(); 

       //Este codigo se ejecutara si existe la base de datos indexedDB

       if(window.indexedDB.open('crm', 1)){
           insertarCliente();
       }

       divInformacion.addEventListener('click', eliminarRegistro);
    });

    //Crea la base de datos d eindexedDB
    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function(){
            console.log('Hubo un error');
        }

        //En caso de que si se cree la base de datos
        crearDB.onsuccess = function(){
            DB = crearDB.result;

        }
        //Creamos la base de datos
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;

            //le decimos su estructura y le pasamos el id para identificarlo por su id
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true});


            //creamos los campos con el nombre del campo, el nombre del keypath y si sera unico
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('Base creada exitosamente');
        }
    }

    function insertarCliente(){
        //Abrimos la conexion

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        }
        abrirConexion.onsuccess = function(){
            //Obtemeos el resultado de la conexion
            DB = abrirConexion.result;

            //creamos el objectStore
            const objectStore = DB.transaction('crm').objectStore('crm');
            
            //Utilizamos cursores para iterar sobre los resultados
            objectStore.openCursor().onsuccess = function(e){
                //Instanciamos los valores
                const cursor = e.target.result;

                //Si hay valores se ejecutara lo sifuiente
                if(cursor){
                    //Extraemos los valores
                    const {nombre, email, telefono, empresa, id} = cursor.value;
                    

                    divInformacion.classList.add('informacion-cliente');
                    divInformacion.innerHTML += `
                    <tr>
                        <td>
                            <p class="campos nombre">${nombre}</p>
                            <p class="campos email">${email}</p>
                        </td>
                        <td>
                            <p class="campos telefono">${telefono}</p>
                        </td>
                        <td>
                            <p class="campos empresa">${empresa}</p>
                        </td>
                        <td>
                            <a class="btn btn-editar" href="editarCliente.html?id=${id}">Editar</a>
                            <a class="btn btn-eliminar eliminar" data-cliente="${id}">Eliminar</a>
                        </td>
                    
                    </tr>
                    `

                    cursor.continue();
                }
                else{
                    console.log('No hay mas resultados')
                }
            }

        }

    }
    function eliminarRegistro(e){

        if(e.target.classList.contains('eliminar')){
            //Accedemos al atributo de eliminar que fue puesto como data
            const idEliminar = Number(e.target.dataset.cliente);
            
            //Confirmacion de eliminar
            const confirmar = confirm('Deseas Eliminar el cliente');
     

            if(confirmar === true){

                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                
                objectStore.delete(idEliminar);


                transaction.onerror = function(){
       
                }
                transaction.oncomplete = function(){

                    //Eliminar el registro seleccionado
                    e.target.parentElement.parentElement.remove();
                }
            }
        }
    }
})();