/* eslint-disable */
import {
  Popover,
  PopoverTrigger,
  Button,
  RadioGroup,
  Radio,
  HStack,
  PopoverContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  PopoverCloseButton,
} from '@chakra-ui/react';

import React, { useRef, useState } from 'react';
import { recommendPark } from '../fetcher.js';
import FocusLock from "react-focus-lock";

const weatherEvents= ['Rain', 'Fog', 'Snow', 'Cold', 'Storm', 'None'];

// Create the form
const Form = ({ setShowModal, getResults, setModalHeader }) => {
  const desirableSelected = useRef("");
  const undesirableSelected = useRef("");
  const [error, setError] = useState("");

  async function onSearchClick() {
    if(!(desirableSelected.current.length || undesirableSelected.current.length)) {
      setError("Must select an input!")
    } 
    else if (desirableSelected.current === undesirableSelected.current) {
      setError("A weather event cannot both be desirable and undesirable!")
    } 
    else {
      // console.log("loading...")
      setShowModal(true); 
      recommendPark(undesirableSelected.current, desirableSelected.current).then((r) => {
        if (!r.results.length) {
          undesirableSelected.current = '';
          desirableSelected.current = '';
          recommendPark(undesirableSelected.current, desirableSelected.current).then((res) => {
            setModalHeader("None of our parks matched your query, but we think you would still love");
            getResults(res.results);
          })
       } else {
        setModalHeader("Parks you would love");
        getResults(r.results);
       } 
      })
    }
  }

  function onDesirableClick(e) {
    if (e.target.value === 'None') {
      desirableSelected.current = "";
    } else {
      desirableSelected.current = e.target.value;
    }
  }

  function onUndesirableClick(e) {
    if (e.target.value === 'None') {
      undesirableSelected.current = "";
    } else {
      undesirableSelected.current = e.target.value;
    }
  }

  return (
    <Stack>
    <FormControl as='fieldset'>
    <FormLabel >Desirable Weather</FormLabel>
    <RadioGroup onClick={onDesirableClick}>
        {weatherEvents.map((event) => 
           <Radio key={event +"1"} value={event}>{event}</Radio>
         )}

    </RadioGroup>

    <FormLabel > Undesirable Weather </FormLabel>
    <RadioGroup onClick={onUndesirableClick}>
        {weatherEvents.map((event) => 
           <Radio key={event +"2"} value={event}>{event}</Radio>
         )}

    </RadioGroup>
  </FormControl>
        <Button  onClick={onSearchClick} colorScheme='green'>
          Search
        </Button>
       <Text fontSize="14px" fontWeight="semibold" color="#f51d0a"> {error} </Text>
     </Stack>
  )
}

const PopoverForm = ({ setShowModal, getResults, setModalHeader }) => {
  return (
    <> 
      <Box d='inline-block' bg="#f2f2f0" mr={3} width="500px">
  
      <Popover
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <HStack>
          <Input variant='filled' isReadOnly placeholder='Find the park for you' />        
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock persistentFocus={false}>
            <PopoverCloseButton />
            <Form setShowModal={setShowModal} getResults={getResults} setModalHeader={setModalHeader}/>
          </FocusLock>
        </PopoverContent>
  
      </Popover>
      </Box>
    </>
  )
}

export default PopoverForm;