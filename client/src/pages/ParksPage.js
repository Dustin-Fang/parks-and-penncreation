import React from 'react';
///import { Form, FormInput, FormGroup } from "shards-react"; //, Button, Card, CardBody, CardTitle, Progress

import {
    Flex,
    HStack,
    Stack,
    Box,
    FormControl,
    FormLabel,
    Input,
    Text,
    Button,
    Image,
    VStack
} from '@chakra-ui/react';

import {
    Table,
    Divider
} from 'antd'

import NavBar from '../components/NavBar';
import { getParksSearch, getPark, getParksFunFact, getSpeciesByPark } from '../fetcher'

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
            parksResults: [],
            speciesResults: [],
            speciesPage: 1,
            funFact: ''
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

    async setPark(parkId) {
        this.setState({ selectedParkId: parkId })
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
        getSpeciesByPark(1, this.state.selectedParkId).then(res => {
            this.setState({ speciesResults: res.results, speciesPage: 1 })
        })
    }

    async turnSpeciesPage() {
        getSpeciesByPark(this.state.speciesPage + 1, this.state.selectedParkId).then(res => {
            this.setState({ speciesResults: res.results, speciesPage: this.state.speciesPage + 1 })
        })
    }

    async updateSearchResults() {
        getParksSearch(this.state.nameQuery, this.state.zipcodeQuery, this.state.stateQuery, null, null).then(res => {
            this.setState({ parksResults: res.results })
        })
    }

    async componentDidMount() {
        var rndNum = Math.floor(Math.random * 3) + 1;
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
        getParksFunFact(rndNum).then(res => {
            console.log(res.results)
            this.setState({ funFact: res.results[0] })
        })
        getSpeciesByPark(1, this.state.selectedParkId).then(res => {
            this.setState({ speciesResults: res.results, speciesPage: 1 })
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
                                    <Stack padding={0}><FormLabel spacing={0}>Park name</FormLabel>
                                        <Input spacing={0} placeholder="Acadia National Park" value={this.state.nameQuery} onChange={this.handleNameQueryChange} bg="A7C193" variant='outline' /></Stack>

                                    <Stack padding={0}><FormLabel spacing={0}>Zipcode</FormLabel>
                                        <Input spacing={0} placeholder="4609" value={this.state.zipcodeQuery} onChange={this.handleZipcodeQueryChange} bg="A7C193" variant='outline' /></Stack>


                                    <Stack padding={0}><FormLabel spacing={0}>State</FormLabel>
                                        <Input spacing={0} placeholder="CO" value={this.state.clubQuery} onChange={this.handleStateQueryChange} bg="A7C193" variant='outline' /></Stack>

                                </HStack>

                            </FormControl>
                            <Button colorScheme='green' onClick={this.updateSearchResults}>Search</Button>

                            <Divider />
                            <Table onRow={(record) => {
                                return {
                                    onClick: () => { this.setPark(record.ParkId) }, // clicking a row takes the user to a detailed view of the park using the ParkId parameter
                                };
                            }} dataSource={this.state.parksResults} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }}>
                                <Column title="Name" dataIndex="ParkName" key="ParkName"></Column>
                                <Column title="State" dataIndex="State" key="State"></Column>
                                <Column title="Acres" dataIndex="Acres" key="Acres"></Column>
                            </Table>
                        </Stack>
                    </Box>

                    <Box bg="#A7C193" width="600px" height="100%">
                        <VStack padding={3}>
                            <Box padding={2} bg='white' width="100%" height="100%">
                                {this.state.selectedParkDetails ?
                                    <Stack>
                                        <HStack>
                                            <Stack>
                                            <Text fontSize="18px" fontWeight="semibold">{this.state.selectedParkDetails.ParkName}</Text>
                                                <Text>State: {this.state.selectedParkDetails.State}</Text>
                                                <Text>Acres: {this.state.selectedParkDetails.Acres}</Text>
                                                <Text>Latitude: {this.state.selectedParkDetails.Latitude}</Text>
                                                <Text>Longitude: {this.state.selectedParkDetails.Longitude}</Text>
                                            </Stack>
                                            <Image height="200px" width="300px" src={this.state.selectedParkDetails.ImageURL}></Image>
                                        </HStack>
                                        <Text fontWeight="semibold">Species in Park (Click to see next page)</Text>
                                        {this.state.speciesResults ?
                                            <Table onRow={() => {
                                                return {
                                                    onClick: () => { this.turnSpeciesPage()}, // clicking the table takes you to the next page
                                                };
                                            }} spacing={0} padding={0} dataSource={this.state.speciesResults} pagination={false}>
                                                <Column title="Scientific Name" dataIndex="ScientificName" key="ScientificName"></Column>
                                                <Column title="Nativeness" dataIndex="Nativeness" key="Nativeness"></Column>
                                                <Column title="Abundance" dataIndex="Abundance" key="Abundance"></Column>
                                            </Table>
                                            : null}
                                    </Stack>
                                    : null}
                            </Box>
                        </VStack>
                    </Box>
                </HStack>
                {/* <Box bg="#A7C193" >
                    <Text fontSize="20px" fontWeight="semibold">Fun Fact:</Text>
                    <Text>{this.state.funFact}</Text>
                </Box> */}
            </Flex>
        );
    }
}

export default ParksPage;
