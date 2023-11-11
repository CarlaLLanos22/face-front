import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { generate, count } from "random-words";

function Usuarios() {
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const [usuario,setUsuario] = useState({
        username : '',
        password:  '',
        email: '',
        ultimo_login: "2023-01-01 00:00:00",
        tipo: 'Medico',
        code_activate: '',
        habilitado: 0
    })

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/usuarios",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((usuarios) => setUsuarios(usuarios));
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickUsuario = async (usuario) => {
      setUsuarioSeleccionado(usuario.id_usuario)
      setUsuario(usuario)
      setVisible(true)
    };
    
  
    const eliminarUsuario = async (usuarioId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== usuarioId));
        } else {
          alert("Fallo al quitar usuario");
        }
      }
      limpiarForm()
      setVisible(false)
    };
  
    const agregarUsuario = async () => {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario: {
            username: usuario.username,
            password:  usuario.password,
            email: usuario.email,
            ultimo_login: "2023-01-01 00:00:00",
            tipo: usuario.tipo,
            code_activate: generate({ minLength: 9, maxLength: 9 }),
            habilitado: parseInt(usuario.habilitado)
          },
        }),
      });
  
      if (res.ok) {
        const usuarioNuevo = await res.json();
        setUsuarios([...usuarios, usuarioNuevo]);
        limpiarForm()
      } else {
        alert(mensajeError())
      }
      setVisible(false)
    };
  
    const edicionUsuario = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        const res = await fetch(`http://localhost:3000/usuarios/${usuarioSeleccionado}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            usuario:{
              username: usuario.username,
              password: usuario.password,
              email: usuario.email,
              ultimo_login: "2023-01-01 00:00:00",
              tipo: usuario.tipo,
              code_activate: generate({ minLength: 9, maxLength: 9 }),
              habilitado: parseInt(usuario.habilitado)
            },
          }),
        });
        if (res.ok) {
          setUsuarios(
            usuarios.map((item)=> item.id_usuario == usuarioSeleccionado?usuario:item)
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la usuario.");
        }
      }
  
    }
    
    function limpiarForm() {
      setUsuario({
        username : '',
        password:  '',
        email: '',
        ultimo_login: "2023-01-01 00:00:00",
        tipo: 'Medico',
        code_activate: '',
        habilitado: 0
      })
      setVisible(false)
    }

    function mensajeError(){
      let mensaje="Ha ocurrido un error"
      usuario.username == null ? mensaje = mensaje + "\n Username vacio" : null
      usuario.password == null ? mensaje = mensaje + "\n Password vacio" : null
      usuario.email == null ? mensaje = mensaje + "\n Email vacio" : null
      return mensaje
    }

    return (
        <>
            <main className="md:w-2/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <div className="flex flex-row items-start">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <h2 className="text-3xl font-light text-center">Nuevo Usuario</h2>
                    <br></br>
                        <div className=" bg-white p-3 shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Username">Username</label>
                                    <input
                                        onChange={(e)=>{setUsuario({...usuario, username: e.target.value})}}
                                        value={usuario.username}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Username"
                                        name="Username"
                                        type="text"
                                        placeholder="Ingresar username"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Password">Password</label>
                                    <input
                                        onChange={(e)=>{setUsuario({...usuario, password: e.target.value})}}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Password"
                                        name="Password"
                                        type="password"
                                        placeholder="Ingresar password"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">Email</label>
                                    <input
                                        onChange={(e)=>{setUsuario({...usuario, email: e.target.value})}}
                                        value={usuario.email}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Email"
                                        name="Email"
                                        type="text"
                                        placeholder="Ingresar email"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Tipo">Tipo</label>
                                    <select onChange={(e)=>{setUsuario({...usuario, tipo: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      <option value="Medico" selected={true}>Médico</option> 
                                      <option value="Paciente">Paciente</option>
                                    </select>

                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Tipo">Habilitado</label>
                                    <select onChange={(e)=>{setUsuario({...usuario, habilitado: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      <option value="1">Si</option> 
                                      <option value="0" selected={true}>No</option>
                                    </select>
                                
                                </div>
                                {/* Input */}

                                {/* Botón Agregar */}
                                {visible == false && (<button
                                    onClick={()=>{agregarUsuario()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                 > Agregar Usuario </button>)}
                                {/* Botón Agregar */}

                                {/* Botón Editar */}
                                {visible == true && (<button
                                    onClick={()=>{edicionUsuario()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                >Editar Usuario</button>)}
                                {/* /Botón  Editar*/}
                        </div>
                    </div>
                    <div className="py-2  w-full ml-5 t-0 -mt-12">
                      <h2 className="text-3xl font-light text-center mt-20">Listado de Usuarios</h2>
                    
                        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Habilitado
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Usuarios" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {usuarios.map((item)=>(
                                        <tr key={item.id_usuario}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.username}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.email}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.tipo}
                                            </th>
                                            { item.habilitado == 1 && (<th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                              ✅
                                            </th>)}
                                            { item.habilitado == 0 && (<th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                              ❌
                                            </th>)} 
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span onClick={()=>{eliminarUsuario(item.id_usuario)}}>🗑️</span>
                                                <span onClick={()=>{clickUsuario(item)}}>📝</span>
                                            </th>
                                        </tr>
                                     ))}
                                    {/* Fin del Item del Listado */}
                                </tbody>
                                {/* Fin del Listado */}
                            </table>
                        </div>
                    </div>
                </div>
 

            </main>
        </>
    )
}

export default Usuarios
