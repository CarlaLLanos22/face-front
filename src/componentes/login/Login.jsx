import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext"


function Login() {

    const {login} = useAuthContext(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from?.pathname || "/Dashboard";
    
    const [usuario,setUsuario] = useState({
        username: '',
        password: ''
    })

    const onSubmit = () => {
        const username = usuario.username
        const password = usuario.password
        login(
          username,
          password,
          () => navigate(from, { replace: true }),
          () => setError(true)
        );
      };

  return (
    <>
      <main className="w-full px-5 py-10 bg-blue-400">
          <h2 className="text-6xl font-light text-white text-center ">FACEAPP</h2>
            <div className="flex flex-col mt-10 items-center">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                          <div className="bg-white p-3">
                          {/* Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Username">Username</label>
                                <input 
                                    onChange={(e)=>{setUsuario({...usuario, username: e.target.value}) }}
                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="Username"
                                    name="Username"
                                    type="text"
                                    placeholder="Ingresar Nombre de Usuario"
                                />
                            </div>
                            {/* Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Password">Password</label>
                                <input 
                                    onChange={(e)=>{ setUsuario({...usuario, password: e.target.value })}}
                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="Password"
                                    name="Password"
                                    type="Password"
                                    placeholder="Introduzca contraseña"
                                />
                            </div>

                            {/* Botón */}
                            <button
                                onClick={()=>{ onSubmit() }}
                                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            >Ingresar</button>
                            {/* /Botón */}

                            {/* Botón */}
                            <button
                                onClick={()=>{ onSubmit() }}
                                className="w-full mt-5 text-black font-bold py-2 px-4 border-b-4  hover:border-blue-500 rounded"
                            >Registrar Usuario</button>
                            {/* /Botón */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}

export default Login
