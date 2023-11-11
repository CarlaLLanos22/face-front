import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { obrasSociales } from "../../json/obrasociales";

function Horarios() {
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const [horario,setHorario] = useState({
      id_medico: null,
      dia: null,
      rango: null,
      hora_inicio:null,
      hora_final:null
    })

    const [horarios, setHorarios] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/horario",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((horarios) => setHorarios(horarios));

      fetch("http://localhost:3000/medicos",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
        .then((res) => res.json())
        .then((medicos) => { 
          setMedicos(medicos);
          setHorario({
            ...horario,
            id_medico: medicos[0].medico.id_medico
          })
        });
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickHorario = async (horarioClick) => {
      setHorarioSeleccionado(horarioClick.id_horario)
      const fecha = horarioClick.dia.slice(0,10)
      setHorario({...horarioClick, dia: fecha})
      setVisible(true)
    };
  
    const eliminarHorario = async (horarioId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/horario/${horarioId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setHorarios(horarios.filter((horario) => horario.horario.id_horario !== horarioId));
          limpiarForm()
        } else {
          alert("Fallo al quitar horario");
        }
      }
      setVisible(false)
    };
  
    const agregarHorario = async () => {
      const res = await fetch("http://localhost:3000/horario", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          horario: {
            id_medico: horario.id_medico,
            dia: horario.dia+" 00:00:00",
            rango: horario.rango,
            hora_inicio: horario.hora_inicio+":00",
            hora_final: horario.hora_final+":00"
          },
        }),
      });
  
      if (res.ok) {
        const horarioNuevo = await res.json();
        setHorarios([...horarios, { horario: horarioNuevo, medico: { id_medico: horarioNuevo.id_medico } }]);
        limpiarForm()
      } else {
        alert(mensajeError())
      }
      setVisible(false)
    };
  
    const edicionHorario = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        let hora_inicio = horario.hora_inicio
        let hora_final = horario.hora_final
        hora_inicio.length == 8 ? hora_inicio = hora_inicio : hora_inicio = hora_inicio + ":00"
        hora_final.length == 8 ? hora_final = hora_final : hora_final = hora_final + ":00" 
        const res = await fetch(`http://localhost:3000/horario/${horarioSeleccionado}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            horario:{
              id_medico: horario.id_medico,
              dia: horario.dia+" 00:00:00",
              rango: horario.rango,
              hora_inicio: hora_inicio,
              hora_final: hora_final
            },
          }),
        });
        if (res.ok) {
          const horarioEditado = { horario: horario, medico: { id_medico:horario.id_medico } }
          setHorarios(
            horarios.map((item)=> item.horario.id_horario == horarioSeleccionado?horarioEditado:item )
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la horario.");
        }
      }
  
    }
    
    function limpiarForm() {
      setHorario({
        dia: '',
        rango: '',
        hora_final:'',
        obra_social:''
      })
      setVisible(false)
    }

    function mensajeError(){
      let mensaje="Ha ocurrido un error"
      horario.dia == null ? mensaje = mensaje + "\n Dia vacio" : null
      horario.rango == null ? mensaje = mensaje + "\n rango vacio" : null
      horario.hora_final == null ? mensaje = mensaje + "\n hora_final vacio" : null
      horario.hora_inicio == null ? mensaje = mensaje + "\n obra_social vacio" : null
      return mensaje
    }

    return (
        <>
            <main className="md:w-2/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <div className="flex flex-row items-start">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <h2 className="text-3xl font-light text-center">Nuevo Horario</h2>
                    <br></br>
                        <div className=" bg-white p-3 shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Dia">Dia</label>
                                    <input
                                        onChange={(e)=>{setHorario({...horario, dia: e.target.value})}}
                                        value={horario.dia}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Dia"
                                        name="Dia"
                                        type="date"
                                        placeholder="Ingresar dia"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Hora Inicio">Hora Inicio</label>
                                    <input
                                        onChange={(e)=>{setHorario({...horario, hora_inicio: e.target.value})}}
                                        value={horario.hora_inicio}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Hora Inicio"
                                        name="Hora Inicio"
                                        type="time"
                                        placeholder="Ingresar Hora Inicio"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Hora Final">Hora Final</label>
                                    <input
                                        onChange={(e)=>{setHorario({...horario, hora_final: e.target.value})}}
                                        value={horario.hora_final}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Hora Final"
                                        name="Hora Final"
                                        type="time"
                                        placeholder="Ingresar hora_final"
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rango">Rango</label>
                                    <input
                                        value={horario.rango}
                                        onChange={(e)=>{setHorario({...horario, rango: e.target.value})}}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="rango"
                                        name="rango"
                                        type="number"
                                        placeholder="Ingresar rango"
                                        required
                                    />
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Medico">Medico</label>
                                    <select value={horario.id_medico} onChange={(e)=>{setHorario({...horario, id_medico: e.target.value})}} className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> 
                                      { medicos.map((item,index) => (<option key={index} value={item.medico.id_medico}>{item.medico.nombre}</option>)) }
                                    </select>
                                
                                </div>
                                {/* Input */}

                                {/* Botón Agregar */}
                                {visible == false && (<button
                                    onClick={()=>{agregarHorario()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                 > Agregar Horario </button>)}
                                {/* Botón Agregar */}

                                {/* Botón Editar */}
                                {visible == true && (<button
                                    onClick={()=>{edicionHorario()}}
                                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                >Editar Horario</button>)}
                                {/* /Botón  Editar*/}
                        </div>
                    </div>
                    <div className="py-2 w-full ml-5 t-0 -mt-12">
                      <h2 className="text-3xl font-light text-center mt-20">Listado de Horarios</h2>
                    
                        <div className="align-middle w-full inline-block shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="w-full ">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Dia
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Hora Inicio
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Hora Final
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Rango
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Horarios" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {horarios.map((item)=>(
                                        <tr key={item.id_horario}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.horario.dia.slice(0,10)}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.horario.hora_inicio}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.horario.hora_final}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.horario.rango}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-center text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span onClick={()=>{eliminarHorario(item.horario.id_horario)}}>🗑️</span>
                                                <span onClick={()=>{clickHorario({ ...item.horario, id_medico: item.medico.id_medico })}}>📝</span>
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

export default Horarios