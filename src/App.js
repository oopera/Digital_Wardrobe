import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import './App.css';
import {useEffect, useState} from "react";
import React from "react";


function App() {
    const [kleidung, setKleidung] = useState([]);
    const [redirect, setRedirect] = useState(false)
    const [types, setTypes] = useState(["Backpack", "Shoes", "Jacket", 'Watch', "Hoodie", "Tshirt", "Shirt"])
    const [selectedTypes, setselectedTypes] = useState([])
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
            <div className={'bg-black min-h-screen  min-w-screen flex flex-col items-center justify-center text-white'}>
                {redirect && (
                    <Navigate to={"/Main"} replace={true}/>
                    )}
                <p className={"absolute inset-x-0 top-0 h-16 font-['Recia'] text-9xl"}>KLEIDERSCHRANK</p>
                <input value={form.email}
                       className={'text-black'}
                       onChange={(e) => updateForm({email: e.target.value})} type="email" name="email"
                       placeholder="email"/>
                <input value={form.password}
                       className={'text-black'}
                       onChange={(e) => updateForm({password: e.target.value})} type="password" name="password"
                       placeholder="password"/>
                <button onClick={() => login()}> login</button>
                <p id={'CorrectionBox'}></p>
            </div>
        )
    }

        function Main() {
            const [open, setOpen] = useState(false)
            const [openedItem, setOpenedItem] = useState(false);
            const [render, setRerender] = useState(false);
            function openItem(id,e ){

                if(openedItem === id){
                    setOpenedItem(false)
                }else{
                    setOpenedItem(id)
                }
            }
            return (
                <div className={'bg-white min-h-screen h-fit min-w-screen flex flex-col text-black'}>
                    {open === false && (
                        <>
                        <div  onClick={() => setOpen(!open)} className={"fixed inset-x-0 top-0 h-16 font-['Recia'] text-5xl border-b bg-white border-black text-center"}>
                        KLEIDERSCHRANK
                        </div>

                        <div className={'z-10 fixed w-5 h-5 top-8 border-r-2 border-b-2 border-black self-center transform: rotate-45'}
                             onClick={() => setOpen(!open)} />

                        </>
                    )}
                    {open === true && (
                        <>

                            <div   onClick={() => setOpen(!open)} className={"fixed inset-x-0 top-0 h-32 font-['Recia'] text-5xl border-b bg-white border-black text-center"}>
                                KLEIDERSCHRANK </div>
                            <div className={"fixed grid  divide-y-2 lg:grid-cols-8 grid-cols-4 h-32 top-20 font-['Recia']" }>
                                {types.map((type) => {
                                    if(selectedTypes.includes(type)){
                                        return(
                                            <div onClick={()=> {
                                                selectedTypes.splice(selectedTypes.findIndex(element => element === type), 1); setRerender(!render)
                                            }} className={'border border-black m-2 h-8 w-32 bg-white text-black hover:bg-slate-600 hover:text-white'}>{type}</div>
                                        )
                                    }else{
                                        return(
                                            <div onClick={()=> {
                                                selectedTypes.push(type); setRerender(!render)
                                            }} className={'m-2 h-8 w-32 bg-black text-white hover:bg-slate-600 hover:text-white'}>{type}</div>
                                        )
                                    }

                                })}
                            </div>

                            <div className={'z-10 fixed w-5 h-5 top-12 border-t-2 border-l-2 border-black self-center transform: rotate-45'}
                                 onClick={() => setOpen(!open)} />

                        </>
                    )}

                    <div className={'grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 mt-28  self-center items-center justify-center'}>

                        <div className={'rounded-full h-40 w-80 bg-black text-white p-10 text-center self-center text-9xl'}>+</div>
                    {kleidung.map((kleid) => {
                        if ((openedItem === kleid._id && selectedTypes.includes(kleid.Type)) || (openedItem === kleid._id &&  selectedTypes.length === 0)) {
                            return (
                                <div onClick={(e)=>openItem(kleid._id, e)} key={kleid._id}
                                     className={'w-full h-full bg-white text-black border border-black self-center p-10'}>
                                    <p>{kleid.Name}</p>
                                    <p>{kleid.Color}</p>
                                    <p>{kleid.Size}</p>
                                    <p>{kleid.Type}</p>
                                    <p>{kleid.Description}</p>
                                    <p>{kleid.Brand}</p>
                                    <p>{kleid.Price}</p>
                                    <ImageSlider images={kleid.Img}/>

                                </div>
                            )
                        } else if(selectedTypes.includes(kleid.Type) || selectedTypes.length === 0) {
                            return (
                                <div onClick={(e)=>openItem(kleid._id, e)} key={kleid._id}
                                     className={'w-3/4 h-3/4 bg-white text-black border border-black self-center justify-self-center p-10'}>
                                    <p>Name: {kleid.Name}</p>
                                    <p>Color: {kleid.Color}</p>
                                    <p>Size: {kleid.Size}</p>
                                    <p>Type: {kleid.Type}</p>
                                    <p>Description: {kleid.Description}</p>
                                    <p>Brand: {kleid.Brand}</p>
                                    <p>Price: {kleid.Price}€</p>
                                    <ImageSlider images={kleid.Img}/>

                                </div>
                            )}else{
                                return
                        }


                    })
                }
                    </div>

                </div>
            )
        }

}

export function ImageSlider(images){
    const [counter, setCounter] = useState(0)
    let source = Object.values(images)[0]
    let selImg = source[counter]

    function changeIndex(string){
        if(string === "add"){
            if(counter === source.length-1 ){
                setCounter( 0)
            }else{
                setCounter( counter+1)
            }
        }else if(string === 'subtract'){
            if(counter === 0){
                setCounter( source.length-1)
            }else{
                setCounter( counter-1)
            }
        }
    }

    function handleChildClick(e) {
        e.stopPropagation()
    }
    let string = 'absolute left-h-5 w-5 border rounded-full border-black ml-' + {counter}
    return(
        <div onClick={e=> handleChildClick(e)} className={'h-4/4 w-4/4'} >
            {source.map((image) => {
                return(
                    <div className={string}/>
                )
            })}
            <div className={'absolute h-96 hover:bg-black opacity-30'} onClick={() => changeIndex('subtract')}> </div>
            <div className={'absolute h-96 w-10 ml-4/4 hover:bg-black opacity-30'} onClick={() => changeIndex('add')}> </div>
            <img alt="" className={'border h-96 border-black object-cover'} src={selImg}/>


        </div>
    )
}

export default App;
