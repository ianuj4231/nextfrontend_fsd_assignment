"use client";
import { useEffect } from "react";
import { CreateUserDto } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/usersSlice";
import { AppDispatch, RootState } from "../redux/store";
import { CounterState } from "../redux/usersSlice";
import axios from "axios";
import { deleteUserLocally } from '../redux/usersSlice';
import { useRouter } from 'next/navigation';
export default function UserTable() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); 
    const { data: users, loading, error } = useSelector(
        (state: RootState) => state.users
    );


    useEffect(() => {
        dispatch(getAllUsers())
    }, [])


    if (loading) {
        return (
            <div>loading...</div>
        );
    }

    if (error) {
        return (
            <div>
                error...{error}
            </div>
        );
    }




  

      async function handleView(id:number | undefined ) {
        router.push(`/getUsers/${id}`);
      }

    return (
        <main>
            <h1>Get All Users Page</h1>
            <div className="relative overflow-x-auto"  style={{paddingTop:"60px" , paddingLeft: "20px", paddingRight:"20px"}}>

            <table  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"> 
                        <tr>
                                <th scope="col" className="px-6 py-3"> id </th>
                                <th scope="col" className="px-6 py-3"> username </th>
                                <th scope="col" className="px-6 py-3"> action </th>
                        </tr>    
                </thead>

                   <tbody>
                   
                        {
                            users.map(x=>(
                                <tr   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"  style={{paddingLeft: "20px", paddingRight:"20px"}} key={x.id} >
                                                <td  className="px-6 py-3"> {x.id }</td>
                                                <td className="px-6 py-3"> {x.username} </td>
                                                <td className="px-6 py-3"> 
                                                        <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={()=>handleView(x.id)}> view </button>    
                                                </td>
                                </tr>
                            ))
                        }

                    </tbody> 

            </table>
            
            </div>
            
            
           
        </main>
    );


    

}