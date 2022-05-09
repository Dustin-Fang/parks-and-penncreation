/* eslint-disable */
import { Popover,PopoverTrigger, Button, HStack, PopoverContent, Box, FormControl,
  FormLabel, Input, Stack, Text, RadioGroup, Radio, PopoverCloseButton, TableContainer,
  Tbody, Tr, Td, Th, Thead, Table
} from '@chakra-ui/react';

import React, { useState } from 'react';
import FocusLock from "react-focus-lock";
import { getSpeciesData } from '../fetcher.js';

// 2. Create the form
const Form = ({ setData, setMsg }) => {
  const categories = ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 
  'Spider/Scorpion', 'Insect', 'Crab/Lobster', 'Slug/Snail'];
  const [zip, setZip] = useState(0);
  const [category, setCategory] = useState("");

  function handleZipChange(event) {
    setZip(event.target.value);
  }

  function handleCatChange(event) {
    setCategory(event.target.value);
  }

  async function onSearchClick () {
    if (!zip || !category) {
      setMsg("Must enter a zipcode and a category!");
      return;
    }
    if (isNaN(zip) || (zip.length != 5 && zip.length != 4)) {
      setMsg("Must enter a valid zipcode!");
      return;
    }
    setMsg("Loading...");
    getSpeciesData(parseInt(zip), category).then((species) => {
      setData(species.results)
      if (!species.results.length) {
        setMsg("No data available.");
      } else {
        setMsg("");
      }
    })
  }

  return (
  <Stack>
    <FormControl>
      <FormLabel > Zipcode </FormLabel>
      <Input id="Zip"  onChange={handleZipChange}  bg="A7C193" variant='outline' placeholder='04609' /> 

      <FormLabel > Species Category </FormLabel>
      <RadioGroup onClick={handleCatChange}>
          {categories.map((cat) => 
            <Radio key={cat} value={cat}> {cat} </Radio>
          )}
      </RadioGroup>
    </FormControl>
    <Button onClick={onSearchClick} colorScheme='green'>
      Search 
    </Button>
  </Stack>
  )
}

const PopoverForm = () => {
  const [hasData, setHasData] = useState(false);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [msg, setMsg] = useState("");

  // is the search dropdown open?
  const [isOpen, setIsOpen] = useState(false);

  function handleData (data) {
    setDataToDisplay(data);
    setHasData(true);
    setIsOpen(false);
  }

  return (
    <> 
    <Box bg="#A7C193" width="600px" height="700px">
      <Box  padding={2} mr={3} >
  
      <Popover
       isOpen={isOpen}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <HStack>
          <Input onClick={() => setIsOpen(true)} bg="A7C193" variant='outline' isReadOnly 
          placeholder='Get 2021 weather for a species in a given zipcode and category' />        
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverCloseButton onClick={() => setIsOpen(false)}  />
            <Form setData={handleData} setMsg={setMsg}/>
          </FocusLock>
        </PopoverContent>
      </Popover>
      </Box>
      </Box>

{(hasData && !msg.length) && <TableContainer position="absolute" right={200} >
  <Table size='sm'>
    <Thead>
      <Tr>
        <Th>Weather Type</Th>
        <Th>Total Occurrences</Th>
      </Tr>
    </Thead>
    <Tbody>
    
      {dataToDisplay.map(d =>
        <Tr>
        <Td>{d.WeatherType}</Td>
        <Td>{d.TotalTime} </Td>
        </Tr>
      )}

    </Tbody>
  </Table>
</TableContainer>}
<Text position="absolute"bottom={95}  right={270}> {msg} </Text>
</>
  )
}

export default PopoverForm;
