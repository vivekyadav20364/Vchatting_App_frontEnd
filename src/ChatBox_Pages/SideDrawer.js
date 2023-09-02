import { Box,Tooltip,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider,Input,useDisclosure, Toast, Spinner } from '@chakra-ui/react';
import {Button} from "@chakra-ui/button"
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ContextState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from "../config/Baseurl";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UsersSideDrawer/UserListItem';

const SideDrawer =() => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();
  const {user,setSelectedChat,chats,setChats}=ContextState();
  const navigate=useNavigate();
  const toast=useToast();
  //for right side drawer 
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
 
  const handleSearch=async()=>{
    if(!search){
      toast(
        {
          title:"Please Enter something",
          status:"warning",
          duration:4000,
          isClosable:true,
          position:"top-right"
        }
      )
    }

    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get(`${BaseUrl}user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);
      //console.log(searchResult);
    } catch (error) {
      toast({
        title:"Error occored!",
        description:"Failed to load the result",
        status:"error",
        duration:4000,
        isClosable:true,
        position:"top-right"
      })
      setLoading(false);
    }
  }

  const accessChat=async (userId)=>{
    try {
      setLoadingChat(true);
      //we also pass json data to this api so we add content-type in header
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
     const {data}=await axios.post(`${BaseUrl}chat`,
      {userId:userId},config
     )
    //Not understand 
     if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])

     setSelectedChat(data);
     setLoadingChat(false);
     onClose(); 
    } catch (error) {
      console.log("Error in fetching chat!",error);
      toast({
        title:"Error in fetching chat!",
        status:"error",
        duration:4000,
        isClosable:true,
        position:"top-right"
      });
      setLoadingChat(false);
    }
  }

  return (
    <div>
      <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="1px"
      >
        <Tooltip label="Search Users to chat" hasArrow placeContent="bottom-end">
          <Button onClick={onOpen}>
          <i class="fa-solid fa-search"></i>
          <Text display={{base:"none",md:"flex"}} px="4">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work-sans">VChat</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
            <ProfileModal>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={()=>{
                localStorage.removeItem("userinfo");
                navigate("/");
              }}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* code for drawer */}
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent> 
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box 
            display="flex"
            justifyContent="space-between"
            >
            <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search by name and email' />
            <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading?(<ChatLoading/>)
            :(searchResult.map((user)=>{
              return (
              <UserListItem 
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
              />
              )
            })
            ) 
            }
            {loadingChat && <Spinner ml='auto' display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </div>
  )
}

export default SideDrawer;
