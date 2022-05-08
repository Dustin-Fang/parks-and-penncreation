import React from 'react';
import {
  Flex,
  HStack,
} from '@chakra-ui/react';

import SimpleSearch from '../components/basicSpeciesSearch'
import ComplexSearch from '../components/complexSpeciesSearch'
import NavBar from '../components/NavBar';
import AnimalOfDay from '../components/AnimalOfDay';

function SpeciesPage() {

  return (
    <Flex
    width="100wh"  
    height="100vh"  
    justifyContent="center"
    alignItems="center"
    backgroundColor="#4E7C50"
    >
      <NavBar/>

      <AnimalOfDay/>

      <HStack position="absolute" top="40px" padding={10} spacing="100px">
      <SimpleSearch /> 
      <ComplexSearch /> 
      </HStack>

     
     
  </Flex>
  );
}

export default SpeciesPage;
