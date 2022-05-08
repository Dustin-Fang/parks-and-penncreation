import {
  Box,
  Text,
  Heading,
  CloseButton
} from '@chakra-ui/react';
import React from 'react';

function RPModal({ setShowModal, modalHeader, results }) {
  // console.log(results)
  if (!results.length) {
  return (
    <Box bgColor="white" width="500px" height="500px">
    <Text> Loading... </Text> 
    <CloseButton onClick={() => {setShowModal(false)}} />

    </Box>
  )} else { 
  return (
    <Box bgColor="white" width="500px" height="500px">
    <Heading> {modalHeader}</Heading> 
    <CloseButton onClick={() => {setShowModal(false)}} />

    { results.map(park => <Text key={park.ParkName}> {park.ParkName}, {park.State.split(',')[0]} </Text>)}
   
    </Box>
  )}
}

export default RPModal;