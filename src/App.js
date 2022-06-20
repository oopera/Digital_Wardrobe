import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, Redirect, Navigate
} from "react-router-dom";
import './App.css';
import {useEffect, useState} from "react";
import React from "react";

function App() {
    const [kleidung, setKleidung] = useState([]);
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        async function getProducts() {
            const response = await fetch(`http://localhost:5000/Kleiderschrank/Kleidung`);
            if (!response.ok) {
                const message = `Products could not be loaded`;
                window.alert(message);
                return;
            }
            const prodDB = await response.json();
            setKleidung(prodDB);
        }
        getProducts();
    }, [kleidung.length]);

    console.log(kleidung)

    return (
        <Router>
                <header>
                </header>
                    <Routes>
                        <Route path="/" element={<Login/>}>
                        </Route>
                        <Route path="/Main" element={<Main/>}>
                        </Route>
                    </Routes>

        </Router>
    );


    function Login() {
        const [form, setForm] = useState({
            email: "",
            password: "",
        });

        function updateForm(value) {
            return setForm((prev) => {
                return {...prev, ...value};
            });
        }

        async function login() {
            console.log(form)
            document.getElementById("CorrectionBox").innerHTML = "";
            const formo = {...form};
            const res = await fetch("http://localhost:5000/Kleiderschrank/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formo)
            })
                .catch(error => {
                    window.alert("Logging in did not Work due to an unknown error, please try again later. ");
                    console.log(error)
                });
            const user = await res.json();
            if (user === false) {
                document.getElementById("CorrectionBox").innerHTML = "Wrong credentials";
            } else {

                document.getElementById("CorrectionBox").innerHTML = "Logged In";
                setRedirect(!redirect)
            }
        }

        return (
            <div className={'bg-black min-h-screen h-fit min-w-screen flex flex-col items-center justify-center text-white'}>
                {redirect && (
                    <Navigate to={"/Main"} replace={true}/>
                    )}
                <p className={"absolute inset-x-0 top-0 h-16 font-['Recia'] text-9xl"}>KLEIDERSCHRANK</p>
                <input value={form.email}
                       onChange={(e) => updateForm({email: e.target.value})} type="email" name="email"
                       placeholder="email"/>
                <input value={form.password}
                       onChange={(e) => updateForm({password: e.target.value})} type="password" name="password"
                       placeholder="password"/>
                <button onClick={() => login()}> login</button>
                <p id={'CorrectionBox'}></p>
            </div>
        )
    }

        function Main() {
            return (
                <div className={'bg-white min-h-screen h-fit min-w-screen flex flex-col items-center justify-center text-black'}>
                    <p className={"fixed inset-x-0 top-0 h-16 font-['Recia'] text-5xl bg-white border-b border-black"}>KLEIDERSCHRANK</p>
                    <div className={'grid md:grid-cols-4 grid-cols-2 mt-28 justify-center'}>
                    {kleidung.map((kleid) => {
                        return(
                        <div key={kleid._id} className={'w-3/4 h-3/4 bg-white text-black border border-black text-center p-10 ml-10'}>
                            <p>{kleid.Name}</p>
                            <p>{kleid.Color}</p>
                            <p>{kleid.Size}</p>
                            <p>{kleid.Type}</p>
                            <p>{kleid.Description}</p>
                            <p>{kleid.Brand}</p>
                            <p>{kleid.Price}</p>
                            <img className={'border border-black h-4/4 w-4/4'} src={kleid.Img}/>

                        </div>
                    )
                })}
                    </div>

                </div>
            )
        }

        function Users() {
            return <h2>Users</h2>;
        }


}

export default App;
