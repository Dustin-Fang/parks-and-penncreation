/* eslint-disable */
import {
  Popover,
  PopoverTrigger,
  Button,
  HStack,
  VStack,
  PopoverContent,
  Box,
  Center,
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
import { getSpecies, getParksBySpecies, getSpeciesWeather } from "../fetcher.js";
const loc = "http://localhost:3000";

// 2. Create the form
const Form = ({ setResults, setMsg }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState("");


  function handleinputChange(event) {
    setInput(event.target.value);
    setSearchTerm("by " + event.target.id)
  }

  async function onSearchClick() {
    setResults([]); // reset
    setMsg("Loading...");
    const term = searchTerm.split(" ")[1];
    
    if(term === "CName") {
      console.log("cname")
      getSpecies({commonName:input}).then((r) => {
        console.log(r)
        if (r.results.length) {
          setMsg(""); 
          setResults(r.results)
        } else {
          setMsg("No species found."); 
        }
      })
    } else if(term === "SName") {
      getSpecies({scientificName:input}).then((r) => {
        if (r.results.length) {
          setMsg(""); 
          setResults(r.results)
        } else {
          setMsg("No species found."); 
        }
      })
    } else if(term === "Zip") {
      getSpecies({zip:input}).then((r) => {
        if (r.results.length) {
          setMsg(""); 
          setResults(r.results)
        } else {
          setMsg("No species found."); 
        }})
    } else if(term === "State") {
      getSpecies({state:input}).then((r) => {
        if (r.results.length) {
          setMsg(""); 
          setResults(r.results)
        } else {
          setMsg("No species found."); 
        }
      })
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
    <Input id="Zip"  onChange={handleinputChange}  bg="A7C193" variant='outline' placeholder='04609' /> 

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
  const [displayedResults, setDisplayedResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedSpecies, setExpandedSpecies] = useState({})
  const [foundInParks, setFoundInParks] = useState([]);
  const [commonOccurrences, setCommonOccurrences] = useState([]);
  const [msg, setMsg] = useState("");

  function handleSetResults(arr) {
    setResults(arr.slice(0, 5));
    setDisplayedResults(arr.slice(0, 5));
    setIsOpen(false) 
    if (!arr.length) {
      setModalOpen(false);
      hasResults.current = false; 
      return;
    }
 
    hasResults.current = true;
  }

  async function handleModal(x) {
    setMsg("Loading weather...");

    // reset any previous stats while we wait for new results
    setFoundInParks([]);
    setCommonOccurrences([]);
    if (x) {
      const parks = await getParksBySpecies({pageNum:1, commonName: x.CommonName});
        setModalOpen(true)
        hasResults.current = false;
        setExpandedSpecies(x);

        const tempParks = [];
        parks.results.map(park => tempParks.push({name: park.Name, state: park.State.split(",")[0], id: park.ParkId}));
        setFoundInParks(tempParks);
   
        const tempEvents = [];
        const events = await getSpeciesWeather({commonName: x.CommonName});
          //console.log(events);
        events.results.map(e => tempEvents.push({event: e.WeatherType, num: e.Occurances}));
        // set events when full list is populated
        setCommonOccurrences(tempEvents); 
        setMsg("");
      } else {
      // if no data was passed in, we are closint the modal. reset everything
      setModalOpen(false);
      setFoundInParks([]);
      setCommonOccurrences([]);
      setMsg("");
      
      // shows initial list of results, rather than detailed view
      hasResults.current = true; 
    }
  }

  return (
    <> 
    <Box bg="#A7C193" width="600px" height="700px">      
      <Box  padding={2} mr={3} >
      <Popover
        placement='bottom'
        closeOnBlur={false}
        isOpen={isOpen}
      >
        <PopoverTrigger>
          <HStack>
          <Input onClick={() => {setIsOpen(true)}} bg="A7C193" variant='outline' isReadOnly placeholder='Search for a species' />        
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          {/* <FocusLock persistentFocus={false}> */}
            <PopoverCloseButton onClick={() => {setIsOpen(false)}}/>
            <Form setResults={handleSetResults}setMsg={setMsg} />
          {/* </FocusLock> */}
        </PopoverContent>
      </Popover>
     
       </Box> 
     
  {hasResults.current  && displayedResults.map(r =>  
    
       <Box  key={r.SpeciesId}>
          <HStack paddingLeft={5} paddingTop={3}>
            <Text fontWeight="bold"> Name: </Text>
            <Link onClick={() => handleModal(r)}>{r.CommonName} </Link>
        
            <Text fontWeight="bold"> Category:</Text>
            <Text> {r.Category} </Text>
          </HStack>

          <Box paddingLeft={5} paddingBottom={3} > 
            <HStack>
            <Text fontWeight="semibold"> Scientific Name:</Text>
            <Text> {r.ScientificName} </Text>

            <Text fontWeight="semibold"> ID:</Text>
            <Text> {r.SpeciesId} </Text>

            </HStack>

            <HStack>
            <Text fontWeight="semibold"> Family:</Text>
            <Text> {r.Family} </Text>

            <Text fontWeight="semibold"> Order:</Text>
            <Text> {r.SpeciesOrder} </Text>
            </HStack>

            <HStack>
            {r.Nativeness && 
            <HStack>
              <Text fontWeight="semibold"> Nativeness:</Text>
              <Text> {r.Nativeness} </Text>
            </HStack>}
     
            {r.Seasonality && 
            <HStack>
              <Text fontWeight="semibold"> Seasonality:</Text>
              <Text> {r.Seasonality} </Text>
            </HStack> }
            </HStack>
            {r.ConservationStatus &&  
            <HStack>
              <Text fontWeight="semibold"> Conservation Status:</Text>
              <Text> {r.ConservationStatus} </Text>
            </HStack>}
         </Box>

        <Divider/>
      
        </Box> )}

     {modalOpen &&
        <Popover >
          <Box position="absolute" left={125} top={150} justifyContent="center" width="400px" height="200px"> 

          <VStack>
           
          <HStack>
          <Text fontWeight="bold"> Name:</Text>
          <Text> {expandedSpecies.CommonName} </Text>
        </HStack>
   
        <HStack>
          <Text fontWeight="semibold"> Scientific Name:</Text>
          <Text> {expandedSpecies.ScientificName} </Text>
        </HStack>

        <HStack>
          <Text fontWeight="semibold"> ID:</Text>
          <Text> {expandedSpecies.SpeciesId} </Text>
        </HStack>

        <HStack>
          <Text fontWeight="semibold"> Category:</Text>
          <Text> {expandedSpecies.Category} </Text>
        </HStack>
     
     
        <Text fontWeight="bold" fontSize="15px"> Found in Parks: </Text>    
        { foundInParks.map(park =>  (<Link key={park.name} onClick={() => window.location.href = `${loc}/parks?id=${park.id}` } > {park.name}, {park.state}  </Link>)) }
     
        {commonOccurrences.length &&
        <Box>
        <Text fontWeight="bold" fontSize="15px"> Most Common Weather Events Experienced (2021) </Text>    
        {commonOccurrences.map(weather =>  (
        <HStack justifyContent={"center"} key={weather.event}> 
        <Text fontWeight="semibold">  {weather.event}: </Text>
        <Text> {weather.num} occurrences</Text>
         </HStack> )) }
        </Box> }
      

        <Button onClick={() => handleModal()} variantColor="blue" >
          Close
        </Button>
        </VStack>
  
        </Box>
        </Popover> }
     <Text fontSize="15px" position="absolute" left={250} bottom={50}>  {msg} </Text>
      </Box>
    </>
  )
}

export default PopoverForm;