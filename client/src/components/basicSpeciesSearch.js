import {
  Popover,
  PopoverTrigger,
  Button,
  HStack,
  VStack,
  PopoverContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  PopoverCloseButton,
  Divider,
} from '@chakra-ui/react';

import React, { useState, useRef } from 'react';
import { getSpecies, getParksBySpecies } from "../fetcher.js";


// 2. Create the form
const Form = ({ setResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState("");


  function handleinputChange(event) {
    setInput(event.target.value);
    setSearchTerm("by " + event.target.id)
  }

  async function onSearchClick() {
    const term = searchTerm.split(" ")[1];
    if(term === "CName") {
      getSpecies({commonName:input}).then((r) => {setResults(r.results)})
    } else if(term === "SName") {
      getSpecies({scientificName:input}).then((r) => {setResults(r.results)})
    } else if(term === "Zip") {
      getSpecies({zip:input}).then((r) => {setResults(r.results)})
    } else if(term === "State") {
      getSpecies({state:input}).then((r) => {setResults(r.results)})
    }
  }

  return (
    <Stack>
      <Text size="10px"> Only your last input will be searched. </Text>
    <FormControl as='fieldset' paddingBottom="15px">
    <FormLabel>Scientific name</FormLabel>

    <Input id="SName" onChange={handleinputChange}
    bg="A7C193" variant='outline' placeholder='Lynx rufus'/> 

    <FormLabel > Common name</FormLabel>
    <Input id="CName"  onChange={handleinputChange}  bg="A7C193" variant='outline' placeholder='Fox' /> 


    <FormLabel > Zipcode </FormLabel>
    <Input id="Zip"  onChange={handleinputChange}  bg="A7C193" variant='outline' placeholder='4609' /> 

    <FormLabel > State </FormLabel>
    <Input id="State" onChange={handleinputChange}   bg="A7C193" variant='outline' placeholder='CO' /> 

  </FormControl>
  <Button onClick={onSearchClick} colorScheme='green'>
          Search {searchTerm}
        </Button>
     </Stack>
  )
}

const PopoverForm = () => {
  const hasResults = useRef(false);
  const [results, setResults] = useState([]);
  //const displayedResults = useRef([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedSpecies, setExpandedSpecies] = useState({})
  const [foundInParks, setFoundInParks] = useState([]);


  function handleSetResults(arr) {
    hasResults.current = true; 
    setResults(arr);
    // if 
     const temp = arr.slice(0, 4);
    setDisplayedResults(temp)
    // displayedResults.current = arr;
    setIsOpen(false) 
  };


  async function handleModal(x) {
    if (x) {
      getParksBySpecies({pageNum:1, commonName: x.CommonName}).then((parks) => {
        const temp = [];
        console.log(parks)
       parks.results.map(park => temp.push({name: park.Name, state: park.State.split(",")[0]}))
        setFoundInParks(temp);
        setModalOpen(true)
        hasResults.current = false;
        setExpandedSpecies(x);
        console.log("opened")  
      });
    } else {
      hasResults.current = true;
      setModalOpen(false);
      setFoundInParks([]);
    }
  }

  return (
    <> 
    <Box bg="#A7C193" width="600px" height="650px">      
      <Box  padding={2} mr={3} >
      <Popover
        placement='bottom'
        closeOnBlur={false}
        isOpen={isOpen}
      >
        <PopoverTrigger>
          <HStack>
          <Input onClick={() => {handleSetResults([]); setIsOpen(true)}} bg="A7C193" variant='outline' isReadOnly placeholder='Search for a species' />        
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          {/* <FocusLock persistentFocus={false}> */}
            <PopoverCloseButton onClick={() => {setIsOpen(false)}}/>
            <Form setResults={handleSetResults} />
          {/* </FocusLock> */}
        </PopoverContent>
      </Popover>
     
       </Box> 
     
      {hasResults.current && displayedResults.map(r => 
      <Box  key={r.SpeciesId}>
          <HStack>
          <Text fontWeight="bold"> Species Id: </Text>
          <Link onClick={() => handleModal(r)}>{r.SpeciesId} </Link>
          <Text fontWeight="bold"> Name:</Text>
          <Text> {r.CommonName} </Text>
          <Text fontWeight="bold"> Category:</Text>
          <Text> {r.Category} </Text>
         
          </HStack>
          <Text> Family:  {r.Family}</Text>
     
          <Text> Order: {r.SpeciesOrder} </Text>
          <Text> Scientific Name: {r.ScientificName} </Text>
         {r.ConservationStatus && <Text> Conservation Status: {r.ConservationStatus} </Text> }
         {r.Nativeness && <Text>Nativeness {r.Nativeness} </Text> }
       {r.Seasonality && <Text> Seasonality: {r.Seasonality} </Text> }
          <Divider/>
        </Box>)}

     {modalOpen &&
        <Popover >
          <Box  width="400px" height="200px"> 
          <VStack>

           
        <Text>{expandedSpecies.CommonName}</Text>
        <Text>{expandedSpecies.ScientificName}</Text>
        <Text>{expandedSpecies.SpeciesId}</Text>
        <Text fontWeight="bold" fontSize="15px"> Found in Parks: </Text>    
        { foundInParks.map(park =>  (<Text key={park.name}>  {park.name}, {park.state} </Text> )) }

        <Button onClick={() => handleModal()} variantColor="blue" >
          Close
        </Button>
        </VStack>
        </Box>
        </Popover> }
     
      </Box>
    </>
  )
}

export default PopoverForm;