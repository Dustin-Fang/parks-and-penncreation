/* eslint-disable */
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
import { getSpecies, getParksBySpecies, getSpeciesWeather } from "../fetcher.js";
const loc = "http://localhost:3000";

// 2. Create the form
const Form = ({ setResults, setMsg }) => {
  // search by scientific name, common name, etc.
  const [searchTerm, setSearchTerm] = useState("");
  // user input
  const [input, setInput] = useState("");

  function handleinputChange(event) {
    setInput(event.target.value);
    setSearchTerm("by " + event.target.id)
  }

  async function onSearchClick() {
    setResults([]); // reset results for new search
    setMsg("Loading...");

    // remove "by" from search term (used to label button)
    const term = searchTerm.split(" ")[1]; 
    
    if(term === "CName") {
      getSpecies({commonName:input}).then((r) => {
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
  const [displayedResults, setDisplayedResults] = useState([]);
  // is search dropdown open?
  const [isOpen, setIsOpen] = useState(false);

  // are detailed results displayed?
  const [modalOpen, setModalOpen] = useState(false)

  const [expandedSpecies, setExpandedSpecies] = useState({})
  // expanded species' parks & weather
  const [foundInParks, setFoundInParks] = useState([]);
  const [commonOccurrences, setCommonOccurrences] = useState([]);

  // loading/error msg
  const [msg, setMsg] = useState("");

  function handleSetResults(arr) {
    setDisplayedResults(arr.slice(0, 5));

    // close drop down inpt menu
    setIsOpen(false);

    // if arr is empty, reset
    if (!arr.length) {
      setModalOpen(false);
      hasResults.current = false; 
      return;
    }
    // if arr.length, show results
    hasResults.current = true;
  }

  // display detailed results, or reset
  async function handleModal(species) {
    setMsg("Loading weather...");

    // reset any previous states while we wait for new results
    setFoundInParks([]);
    setCommonOccurrences([]);

    // if species passed in, query for parks & weather
    if (species) {
      const parks = await getParksBySpecies({pageNum:1, commonName: species.CommonName});
        // show detailed view
        setModalOpen(true)

        // hide initial results list
        hasResults.current = false;

        setExpandedSpecies(species);
        const tempParks = [];
        // note: get only the first state listed (if multiple)
        parks.results.map(park => tempParks.push({name: park.Name, state: park.State.split(",")[0], id: park.ParkId}));
        setFoundInParks(tempParks);
   
        const tempEvents = [];
        const events = await getSpeciesWeather({commonName: species.CommonName});
          //console.log(events);
        events.results.map(e => tempEvents.push({event: e.WeatherType, num: e.Occurances}));
        // set events when full list is populated
        setCommonOccurrences(tempEvents); 

        // clear error/loading msg
        setMsg(""); 
      } else {
      // if no data was passed in, we are closing the modal. reset everything
      setModalOpen(false);
      setFoundInParks([]);
      setCommonOccurrences([]);
      setMsg("");
      
      // displays initial list of results rather than detailed view
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
          <PopoverCloseButton onClick={() => {setIsOpen(false)}}/>
          <Form setResults={handleSetResults}setMsg={setMsg} />
      </PopoverContent>
    </Popover>
      </Box> 
    
    {hasResults.current  && displayedResults.map(species =>  
    <Box  key={species.SpeciesId}>
      <HStack paddingLeft={5} paddingTop={3}>
        <Text fontWeight="bold"> Name: </Text>
        <Link onClick={() => handleModal(species)}>{species.CommonName} </Link>
    
        <Text fontWeight="bold"> Category:</Text>
        <Text> {species.Category} </Text>
      </HStack>

      <Box paddingLeft={5} paddingBottom={3} > 
        <HStack>
          <Text fontWeight="semibold"> Scientific Name:</Text>
          <Text> {species.ScientificName} </Text>

          <Text fontWeight="semibold"> ID:</Text>
          <Text> {species.SpeciesId} </Text>
        </HStack>

        <HStack>
          <Text fontWeight="semibold"> Family:</Text>
          <Text> {species.Family} </Text>

          <Text fontWeight="semibold"> Order:</Text>
          <Text> {species.SpeciesOrder} </Text>
        </HStack>

        <HStack>
          { species.Nativeness && 
          <HStack>
            <Text fontWeight="semibold"> Nativeness:</Text>
            <Text> {species.Nativeness} </Text>
          </HStack> }
  
          { species.Seasonality && 
          <HStack>
            <Text fontWeight="semibold"> Seasonality:</Text>
            <Text> {species.Seasonality} </Text>
          </HStack> }
        </HStack>

        { species.ConservationStatus &&  
        <HStack>
          <Text fontWeight="semibold"> Conservation Status:</Text>
          <Text> {species.ConservationStatus} </Text>
        </HStack> }
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
      {foundInParks.map(park =>  
        (<Link key={park.name} onClick={() => window.location.href = `${loc}/parks?id=${park.id}` } > {park.name}, {park.state}  </Link>)) 
       }
    
      {commonOccurrences.length &&
        <Box>
          <Text fontWeight="bold" fontSize="15px"> Most Common Weather Events Experienced (2021) </Text>    
          
          { commonOccurrences.map(weather =>  (
          <HStack justifyContent={"center"} key={weather.event}> 
            <Text fontWeight="semibold">  {weather.event}: </Text>
            <Text> {weather.num} occurrences</Text>
          </HStack> 
          ))}
        </Box> 
      }

      <Button onClick={() => handleModal()} variantColor="blue" >
        Close
      </Button>
      </VStack>
      </Box>
      </Popover> 
    }
      <Text fontSize="15px" position="absolute" left={250} bottom={50}>  {msg} </Text>
    </Box>
  </>
)
}

export default PopoverForm;