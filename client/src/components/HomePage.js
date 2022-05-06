import {
  Flex,
  Image,
  Popover,
  PopoverTrigger,
  PopoverBody,
  Button,
  PopoverContent,
  Box,
  Text,
  PopoverCloseButton,
  VStack,

} from '@chakra-ui/react';
import NavBar from './NavBar';
import React from 'react';
import PopoverForm from './parkSearch'

function HomePage() {
  //placeholder
  const speciesName = 'Red Fox';
  const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg/440px-Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg';

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
      <Box position="absolute" bottom={30} right={50}>
        <Popover>
          <PopoverTrigger>
             <Button> Animal of the Day </Button>
          </PopoverTrigger>

          <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody justifyItems="center" alignItems="center">
              <VStack>
              <Image height="200px" width="200px" src={url}/>
             <Text fontFamily="Roboto" fontSize="20px" fontWeight="semibold"> {speciesName} </Text>
             </VStack>
            </PopoverBody>
          </PopoverContent>
          </Popover>
      </Box>

      <Box bgColor="#FFFFF" position="absolute" >
       <PopoverForm /> 
      </Box>

      <Text fontWeight="bold" fontSize="15px" position="absolute" left={1} bottom={0} color="#ebe534"> Sequoia National Park, CA </Text>
  </Flex>
  );
}

export default HomePage;
