import {
  Flex,
  Image
} from '@chakra-ui/react';
import NavBar from './NavBar';

function HomePage() {
  return (
    <Flex
    width="100wh"  
    height="100vh"  
    justifyContent="center"
    alignItems="center"
    >
      <NavBar />
      {/* placeholder, but would be cool if we can use getty api/web scraping to do different park pictures */}
      <Image height="100%" width="100%" src='https://www.flushmate.com/sites/flushmate/files/2020-04/Sequoia-Lodge-Gallery-02.jpg'/>
  </Flex>
  );
}

export default HomePage;
