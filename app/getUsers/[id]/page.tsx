'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { deleteUserLocally } from "@/app/redux/usersSlice";
import { updateUserLocally } from '@/app/redux/usersSlice';
import Swal from 'sweetalert2';

export default function({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const router = useRouter(); 
  const[editMode, setEditMode]   =  useState(false);
  const [formData, setFormData] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();

  const handleEditClick=()=>{
            setEditMode(true)
            setFormData(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${params.id}`);
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);


  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <h1>No user data found.</h1>;
  }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev: any) => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    const nameparts = name.split(".");
  
    if (nameparts.length === 2) {
      setFormData((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [nameparts[1]]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("edit buttonn");


    const formData2 = {
      username: formData.username,
      phone: formData.phone,
      email: formData.profile.email,
      gender: formData.profile.gender,
      address: formData.profile.address,
      pincode: formData.profile.pincode,
      city: formData.profile.city,
      state: formData.profile.state,
      country: formData.profile.country,
  };


    try {
       const response = await axios.patch(`http://localhost:3001/api/users/${data.id}`, formData2);
      setEditMode(false);
        setData(response.data);
      dispatch(updateUserLocally(response.data));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }


  const handleDelete = async (id: number | undefined) => {

      try {

        const result = await Swal.fire({
            title: 'are you sure you want to delete this?',
            text: "you won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', 
            cancelButtonColor: '#28a745',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
          });
    
          if (result.isConfirmed && id) {

            const response = await axios.delete(`http://localhost:3001/api/users/${id}`);
          dispatch(deleteUserLocally(id));
          console.log(response.data, "deleted");
          Swal.fire('Deleted!', 'User has been deleted.', 'success'); 
          router.push("/getUsers");
        }
      } catch (error) {
        console.log("Error deleting user:", error);
      }
    
  };


  return (
    <div className="relative overflow-x-auto">
      <h1 className="mb-4 text-xl font-semibold">User details for ID: {params.id}</h1>
      <form onSubmit={handleSubmitEdit}>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Field</th>
            <th scope="col" className="px-6 py-3">Value</th>
          </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Username</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.username
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Phone</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.phone
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Email</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="email"
                    name="profile.email"
                    value={formData.profile?.email}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.email
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Gender</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.gender"
                    value={formData.profile?.gender}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.gender
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Address</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.address"
                    value={formData.profile?.address}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.address
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Pincode</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.pincode"
                    value={formData.profile?.pincode}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.pincode
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">City</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.city"
                    value={formData.profile?.city}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.city
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">State</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.state"
                    value={formData.profile?.state}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.state
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Country</th>
              <td className="px-6 py-4">
                {editMode ? (
                  <input
                    type="text"
                    name="profile.country"
                    value={formData.profile?.country}
                    onChange={handleInputChange}
                    className=" px-2 py-1 text-black"
                  />
                ) : (
                  data.profile.country
                )}
              </td>
            </tr>
          </tbody>
      </table>

      <br></br>


      <div style={{display: "flex", justifyContent: "center"}} >


          {editMode ? (
            <>
              <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2">Save</button>
              <button type="button" onClick={() => {setEditMode(false);
                      setFormData({})  
            }
              } className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2">Cancel</button>
            </>
          ) : (
            <button type="button" onClick={handleEditClick} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2">Edit</button>
          )}                
          
          <button type="button" onClick={()=>{handleDelete(data.id)}} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                
          </div>
      </form>
            

    </div>
  );
}
