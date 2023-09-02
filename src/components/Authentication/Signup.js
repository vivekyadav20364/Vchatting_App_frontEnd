import React, { useState } from 'react'
import {FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from "@chakra-ui/react";
import {Button} from "@chakra-ui/button"
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../config/Baseurl";

const Signup = () => {
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [password,setPassword]=useState();
    const [pic,setPic]=useState();
    const [show,setShow]=useState(false);
    const [show1,setShow1]=useState(false);
    const [loading,setLoading]=useState(false)
    const nevigate = useNavigate();
    const toast = useToast()
    const handleclick=()=>{
      setShow(!show);
    }
    const handleclick1=()=>{
      setShow1(!show1);
    }

    const postDetails=(pics)=>{
      setLoading(true);
      if(pics==undefined){
        toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if(pics.type=="image/jpeg" || pics.type=="image/png"){
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "daruus6qx");
        fetch("https://api.cloudinary.com/v1_1/daruus6qx/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      }
    const submitHandler=async ()=>{
       setLoading(true);
       if(!name || !email || !password || !confirmpassword){
        toast({
          title: 'Please Fill all the Fields',
          status: 'Warning',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        setLoading(false);
        return;
       }

       if(password!==confirmpassword){
        toast({
          title: 'Passwords do not match',
          status: 'Warning',
          duration: 5000,
          isClosable: true,
          position:"top",
        })
        return;
       }

      try {
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };

        const {data}=await axios.post(`${BaseUrl}user`,{
          name,email,password,pic,
        },config);

        if(data.success){
          toast({
            title: data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setLoading(false);
        }
        else{
        toast({
          title: "Registration Successful✅ Login to Continue",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        }); 
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
      }
  
      } catch (error) {

        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }; 
  return (
   
      <VStack spacing="5px">
      <FormControl  id='first-name' isRequired>
       <FormLabel>Name</FormLabel>
       <Input placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)}/>
      </FormControl>

      <FormControl  id='email' isRequired>
       <FormLabel>Email</FormLabel>
       <Input placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>

      <FormControl  id='password' isRequired>
       <FormLabel>Password</FormLabel>
       <InputGroup>
       <Input type={show?"text":"password"} placeholder='Enter Your Password' onChange={(e)=>setPassword(e.target.value)}/>
       <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleclick}>
          {show?"Hide":"Show"}
        </Button>
       </InputRightElement>
       </InputGroup>
      </FormControl>

      <FormControl  id='confirm-password' isRequired>
       <FormLabel>Confirm Password</FormLabel>
       <InputGroup>
       <Input type={show1?"text":"password"} placeholder='Enter Your Password' onChange={(e)=>setConfirmpassword(e.target.value)}/>
       <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleclick1}>
          {show1?"Hide":"Show"}
        </Button>
       </InputRightElement>
       </InputGroup>
      </FormControl>

      <FormControl id='pic' isRequired>
       <FormLabel>Upload your Picture</FormLabel>
       <Input type="file" p={1.5} accept='image/*' onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>
      
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >Sign Up</Button>
      

      </VStack>
   
  )
}

export default Signup;
