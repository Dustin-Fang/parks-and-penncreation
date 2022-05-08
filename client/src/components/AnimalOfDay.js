import {
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

import React, { useState, useRef } from 'react';

import { getRandomAnimal, getParksBySpecies } from '../fetcher';


function AnimalOfDay() {
  const [speciesName, setSpeciesName] = useState("");
  // is "animal of day" open?
  const [isOpen, setIsOpen] = useState(false);
  const category = useRef("");
  const scientificName = useRef("");("");
  const family = useRef("");
  const order = useRef("");
  const [foundInParks, setFoundInParks] = useState([]);


  async function onAODClick() { 
    setIsOpen(!isOpen);
    if (!isOpen) {
      if (localStorage.getItem('parks')) {
        const parks = JSON.parse(localStorage.getItem('parks'));
        const aod = JSON.parse(parks.animal)
        const today = new Date();
        const todaysDate = today.getMonth() + "/" + today.getFullYear();

        if (todaysDate === parks.date) {
          setSpeciesName(aod.CommonName);
          category.current = aod.Category;
          family.current = aod.Family
          scientificName.current = aod.ScientificName;
          order.current = aod.SpeciesOrder;
  
          getParksBySpecies({pageNum:1, scientificName: aod.ScientificName}).then((parks) => {
            const temp = [];
           parks.results.map(park => temp.push({name: park.Name, state: park.State.split(",")[0]}))
           setFoundInParks(temp);
          });
          return;
        }
      } 
      await getRandomAnimal().then((res) => {
        // console.log(res.results)
          getParksBySpecies({pageNum:1, scientificName:res.results[0].ScientificName}).then((parks) => {
            const temp = [];
            parks.results.map(park => temp.push({name: park.Name, state: park.State.split(",")[0]}))
            setFoundInParks(temp);
          });
        
          setSpeciesName(res.results[0].CommonName);
          category.current = res.results[0].Category;
          family.current = res.results[0].Family
          scientificName.current = res.results[0].ScientificName;
          order.current = res.results[0].SpeciesOrder;

          const today = new Date();
          localStorage.setItem('parks', JSON.stringify({date: today.getMonth() +"/"+ today.getFullYear(), 
          animal: JSON.stringify(res.results[0])}));
        }); 
    }
  }

  return (
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
  );
}

export default AnimalOfDay;
