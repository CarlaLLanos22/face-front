import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { especialidades } from "../../json/especialidades";

function Medicos() {
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const [medico,setMedico] = useState({
      id_usuario: null,
      nombre: null,
      dni: null,
      id_especialidad:null,
      especialidad: null,
      matricula:null,
      telefono:null
    })

    const [medicos, setMedicos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [medicoSeleccionado, setMedicoSeleccionado] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/medicos",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((medicos) => setMedicos(medicos));

      fetch("http://localhost:3000/usuarios",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
        .then((res) => res.json())
        .then((usuarios) => { 
          setUsuarios(usuarios);
          setMedico({
            ...medico,
            id_usuario: usuarios[0].id_usuario, 
            id_especialidad: especialidades[0].id
          })
        });
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickMedico = async (medicoClick) => {
      setMedicoSeleccionado(medicoClick.id_medico)
      setMedico(medicoClick)
      setVisible(true)
    };
    
    const nombreEspecialidad = (id) => {
      return especialidades.filter((item)=>item.id == id)[0].name
    }
  
    const eliminarMedico = async (medicoId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/medicos/${medicoId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setMedicos(medicos.filter((medico) => medico.medico.id_medico !== medicoId));
          limpiarForm()
        } else {
          alert("Fallo al quitar medico");
        }
      }
      setVisible(false)
    };
  
    const agregarMedico = async () => {
      const res = await fetch("http://localhost:3000/medicos", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          medico: {
            id_usuario: medico.id_usuario,
            nombre: medico.nombre,
            dni: medico.dni,
            id_especialidad: medico.id_especialidad,
            matricula: medico.matricula,
            telefono: medico.telefono
          },
        }),
      });
  
      if (res.ok) {
        const medicoNuevo = await res.json();
        setMedicos([...medicos, { medico: medicoNuevo, usuario: { id_usuario: medicoNuevo.id_usuario } }]);
        limpiarForm()
      } else {
        alert(mensajeError())
      }
      setVisible(false)
    };
  
    const edicionMedico = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        const res = await fetch(`http://localhost:3000/medicos/${medicoSeleccionado}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            medico:{
              id_usuario: medico.id_usuario,
              nombre: medico.nombre,
              dni: medico.dni,
              id_especialidad: medico.id_especialidad,
              matricula: medico.matricula,
              telefono: medico.telefono
            },
          }),
        });
        if (res.ok) {
          const medicoEditado = { medico: medico, usuario: { id_usuario:medico.id_usuario } }
          setMedicos(
            medicos.map((item)=> item.medico.id_medico == medicoSeleccionado?medicoEditado:item )
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la medico.");
        }
      }
  
    }
    
    function limpiarForm() {
      setMedico({
        nombre: '',
        dni: '',
        matricula:'',
        telefono:''
      })
      setVisible(false)
    }

    function mensajeError(){
      let mensaje="Ha ocurrido un error"
      medico.nombre == null ? mensaje = mensaje + "\n Nombre vacio" : null
      medico.dni == null ? mensaje = mensaje + "\n DNI vacio" : null
      medico.matricula == null ? mensaje = mensaje + "\n matricula vacio" : null
      medico.telefono == null ? mensaje = mensaje + "\n telefono vacio" : null
      return mensaje
    }

    return (
        <>
            <main className="md:w-2/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <div className="flex flex-row items-start">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <h2 className="text-3xl font-light text-center">Nuevo Medico</h2>
                    <br></br>
                        <div className=" bg-white p-3 shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nombre">Nombre</label>
                                    <input
                                        onChange={(e)=>{setMedico({...medico, nombre: e.target.value})}}
                                        value={medico.nombre}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Nombre"
                                        name="Nombre"
                                        type="text"
                                        placeholder="Ingresar nombre"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DNI">DNI</label>
                                    <input
                                        value={medico.dni}
                                        onChange={(e)=>{setMedico({...medico, dni: e.target.value})}}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="DNI"
                                        name="DNI"
                                        type="number"
                                        placeholder="Ingresar dni"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Matricula">Matricula</label>
                                    <input
                                        onChange={(e)=>{setMedico({...medico, matricula: e.target.value})}}
                                        value={medico.matricula}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Matricula"
                                        name="Matricula"
                                        type="number"
                                        placeholder="Ingresar matricula"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Teléfono">Teléfono</label>
                                    <input
                                        onChange={(e)=>{setMedico({...medico, telefono: e.target.value})}}
                                        value={medico.telefono}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Teléfono"
                                        name="Teléfono"
                                        type="number"
                                        placeholder="Ingresar telefono"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Usuario">Usuario</label>
                                    <select value={medico.id_usuario} onChange={(e)=>{setMedico({...medico, id_usuario: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      { usuarios.map((item,index) => (<option key={index} value={item.id_usuario}>{item.username}</option>)) }
                                    </select>

                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Especialidades">Especialidades</label>
                                    <select  value={medico.id_especialidad}  onChange={(e)=>{setMedico({...medico, id_especialidad: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      { especialidades.map((item,index) => (<option  key={index} value={item.id}>{item.name.toUpperCase()}</option>)) }
                                    </select>
                                
                                </div>
                                {/* Input */}

                                {/* Botón Agregar */}
                                {visible == false && (<button
                                    onClick={()=>{agregarMedico()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                 > Agregar Medico </button>)}
                                {/* Botón Agregar */}

                                {/* Botón Editar */}
                                {visible == true && (<button
                                    onClick={()=>{edicionMedico()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                >Editar Medico</button>)}
                                {/* /Botón  Editar*/}
                        </div>
                    </div>
                    <div className="py-2 w-full ml-5 t-0 -mt-12">
                      <h2 className="text-3xl font-light text-center mt-20">Listado de Medicos</h2>
                    
                        <div className="align-middle w-full inline-block shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="w-full ">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            DNI
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Especialidad
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Medicos" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {medicos.map((item)=>(
                                        <tr key={item.id_medico}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.medico.nombre}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.medico.dni}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {nombreEspecialidad(item.medico.id_especialidad)}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span onClick={()=>{eliminarMedico(item.medico.id_medico)}}>🗑️</span>
                                                <span onClick={()=>{clickMedico({ ...item.medico, id_usuario: item.usuario.id_usuario })}}>📝</span>
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

export default Medicos