import React from 'react';
///import { Form, FormInput, FormGroup } from "shards-react"; //, Button, Card, CardBody, CardTitle, Progress

import {
    Flex,
    HStack,
    //VStack,
    Stack,
    Box,
    FormControl,
    FormLabel,
    Input,
    Text,
    Button
} from '@chakra-ui/react';

import {
    Table,
    Divider
} from 'antd'

import NavBar from '../components/NavBar';
import { getParksSearch, getPark } from '../fetcher'

const { Column } = Table; //, ColumnGroup

class ParksPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            zipcodeQuery: '',
            stateQuery: '',
            selectedParkId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedParkDetails: null,
            parksResults: []
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleZipcodeQueryChange = this.handleZipcodeQueryChange.bind(this)
        this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        this.setPark = this.setPark.bind(this)
    }


    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }

    handleZipcodeQueryChange(event) {
        this.setState({ zipcodeQuery: event.target.value })
    }

    handleStateQueryChange(event) {
        this.setState({ stateQuery: event.target.value })
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
                        <Stack padding={3}>
                            <Text fontSize="20px" fontWeight="semibold">
                                Search for a Park
                            </Text>
                            <FormControl as='fieldset' paddingBottom="15px">

                                <HStack padding={0}>
                                <Stack padding={0}><FormLabel spacing = {0}>Park name</FormLabel>
                                <Input spacing = {0} placeholder="Acadia National Park" value={this.state.nameQuery} onChange={this.handleNameQueryChange} bg="A7C193" variant='outline' /></Stack>

                                <Stack padding={0}><FormLabel spacing = {0}>Zipcode</FormLabel>
                                <Input spacing = {0} placeholder="4609" value={this.state.zipcodeQuery} onChange={this.handleZipcodeQueryChange} bg="A7C193" variant='outline' /></Stack>


                                <Stack padding={0}><FormLabel spacing = {0}>State</FormLabel>
                                <Input spacing = {0} placeholder="CO" value={this.state.clubQuery} onChange={this.handleStateQueryChange} bg="A7C193" variant='outline' /></Stack>
                            
                                </HStack>

                            </FormControl>
                            <Button colorScheme='green' onClick={this.updateSearchResults}>Search</Button>
                            
                            <Divider />
                            <Table onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => { this.goToPark(record.id) }, // clicking a row takes the user to a detailed view of the park using the ParkId parameter
                                };
                            }} dataSource={this.state.parksResults} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }}>
                                <Column title="Name" dataIndex="Name" key="Name"></Column>
                                <Column title="Acres" dataIndex="Acres" key="Acres"></Column>
                                <Column title="Latitude" dataIndex="Latitude" key="Latitude"></Column>
                                <Column title="Longitude" dataIndex="Longitude" key="Longitude"></Column>
                            </Table>
                        </Stack>
                    </Box>

                    <Box bg="#A7C193" width="600px" height="600px">
                        <Stack padding={3}>
                            <Text fontSize="20px" fontWeight="semibold">
                                Park Information
                            </Text>
                            

                        </Stack>
                    </Box>
                </HStack>
            </Flex>
        );
    }
}

export default ParksPage;
