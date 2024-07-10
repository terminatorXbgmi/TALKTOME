import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserListItem';
import { Box } from '@chakra-ui/react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';


export const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
   const [groupChatName, setGroupChatName] = useState();
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const toast = useToast();

   const { user, chats, setChats } = ChatState();
 

  


  //console.log("serach result ", searchResult);
    const handleSearch = async (query) => {
      setSearch(query);

      if (!query) {
        return;
      }

      try {
        setLoading(true);

        // as this page is jwt protected so i have to send jwt token and users name or email

        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        // console.log(search);

        const { data } = await axios.get(`/api/user?search=${search}`, config);

        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setSelectedUsers([]);
      setSearchResult([]);
      onClose();

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data);
      }

      toast({
        title: "Failed to Create the Chat!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
   // window.location.reload();
  };


   const handleGroup = async(userToAdd)=>{
    
     if(selectedUsers.includes(userToAdd)){
           toast({
             title: "User already added",
             status: "warning",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
           return;
     }

     setSelectedUsers([...selectedUsers,userToAdd]);

   };

   const handleDelete = (userToDelete)=>{
     
    setSelectedUsers(
        selectedUsers.filter((sel)=> sel._id!== userToDelete._id )
    )

   };


 
   return (
     <>
       <span onClick={onOpen}>{children}</span>

       <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent>
           <ModalHeader
             fontSize="35px"
             fontFamily="Work sans"
             display="flex"
             justifyContent="center"
           >
             Create Group Chat
           </ModalHeader>

           <ModalCloseButton />

           <ModalBody display="flex" flexDir="column" alignItems="center">
             <FormControl>
               <Input
                 placeholder="Chat Name"
                 mb={3}
                 onChange={(e) => setGroupChatName(e?.target?.value)}
               />
             </FormControl>
             <FormControl>
               <Input
                 placeholder="Add Users eg: John, Piyush, Jane"
                 mb={1}
                 onChange={(e) => handleSearch(e.target?.value)}
               />
             </FormControl>
             {/* selected user */}

             <Box width="100%" display="flex" flexWrap="wrap">
               {selectedUsers.map((u) => (
                 <UserBadgeItem
                   key={u._id}
                   user={u}
                   handleFunction={() => handleDelete(u)}
                 />
               ))}

             </Box>

             {/* renderded selected users */}
             {loading ? (
               // <ChatLoading />
               <div>Loading...</div>
             ) : (
               searchResult
                 ?.slice(0, 4)
                 .map((user) => (
                   <UserListItem
                     key={user._id}
                     user={user}
                     handleFunction={() => handleGroup(user)}
                   />
                 ))
             )}
           </ModalBody>

           <ModalFooter>
             <Button onClick={handleSubmit} colorScheme="blue">
               Create Chat
             </Button>
           </ModalFooter>
         </ModalContent>
       </Modal>
     </>
   );
 
 
   
  
}
