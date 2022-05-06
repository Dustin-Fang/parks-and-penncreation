import {
  Popover,
  PopoverTrigger,
  Button,
  HStack,
  PopoverContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  PopoverCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import React, { useState } from 'react';
import FocusLock from "react-focus-lock";


// 2. Create the form
const Form = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState("");


  function handleinputChange(event) {
    setInput(event.target.value);
    setSearchTerm("by " + event.target.id)
    console.log(event.target.id)
    console.log(input)
  }

  return (
    <Stack>
      <Text size="10px"> Only your last input will be searched. </Text>
      <FormControl>
    <FormLabel > Zipcode </FormLabel>
    <Input id="Zip"  onChange={handleinputChange}  bg="A7C193" variant='outline' placeholder='4609' /> 

    <FormLabel > State </FormLabel>
    <Input id="State" onChange={handleinputChange}   bg="A7C193" variant='outline' placeholder='CO' /> 

  </FormControl>
  <Button colorScheme='green'>
          Search {searchTerm}
        </Button>
     </Stack>
  )
}

const PopoverForm = () => {
 const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)

  return (
    <> 
    <Box bg="#A7C193" width="600px" height="600px">
      <Box  padding={2} mr={3} >
  
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
          <Input bg="A7C193" variant='outline' isReadOnly placeholder='Get all species by 2021 weather' />        
          </HStack>
        
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverCloseButton />
            <Form firstFieldRef={firstFieldRef} />
          </FocusLock>
        </PopoverContent>
      </Popover>
      </Box>
      </Box>
    </>
  )
}

export default PopoverForm;