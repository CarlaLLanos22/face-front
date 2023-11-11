import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { obrasSociales } from "../../json/obrasociales";

function Pacientes() {
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const [paciente,setPaciente] = useState({
      id_usuario: null,
      nombre: null,
      dni: null,
      id_obra_social:null,
      especialidad: null,
      apellido:null,
      obra_social:null
    })

    const [pacientes, setPacientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/pacientes",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((pacientes) => setPacientes(pacientes));

      fetch("http://localhost:3000/usuarios",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
        .then((res) => res.json())
        .then((usuarios) => { 
          setUsuarios(usuarios);
          setPaciente({
            ...paciente,
            id_usuario: usuarios[0].id_usuario, 
            id_obra_social: obrasSociales[0].id
          })
        });
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickPaciente = async (pacienteClick) => {
      setPacienteSeleccionado(pacienteClick.id_paciente)
      setPaciente(pacienteClick)
      setVisible(true)
    };
    
    const nombreObraSocial = (id) => {
      return obrasSociales.filter((item)=>item.id == id)[0].name
    }
  
    const eliminarPaciente = async (pacienteId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/pacientes/${pacienteId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setPacientes(pacientes.filter((paciente) => paciente.paciente.id_paciente !== pacienteId));
          limpiarForm()
        } else {
          alert("Fallo al quitar paciente");
        }
      }
      setVisible(false)
    };
  
    const agregarPaciente = async () => {
      const res = await fetch("http://localhost:3000/pacientes", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          paciente: {
            id_usuario: paciente.id_usuario,
            nombre: paciente.nombre,
            dni: paciente.dni,
            id_obra_social: paciente.id_obra_social,
            apellido: paciente.apellido,
            obra_social: paciente.id_obra_social !== 0 ? true : false
          },
        }),
      });
  
      if (res.ok) {
        const pacienteNuevo = await res.json();
        setPacientes([...pacientes, { paciente: pacienteNuevo, usuario: { id_usuario: pacienteNuevo.id_usuario } }]);
        limpiarForm()
      } else {
        alert(mensajeError())
      }
      setVisible(false)
    };
  
    const edicionPaciente = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        const res = await fetch(`http://localhost:3000/pacientes/${pacienteSeleccionado}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            paciente:{
              id_usuario: paciente.id_usuario,
              nombre: paciente.nombre,
              dni: paciente.dni,
              id_obra_social: paciente.id_obra_social,
              apellido: paciente.apellido,
              obra_social: paciente.id_obra_social !== 0 ? true : false
            },
          }),
        });
        if (res.ok) {
          const pacienteEditado = { paciente: paciente, usuario: { id_usuario:paciente.id_usuario } }
          setPacientes(
            pacientes.map((item)=> item.paciente.id_paciente == pacienteSeleccionado?pacienteEditado:item )
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la paciente.");
        }
      }
  
    }
    
    function limpiarForm() {
      setPaciente({
        nombre: '',
        dni: '',
        apellido:'',
        obra_social:''
      })
      setVisible(false)
    }

    function mensajeError(){
      let mensaje="Ha ocurrido un error"
      paciente.nombre == null ? mensaje = mensaje + "\n Nombre vacio" : null
      paciente.dni == null ? mensaje = mensaje + "\n DNI vacio" : null
      paciente.apellido == null ? mensaje = mensaje + "\n apellido vacio" : null
      paciente.id_obra_social == null ? mensaje = mensaje + "\n obra_social vacio" : null
      return mensaje
    }

    return (
        <>
            <main className="md:w-2/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <div className="flex flex-row items-start">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <h2 className="text-3xl font-light text-center">Nuevo Paciente</h2>
                    <br></br>
                        <div className=" bg-white p-3 shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nombre">Nombre</label>
                                    <input
                                        onChange={(e)=>{setPaciente({...paciente, nombre: e.target.value})}}
                                        value={paciente.nombre}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Nombre"
                                        name="Nombre"
                                        type="text"
                                        placeholder="Ingresar nombre"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Apellido">Apellido</label>
                                    <input
                                        onChange={(e)=>{setPaciente({...paciente, apellido: e.target.value})}}
                                        value={paciente.apellido}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Apellido"
                                        name="Apellido"
                                        type="text"
                                        placeholder="Ingresar apellido"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DNI">DNI</label>
                                    <input
                                        value={paciente.dni}
                                        onChange={(e)=>{setPaciente({...paciente, dni: e.target.value})}}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="DNI"
                                        name="DNI"
                                        type="number"
                                        placeholder="Ingresar dni"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Usuario">Usuario</label>
                                    <select value={paciente.id_usuario} onChange={(e)=>{setPaciente({...paciente, id_usuario: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      { usuarios.map((item,index) => (<option key={index} value={item.id_usuario}>{item.username}</option>)) }
                                    </select>

                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Obra Social">Obra Social</label>
                                    <select  value={paciente.id_obra_social}  onChange={(e)=>{setPaciente({...paciente, id_obra_social: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      { obrasSociales.map((item,index) => (<option  key={index} value={item.id}>{item.name.toUpperCase()}</option>)) }
                                    </select>
                                
                                </div>
                                {/* Input */}

                                {/* Botón Agregar */}
                                {visible == false && (<button
                                    onClick={()=>{agregarPaciente()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                 > Agregar Paciente </button>)}
                                {/* Botón Agregar */}

                                {/* Botón Editar */}
                                {visible == true && (<button
                                    onClick={()=>{edicionPaciente()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                >Editar Paciente</button>)}
                                {/* /Botón  Editar*/}
                        </div>
                    </div>
                    <div className="py-2 w-full ml-5 t-0 -mt-12">
                      <h2 className="text-3xl font-light text-center mt-20">Listado de Pacientes</h2>
                    
                        <div className="align-middle w-full inline-block shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="w-full ">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Apellido
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            DNI
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Obra Social
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Pacientes" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {pacientes.map((item)=>(
                                        <tr key={item.id_paciente}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.paciente.nombre}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.paciente.apellido}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.paciente.dni}
                                            </th>
                                            { item.paciente.id_obra_social != 0 && (<th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                              ✅
                                            </th>)}
                                            { item.paciente.id_obra_social == 0 && (<th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                              ❌
                                            </th>)} 
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span onClick={()=>{eliminarPaciente(item.paciente.id_paciente)}}>🗑️</span>
                                                <span onClick={()=>{clickPaciente({ ...item.paciente, id_usuario: item.usuario.id_usuario })}}>📝</span>
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

export default Pacientes