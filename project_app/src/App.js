import React , {useState,useEffect} from 'react'
import axios from 'axios'

import {
  Table,TableBody,
  TableCell,TableContainer,
  TableHead,TableRow,Paper,
  TablePagination, 
  Stack
} from '@mui/material';

import {EditTwoTone , DeleteTwoTone} from '@ant-design/icons'
import { Button, Modal } from 'antd';


export default function App() {

  const [userData , setUserData] = useState([])
  const [limit , setLimit] = useState(10) ;
  const [skip , setSkip] = useState(0)
  const [updateUserData , setUpdateUserData] = useState({})
  const [deleteUserData , setDeleteUserData] = useState({})
  const [isUpdateModalOpen , setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen , setIsDeleteModalOpen] = useState(false);
  const [isNewUserModalOpen , setIsNewUserModalOpen] = useState(false);
  const [newUserData , setNewUserData] = useState({})


  useEffect(() => {
   const callAPI = async () => {
    const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
    setUserData(response?.data?.users);
   }
   callAPI();
  }, [limit,skip])

  const handleChangePage = (e,page) => {
    setSkip(page*limit);
  }

  const handleChangeRowsPerPage = (e) => {
    setLimit(e.target.value);
    setSkip(0)
  }

  const handleDeleteData = async (e) => {
    const deleteData = await axios.delete(`https://dummyjson.com/users/${e.id}`)
    console.log(deleteData.data);
    setIsDeleteModalOpen(false)
  }

  
  const handleCancel = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsNewUserModalOpen(false)
  };

  const handleUpdateIcon = (e) => {
    setIsUpdateModalOpen(true)
    setUpdateUserData(e);
  }

  const handleDeleteIcon = (e) => {
    setDeleteUserData(e);
    setIsDeleteModalOpen(true)
  }

  const handleUpdateData = async () => {
    const updateData = await axios.put(`https://dummyjson.com/users/${userData}`,updateUserData)
    setUpdateUserData(updateData.data);
    console.log(updateUserData);
    setIsUpdateModalOpen(false)
  }

  const handleChangeData = (e,key) => {
    setUpdateUserData({...updateUserData,[key]:e.target.value})
  }

  const newUserModal = () => {
    setIsNewUserModalOpen(true)
  }

  const handleAddNewData = (e,key) => {
    setNewUserData({...newUserData,[key]:e.target.value});
  }

  const handleAddNewUser = async () => {
    const newUser = await axios.post(`https://dummyjson.com/users/add`,newUserData) 
    setNewUserData(newUser.data);
    setIsNewUserModalOpen(false)
  }
  console.log(newUserData);

  return (
    <Stack spacing={3} style={{alignItems : "center" , backgroundColor:"rgb(45, 44, 44)"}}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{backgroundColor:"rgb(80, 72, 72)"}}>
          <TableRow>
            <TableCell align="center" sx={{fontWeight:"bolder" , color:"rgb(255, 197, 173)"}}>ID</TableCell>
            <TableCell align="center" sx={{fontWeight:"bolder" , color:"rgb(255, 197, 173)"}}>First Name</TableCell>
            <TableCell align="center" sx={{fontWeight:"bolder" , color:"rgb(255, 197, 173)"}}>Last Name</TableCell>
            <TableCell align="center" sx={{fontWeight:"bolder" , color:"rgb(255, 197, 173)"}}>Age</TableCell>
            <TableCell align="center" sx={{fontWeight:"bolder" , color:"rgb(255, 197, 173)"}}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor:"rgb(80, 72, 72)"}}>
          {userData?.map((data) => {
            return(
            <TableRow
              key={data.id}
            >
              
              <TableCell align="center" sx={{color:"white"}}>{data.id}</TableCell>
              <TableCell align="center" sx={{color:"white"}}>{data.firstName}</TableCell>
              <TableCell align="center" sx={{color:"white"}}>{data.lastName}</TableCell>
              <TableCell align="center" sx={{color:"white"}}>{data.age}</TableCell>
              <TableCell align="center" sx={{color:"white"}}>
                <Stack direction="row" spacing={4}>
              <EditTwoTone onClick={()=>{handleUpdateIcon(data)}}/>  
              <Modal title="User's Data" centered={true} maskStyle={{backgroundColor:"rgb(80, 72, 72,0.2)"}} open={isUpdateModalOpen} onCancel={handleCancel} okText="Save" onOk={()=>{handleUpdateData(updateUserData)}}>
                <Stack>
              ID : <input value={updateUserData.id} onChange={(e)=>{handleChangeData(e,"id")}}></input>
              First Name : <input value={updateUserData.firstName} onChange={(e)=>{handleChangeData(e,"firstName")}}></input>
              Last Name : <input value={updateUserData.lastName} onChange={(e)=>{handleChangeData(e,"lastName")}}></input>
              Age : <input value={updateUserData.age} onChange={(e)=>{handleChangeData(e,"age")}}></input>
              </Stack>
              </Modal>
              <DeleteTwoTone twoToneColor="red" onClick={()=>{handleDeleteIcon(data)}}/>
              <Modal okButtonProps={{style:{backgroundColor:"red"}}} centered={true} maskStyle={{backgroundColor:"rgb(80, 72, 72,0.2)"}} open={isDeleteModalOpen} onCancel={handleCancel} okText="Delete" onOk={()=>{handleDeleteData(deleteUserData)}}>
                <p style={{fontSize:"20px"}}>Are you sure you want to delete?</p>
              </Modal>
              </Stack>
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    <Button ghost={true} onClick={newUserModal}>Add New User</Button>
    <Modal title="User's Data" centered={true} maskStyle={{backgroundColor:"rgb(80, 72, 72,0.9)"}} open={isNewUserModalOpen} onCancel={handleCancel} okText="Save" onOk={handleAddNewUser}>
      <Stack>
        First Name : <input onChange={(e)=>{handleAddNewData(e,"firstName")}}></input>
        Last Name : <input onChange={(e)=>{handleAddNewData(e,"lastName")}}></input>
        Age : <input onChange={(e)=>{handleAddNewData(e,"age")}}></input>
        </Stack>
    </Modal>
    <TablePagination
      component="div"
      count={100}
      rowsPerPage={limit}
      page={skip/limit}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{color:"white"}}
    />
    </Stack>
  )
}

