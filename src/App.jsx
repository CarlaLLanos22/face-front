import { Route, Routes } from "react-router-dom";
import Login from "./componentes/login/Login.jsx"
import BarraLateral from "./componentes/barraLateral/BarraLateral.jsx"
import Medicos from "./componentes/medicos/Medicos.jsx";
import Usuarios from "./componentes/usuarios/Usuarios.jsx";
import Pacientes from "./componentes/pacientes/Pacientes.jsx";
import Horarios from "./componentes/horarios/Horarios.jsx";
import Turnos from "./componentes/turnos/Turnos.jsx";
import Dashboard from "./componentes/dashboard/Dashboard.jsx";

function App() {
  return (
    <>
    <div style={{'display': 'flex' , 'flexDirection': 'row', 'minHeight': '800px'}}>
        <Routes>
            <Route path="/medicos" element={<><BarraLateral/><Medicos /></>}></Route>
            <Route path="/pacientes" element={<><BarraLateral/><Pacientes /></>}></Route>
            <Route path="/usuarios" element={<><BarraLateral/><Usuarios /></>}></Route>
            <Route path="/horarios" element={<><BarraLateral/><Horarios /></>}></Route>
            <Route path="/turnos" element={<><BarraLateral/><Turnos /></>}></Route>
            <Route path="/login" element={<><Login /></>}></Route>
            <Route path="/dashboard" element={<><BarraLateral/><Dashboard /></>}></Route>
            <Route path="/" element={<><Login /></>}></Route>
        </Routes>
    </div>
    </>
  );
}

export default App;
