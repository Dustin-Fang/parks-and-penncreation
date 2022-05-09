import {
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';
import NavBar from '../components/NavBar';
import React, { useState } from 'react';
import PopoverForm from '../components/ParkRecSearch';
import RPModal from '../components/RecommendedParks';
import AnimalOfDay from '../components/AnimalOfDay';


function HomePage() {
  const [recommendedParks, setRecommendedParks] = useState([]);
 
  // show modal with park results?
  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  
  function handleSetShowModal(isOpen) { handleSetRecParks([]); setShowModal(isOpen) }
  function handleSetRecParks(arr) { setRecommendedParks(arr) }
  function handleSetModalHeader(body) { setModalHeader(body) }

  return (
    <Flex
    width="100wh"  
    height="100vh"  
    justifyContent="center"
    alignItems="center"
    bgImage=
    "url(https://www.flushmate.com/sites/flushmate/files/2020-04/Sequoia-Lodge-Gallery-02.jpg)"
    bgSize="cover"
   >
      <NavBar/>
      <AnimalOfDay/>
      <Box bgColor="#FFFFF" position="absolute" >
        {!showModal && <PopoverForm setShowModal={handleSetShowModal} setModalHeader={handleSetModalHeader} getResults={handleSetRecParks}/>}
        {showModal && <RPModal setShowModal={handleSetShowModal} modalHeader={modalHeader} results={recommendedParks}/>}
      </Box>

      <Text fontWeight="bold" fontSize="15px" position="absolute" left={1} bottom={0} color="#ebe534"> Sequoia National Park, CA </Text>
  </Flex>
  );
}

export default HomePage;
