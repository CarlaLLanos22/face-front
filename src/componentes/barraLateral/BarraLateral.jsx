import { useAuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function BarraLateral() {

  const { logout } = useAuthContext(); 

  const navigate = useNavigate();

  const onLogout = () => {
    logout(()=> navigate("/login", { replace: true }))
  }

  const checkTipo = () =>{
    if (localStorage.getItem("token")!= undefined){
      return jwtDecode(localStorage.getItem("token")).tipo
    }else{
      return 'Sin Tipo'
    } 
  }

  return (
    <>
    <aside className="md:w-2/5 lg:w-4/5 xl:w-1/5 bg-blue-500 px-5 py-10">
            <h1 className="uppercase text-white tracking-wide text-2xl  font-bold mt-2">FACE APP</h1>
            <p className="mt-10 text-white"><b>MENÚ</b></p>
            <nav className="mt-8">
                { checkTipo() == "Medico" && (
                <>
                <a href="/medicos" className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-400">
                👩‍⚕️ Medicos
                </a>
                <a href="/pacientes" className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-400">
                🧍‍♀️ Pacientes
                </a>
                <a href="/usuarios" className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-400">
                👤 Usuarios
                </a>
                <a href="/horarios" className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-400">
                🕑 Horarios
                </a>
                </>)}
                { checkTipo() == "Paciente" && (
                <>
                <a href="/turnos" className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-400">
                🕑 Turnos
                </a>
                </>)}
            </nav>
          <a style={{'background':'none', 'margin-top':'100px'}} 
          href="#"
          onClick={()=>{onLogout()}}
          className="px-3 py-1 text-white block hover:bg-blue-700 hover:text-yellow-400 bg-blue-700"
        >🔒 Cerrar Sesión</a>
    </aside>
    </>
  )
}

export default BarraLateral
