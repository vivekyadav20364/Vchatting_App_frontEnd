import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login"
import { useNavigate } from "react-router-dom";
const Home = () => {
  // const [name, setname] = useState();
  // const getdata = async () => {
  //   const data = await axios.get("http://localhost:5000/api/chat");
  //   // setname(data);
  //   console.log(data.data);
  // };

  // useEffect(() => {
  //   getdata();
  // }, []);
  
  const navigate=useNavigate();
  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("userInfo"));
     if(user){
      navigate("/chat");
     }

  },[navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text textAlign="center" fontSize="4xl" fontFamily={"Work sans"}>
        VChat
        </Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
