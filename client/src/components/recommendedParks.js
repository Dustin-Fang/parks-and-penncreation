/* eslint-disable */
import {
  Box,
  Text,
  Heading,
  CloseButton,
  Button,
  Center,
  Link,
  VStack
} from '@chakra-ui/react';
import React from 'react';
const loc = "http://localhost:3000";
function RPModal({ setShowModal, modalHeader, results }) {

  if (!results.length) {
  return (
    <Box bgColor="white" width="500px" height="500px" boxShadow='sm' rounded="md">
    
    <Text position="absolute" bottom={3} right={220}> Loading... </Text> 
   
    <Box position="absolute" top={0} right={3}>
    <CloseButton onClick={() => {setShowModal(false)}} />
    </Box>
    </Box>
  )} else { 
  return (
 
  <Box bgColor="white" justifyContent="right" alignItems="center"
    width="500px" height="500px" boxShadow='sm' rounded="md">

      <Center>

        <VStack>
        <Heading paddingTop={10} size="lg"> {modalHeader}</Heading> 
        { results.map(park => <Link onClick={() => window.location.href = `${loc}/parks?id=${park.ParkId}` } key={park.ParkName}> {park.ParkName}, {park.State.split(',')[0]} </Link>)}

        </VStack>

<Box position="absolute" top={0} right={3}>
  <CloseButton onClick={() => {setShowModal(false)}} />
</Box>
      
       
</Center>
    </Box>
    
  )}
}

export default RPModal;