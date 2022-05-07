import {
  Flex,
  Popover,
  PopoverTrigger,
  PopoverBody,
  Button,
  PopoverContent,
  Box,
  Text,
  PopoverCloseButton,
  VStack,
  HStack,
} from '@chakra-ui/react';
import NavBar from './NavBar';
import React, { useState, useRef } from 'react';
import PopoverForm from './parkSearch';
import { getRandomAnimal, getParksBySpecies } from '../fetcher';
import RPModal from './recommendedParks';

function HomePage() {
  const [speciesName, setSpeciesName] = useState("");
  // is "animal of day" open?
  const [isOpen, setIsOpen] = useState(false);
  const category = useRef("");
  const scientificName = useRef("");("");
  const family = useRef("");
  const order = useRef("");
  const [foundInParks, setFoundInParks] = useState([]);
  const [recommendedParks, setRecommendedParks] = useState([]);

  // show modal with park results?
  const [showModal, setShowModal] = useState(false);

  function handleSetShowModal(isOpen) { setShowModal(isOpen) }
  function handleSetRecParks(arr) { setRecommendedParks(arr) }

  async function onAODClick() { 
    setIsOpen(!isOpen);
    if (!isOpen) {
      await getRandomAnimal().then((res) => {
        // console.log(res.results)
          getParksBySpecies(1, res.results[0].ScientificName).then((parks) => {
            const temp = [];
           parks.results.map(park => temp.push({name: park.Name, state: park.State.split(",")[0]}))
           setFoundInParks(temp);
          });
        
         setSpeciesName(res.results[0].CommonName);
         category.current = res.results[0].Category;
         family.current = res.results[0].Family
         scientificName.current = res.results[0].ScientificName;
         order.current = res.results[0].SpeciesOrder;
       }); 
    }
  }

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
      <Box position="absolute" bottom={30} right={70}>
        <Popover isOpen={isOpen}>
          <PopoverTrigger>
             <Button onClick={onAODClick}> Animal of the Day </Button>
          </PopoverTrigger>

          <PopoverContent>
            <PopoverCloseButton onClick={() => setIsOpen(!isOpen)}/>
            <PopoverBody justifyItems="center" alignItems="center">
              {speciesName.length? <VStack>

              <HStack>
             <Text fontFamily="Roboto" fontSize="20px" fontWeight="semibold"> {speciesName}, </Text>
             <Text fontFamily="Roboto" color="blue" fontSize="20px"> {category.current} </Text>
             </HStack>

            <HStack>
            <Text fontSize="15px" fontWeight="bold"> Family:  </Text>
            <Text>  {family.current} </Text>
            </HStack>
            
            <HStack>
             <Text fontSize="15px" fontWeight="bold"> Species Order:  </Text>
             <Text> {order.current} </Text>
             </HStack>

             <HStack>
             <Text fontWeight="bold" fontSize="15px"> Scientific Name: </Text>
             <Text>  {scientificName.current} </Text>
             </HStack>

             {foundInParks.length && 
             <Box>
                <Text fontWeight="bold" fontSize="15px"> Found in Parks: </Text>
                
                { foundInParks.map(park =>  (<Text key={park.name}>  {park.name}, {park.state} </Text> )) }
             </Box>
              
               }

             </VStack>: <Text> Loading... </Text>}
            </PopoverBody>
          </PopoverContent>
          </Popover>
      </Box>

      <Box bgColor="#FFFFF" position="absolute" >
        {!showModal && <PopoverForm setShowModal={handleSetShowModal} getResults={handleSetRecParks}/>}
        {showModal && <RPModal setShowModal={handleSetShowModal} results={recommendedParks}/>}
      </Box>

      <Text fontWeight="bold" fontSize="15px" position="absolute" left={1} bottom={0} color="#ebe534"> Sequoia National Park, CA </Text>
  </Flex>
  );
}

export default HomePage;
