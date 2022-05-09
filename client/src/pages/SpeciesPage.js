/* eslint-disable */
import React from 'react';
import {
  Flex,
  HStack,
} from '@chakra-ui/react';

import SimpleSearch from '../components/BasicSpeciesSearch';
import ComplexSearch from '../components/ComplexSpeciesSearch';
import NavBar from '../components/NavBar';

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

      <HStack position="absolute" top="40px" padding={10} spacing="100px">
        <SimpleSearch/> 
        <ComplexSearch /> 
      </HStack>
  </Flex>
  );
}

export default SpeciesPage;
