import React from 'react';
import {
  Flex,
  Image,
  Popover,
  PopoverTrigger,
  PopoverBody,
  Button,
  PopoverContent,
  Box,
  Text,
  HStack,
  PopoverCloseButton,
  VStack,
} from '@chakra-ui/react';

import SimpleSearch from './basicSpeciesSearch'
import ComplexSearch from './complexSpeciesSearch'

import NavBar from './NavBar';
function SpeciesPage() {

   //placeholder
   const speciesName = 'Red Fox';
   const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg/440px-Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg';
 
  return (
    <Flex
    width="100wh"  
    height="100vh"  
    justifyContent="center"
    alignItems="center"
    backgroundColor="#4E7C50"
    >
      <NavBar/>

      <Box position="absolute" bottom={30} right={50}>
        <Popover>
          <PopoverTrigger>
             <Button> Animal of the Day </Button>
          </PopoverTrigger>

          <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody justifyItems="center" alignItems="center">
              <VStack>
              <Image height="200px" width="200px" src={url}/>
             <Text fontFamily="Roboto" fontSize="20px" fontWeight="semibold"> {speciesName} </Text>
             </VStack>
            </PopoverBody>
          </PopoverContent>
          </Popover>
      </Box>

      <HStack position="absolute" top="40px" padding={10} spacing="100px">
      <SimpleSearch /> 
      <ComplexSearch /> 
      </HStack>

     
     
  </Flex>
  );
}

export default SpeciesPage;
