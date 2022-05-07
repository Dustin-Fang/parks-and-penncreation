import React, { useState } from 'react';
//import { Form, FormInput, FormGroup } from "shards-react"; //, Button, Card, CardBody, CardTitle, Progress
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
    Flex,
    useDisclosure
} from '@chakra-ui/react';

import FocusLock from "react-focus-lock";
import { Table } from 'antd'

import NavBar from './NavBar';
import { getParksSearch, getPark } from '../fetcher'

const { Column } = Table; //, ColumnGroup


const SimpleForm = () => {
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

// const { onOpen, onClose, isOpen } = useDisclosure()
// const firstFieldRef = React.useRef(null)

class ParksPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            zipcodeQuery: 0,
            stateQuery: '',
            selectedParkId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedParkDetails: null,
            parksResults: []
        }


        this.updateSearchResults = this.updateSearchResults.bind(this)
        //this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        //this.handleZipcodeQueryChange = this.handleZipcodeQueryChange.bind(this)
        //this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        //this.setPark = this.setPark(this.state.selectedParkId).bind(this)
    }

    setPark(parkId) {
        this.setState({ selectedParkId: parkId })
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
    }

    updateSearchResults() {
        getParksSearch(this.state.nameQuery, this.state.zipcodeQuery, this.state.stateQuery, null, null).then(res => {
            this.setState({ parksResults: res.results })
        })
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
    }

    componentDidMount() {
        getParksSearch(this.state.nameQuery, this.state.zipcodeQuery, this.state.stateQuery, null, null).then(res => {
            this.setState({ parksResults: res.results })
        })
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
    }

    render() {
        return (
            <Flex
                width="100wh"
                height="100vh"
                justifyContent="center"
                alignItems="center"
                backgroundColor="#4E7C50"
            >
                <NavBar />
                <HStack position="absolute" top="40px" padding={10} spacing="100px">
                    <Box bg="#A7C193" width="600px" height="600px">
                        <Box padding={2} mr={3} >

                            <Popover
                              //  isOpen={isOpen}
                                // initialFocusRef={firstFieldRef}
                              //  onOpen={onOpen}
                              //  onClose={onClose}
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
                                        <SimpleForm  />
                                    </FocusLock>
                                </PopoverContent>
                            </Popover>
                        </Box>
                    </Box>
                    <Table onRow={(record, rowIndex) => {
                        return {
                            onClick: event => { this.setPark(record.ParkId) }, // clicking a row takes the user to a detailed view of the park using the ParkId parameter
                        };
                    }} dataSource={this.state.parksResults} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }}>
                        <Column title="Name" dataIndex="Name" key="Name"></Column>
                        <Column title="Acres" dataIndex="Acres" key="Acres"></Column>
                        <Column title="Latitude" dataIndex="Latitude" key="Latitude"></Column>
                        <Column title="Longitude" dataIndex="Longitude" key="Longitude"></Column>
                    </Table>
                </HStack>
            </Flex>
        );
    }
}

export default ParksPage;
