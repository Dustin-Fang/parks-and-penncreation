import {
  Popover,
  PopoverTrigger,
  Button,
  CheckboxGroup,
  Checkbox,
  HStack,
  PopoverContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
  PopoverCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import {  SearchIcon } from '@chakra-ui/icons';
import React from 'react';
import FocusLock from "react-focus-lock";

//placeholder, eventually replace with results of query (?)
const weatherEvents= ['Rain', 'Fog', 'Snow', 'Cold', 'Storm'];
const severities= ['Light', 'Moderate', 'Severe', 'Heavy'];


// 2. Create the form
const Form = () => {
  return (
    <Stack>
    <FormControl as='fieldset'>
    <FormLabel >Desirable Weather</FormLabel>
    <CheckboxGroup defaultValue='Snow'>
        {weatherEvents.map((event) => 
           <Checkbox key={event} value={event}>{event}</Checkbox>
         )}
         {severities.map((event) => 
           <Checkbox  key={event} value={event}>{event}</Checkbox>
         )}
    </CheckboxGroup>

    <FormLabel > Undesirable Weather </FormLabel>
    <CheckboxGroup defaultValue='Rain'>
        {weatherEvents.map((event) => 
           <Checkbox  key={event} value={event}>{event}</Checkbox>
         )}
         {severities.map((event) => 
           <Checkbox  key={event} value={event}>{event}</Checkbox>
         )}
    </CheckboxGroup>
  </FormControl>
        <Button colorScheme='green'>
          Search
        </Button>
     </Stack>
  )
}

const PopoverForm = () => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)

  return (
    <> 
      <Box d='inline-block' bg="#f2f2f0" mr={3} width="500px">
  
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <HStack>
          <Input variant='filled' isReadOnly placeholder='Find the park for you' />        
          <IconButton size='sm' icon={<SearchIcon />} />
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverCloseButton />
            <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
          </FocusLock>
        </PopoverContent>
      </Popover>
      </Box>
    </>
  )
}

export default PopoverForm;