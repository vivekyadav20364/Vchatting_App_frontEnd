import { Box, Button, Flex, Stack, useToast,Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ContextState } from '../Context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import {getSender} from "../config/ChatLogic";
import GroupChatModal from '../Group_chatpage/GroupChatModal';
import { BaseUrl } from "../config/Baseurl";
const MyChats = ({fetchAgain}) => {
  const {user,selectedChat ,setSelectedChat,chats,setChats}=ContextState();
  const toast=useToast();
  const [loggedUser,setLoggedUser]=useState();

  const fetchChats= async()=>{
   try {
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      }
    }
    
    const {data}=await axios.get(`${BaseUrl}chat`,config);
    setChats(data);

   } catch (error) {
        toast({
        title:"Error occored!",
        description:"Failed to load the chats",
        status:"error",
        duration:4000,
        isClosable:true,
        position:"top-right"
      })
   }
  }

  useEffect(()=>{
   setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
   fetchChats();
  },[fetchAgain])

  return (
  <Box 
  display={{base:selectedChat?"none":"flex",md:"flex"}}
  flexDir="column"
  alignItems="center"
  p={3}
  bg="white"
  w={{base:"100%",md:"31%"}}
  borderRadius="lg"
  borderWidth="1px"
  >
   <Box 
   pb={3}
   px={3}
   fontSize={{base:"28px",md:"30px"}}
   fontFamily="Work-sans"
   display="flex"
   width="100%"
   justifyContent="space-between"
   alignItems="center"
   >
   My Chats
   {/* if we want to display modal on click with the button then wrap the button with the component which is going to visible on click */}
   <GroupChatModal>    
    <Button
    display="flex"
    fontSize={{base:"17px",md:"10px",lg:"17px"}}
    rightIcon={<AddIcon/>}
    >
    New Group Chat
    </Button>
    </GroupChatModal>
   </Box>
   <Box
   display="flex"
   flexDir="column"
   p={3}
   bg="#F8F8F8"
   width="100%"
   h="100%"
   borderRadius="lg"
   overflow="hidden"
   >
   {chats? (
     <Stack overflowY="scroll">
       {chats.map((chat)=>(
         <Box
         onClick={()=>setSelectedChat(chat)}
         cursor="pointer"
         bg={selectedChat==chat?"#38B2AC":"#E8E8E8"}
         color={selectedChat==chat?"white":"black"}
         px={3}
         py={2}
         borderRadius="lg"
         key={chat._id}
         >
          <Text>
            {!chat.isGroupChat? (
              getSender(loggedUser,chat.users)
            ):chat.chatName}
          </Text>
         </Box>
       ))}
     </Stack>
   ):(<ChatLoading/>)}
   </Box>
  </Box>
  )
}

export default MyChats;
