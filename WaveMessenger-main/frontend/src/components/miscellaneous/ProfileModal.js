import React, { useEffect, useState } from "react";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { PhoneIcon, ViewIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { ENDPOINT } from "../SingleChat";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [socket,setSocket] = useState();
  useEffect(() => {
    setSocket(io(ENDPOINT));
  }, []);
  const callUser = ()=>{
    socket.emit('call','roomId');
  }
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div style={{ display: "flex", gap: "5px" }}>
          <IconButton
            display={{ base: "flex" }}
            icon={<PhoneIcon />}
            onClick={callUser}
          />
          <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic}
              alt={user?.name}
            />
            <Text>Email:{user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
