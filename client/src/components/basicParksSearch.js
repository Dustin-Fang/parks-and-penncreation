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
      <FormControl as='fieldset' paddingBottom="15px">

        <FormLabel>Park name</FormLabel>
        <Input id="Name" onChange={handleinputChange}
          bg="A7C193" variant='outline' placeholder='Acadia National Park' />

        <FormLabel > Zipcode </FormLabel>
        <Input id="Zip" onChange={handleinputChange} bg="A7C193" variant='outline' placeholder='4609' />

        <FormLabel > State </FormLabel>
        <Input id="State" onChange={handleinputChange} bg="A7C193" variant='outline' placeholder='CO' />

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
        <Box padding={2} mr={3} >

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
                <Input bg="A7C193" variant='outline' isReadOnly placeholder='Search for parks' />
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