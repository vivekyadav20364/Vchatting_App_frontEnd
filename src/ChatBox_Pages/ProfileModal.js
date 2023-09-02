import { IconButton, useDisclosure,Button, Image ,Text} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ContextState } from "../Context/ChatProvider";

const ProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //console.log("Children is :", children);
  const {user} =ContextState();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="md" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir="column"
          >
           <Image
           borderRadius="full"
           boxSize="150px"
           src={user.pic}
           alt={user.name}
           />

           <Text 
           fontSize={{base:"20px",md:"30px"}}
           fontFamily="Work sans"
           >{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
