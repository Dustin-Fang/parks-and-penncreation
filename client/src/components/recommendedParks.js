import {
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  CloseButton
} from '@chakra-ui/react';
import React from 'react';

function RPModal({ setShowModal, results }) {
  console.log(results)
  if (!results.length) {
  return (
    <Box bgColor="white" width="500px" height="500px">
    <Text> Loading... </Text> 
    <CloseButton onClick={() => {setShowModal(false)}} />

    </Box>
  )} else { 
  return (
    <Box bgColor="white" width="500px" height="500px">
    <Text> We thought you would love these parks</Text> 
    <CloseButton onClick={() => {setShowModal(false)}} />
    { results.map(park => console.log(park.ParkName))}
    </Box>

    // <Box bgColor="white" width="500px" height="500px">
    // <Text fontWeight="bold" fontSize="15px"> We thought you would love these parks </Text>
    

    // <CloseButton onClick={() => {setShowModal(false)}} />
    // </Box>
  
  )}
}

export default RPModal;