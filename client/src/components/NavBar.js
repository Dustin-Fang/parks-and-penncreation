// import React from 'react';
// import {
//     Navbar,
//     NavbarBrand,
//     Nav,
//     NavItem,
//     NavLink
//   } from "shards-react";

// class NavBar extends React.Component {
//     render() {
//         return(
//         <Navbar type="dark" theme="primary" expand="md">
//         <NavbarBrand href="/"> ParksnRec </NavbarBrand>
//           <Nav navbar>
//             <NavItem>
//               <NavLink active href="/">
//                 Home
//               </NavLink>
//             </NavItem>
//             <NavItem>
//               <NavLink active href="/parks">
//                 Parks
//               </NavLink>
//             </NavItem>
//             <NavItem>
//               <NavLink active  href="/species" >
//                 Species
//               </NavLink>
//             </NavItem>
//           </Nav>
//       </Navbar>
//         )
//     }
// }

// export default NavBar


import {
  Box,
  Flex,
  HStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

function NavBar() {
  return (
    <Box backgroundColor="#A7C193" position="absolute" top="0" left="0" w="100%">
      <Box px={4}>
        <Flex h={12} alignItems={'center'} justifyContent={'space-between'}>
    
            <Box> Parks n' PennCreation</Box> 
            
          <Flex alignItems={'center'} paddingRight={2}>
              <HStack
              as={'nav'}
              spacing={3}
              display={{ base: 'none', md: 'flex' }}>
               <Link to="/parks"
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={'/parks'}>
                  Parks
               </Link>
                  <Link to="/species"
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={'/species'}>
                  Species
                </Link>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default NavBar;