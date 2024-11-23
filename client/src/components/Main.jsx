import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./App.css";

export const Main = () => {
    const [users, setUsers] = useState([]);
    const [filteredUser,setFilteredUser]=useState([]);
    const [modal,setModal]=useState(false);
    const [adduser,setAddUser]=useState({name:" ",age:" ",email:" ",phone:" "})
    const [update,setUpdate]=useState(false);
    async function getAllUsers() {
        await axios.get("http://localhost:8000/users").then((res) => {
            setUsers(res.data); 
            setFilteredUser(res.data);
        }).catch((error) => {
            console.error("Error fetching users:", error);
        });
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    function handelSearch(e)
    {
        const word=e.target.value.toLowerCase();
        const filtered=users.filter((user)=>user.name.toLowerCase().includes(word));
        setFilteredUser(filtered);
    }
    async function handleDelete(id)
    {
        let isconfirm=window.confirm(`YOU WANT TO DELETE ID NO : ${id}`);
        if(isconfirm)
        {
        await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>
        {
            setUsers(res.data); 
            setFilteredUser(res.data);
        }).catch((err)=>
        {
            console.log(err);
        });
       }
    }
    function handleClose()
    {
        setAddUser({name:" ",age:" ",email:" ",phone:" "});
        setModal(false);
        getAllUsers();
        setUpdate(false);
    }
    function handleAdd()
    {
        setModal(true);
    }
    function handleChange(e)
    {
        setAddUser({...adduser,[e.target.name]:e.target.value});
        // console.log(e.target.name +" "+e.target.value);
    }
    async function addData(e)
    {
        e.preventDefault();
        await axios.post("http://localhost:8000/users",adduser).then((res)=>{
          console.log(res);
        }
        ).then(alert("Added succesfully"))
       handleClose();
    }
     function handleEdit(user)
    {
        setAddUser({name:user.name,age:user.age,email:user.email,phone:user.phone});
        setModal(true);
        setUpdate(true);
    }
    async function UpdateData(phone)
    {
        await axios.patch("http://localhost:8000/users",adduser).then((res)=>{
            console.log("Editing completed.....") 
       }).then(alert("Update successfully completed"));
       handleClose();
    }

    return (
        <div className="container">
            <center><h4>CRUD APPLICATION</h4></center>
            <div className="input-search">
                <input type="text" placeholder="Search text here" onChange={(e)=>handelSearch(e)} />
                <button onClick={handleAdd}>Add User</button>
            </div>
            <div className="details">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUser.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.age}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td><button onClick={()=>handleEdit(user)}>Edit</button></td>
                                <td><button onClick={()=>handleDelete(user.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <div className="modal">
                    <div className="modal-header">
                    <span className="close" onClick={handleClose}>&times;</span>
                       <h3>User Details</h3>
                    <div className="modal-content">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" value={adduser.name} onChange={handleChange}required/>
                        <br />
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={adduser.email} onChange={handleChange} required/>
                        <br />
                        <label htmlFor="age">Age</label>
                        <input type="age" name="age" id="age"value={adduser.age} onChange={handleChange} required/>
                        <br />
                        <label htmlFor="phone">Phone No</label>
                        <input type="text" name="phone" id="phone" value={adduser.phone} onChange={handleChange} required/>
                        <br />
                        {!update ?(<button onClick={addData}>Add User</button>):(<button onClick={()=>UpdateData(adduser.phone)}>Update User</button>)}
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};
