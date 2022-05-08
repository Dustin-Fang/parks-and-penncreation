/* eslint-disable */
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
    VStack,
    RadioGroup,
    Radio,
} from '@chakra-ui/react';

import {
    Table,
    Divider
} from 'antd'

import NavBar from '../components/NavBar';
import { getParksSearch, getPark, getSpeciesByPark, getParksFunFact, getMostWeatherSpecies, postParksWeatherSearch } from '../fetcher'

const { Column } = Table; //, ColumnGroup
const weatherEvents = ['Rain', 'Fog', 'Snow', 'Cold', 'Storm', 'Precipitation'];
const allStates = ['AL', 'AK', 'AZ', 'AS', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
    'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
    'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', '']

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
            funFactPark: '',
            funFactPrompt: '',
            funFactImage: '',
            weatherEventQuery: '',
            weatherSpeciesPage: 1,
            weatherSpeciesResults: [],
            weatherZipcodeQuery: '',
            startMonthQuery: '',
            endMonthQuery: '',
            weatherResults: [],
            searchError: '',
            weatherSearchError: '',
            radioButtonError: '',
            radioButtonLoadingMsg: '',
            weatherLoadingMsg: ''
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleZipcodeQueryChange = this.handleZipcodeQueryChange.bind(this)
        this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        this.handleRadioButtonClick = this.handleRadioButtonClick.bind(this)
        this.setPark = this.setPark.bind(this)
        this.mostWeatherSearch = this.mostWeatherSearch.bind(this)
        this.getFunFact = this.getFunFact.bind(this)
        this.handleWeatherZipcodeQueryChange = this.handleWeatherZipcodeQueryChange.bind(this)
        this.handleStartMonthQueryChange = this.handleStartMonthQueryChange.bind(this)
        this.handleEndMonthQueryChange = this.handleEndMonthQueryChange.bind(this)
        this.updateWeatherSearchResults = this.updateWeatherSearchResults.bind(this)
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

    handleRadioButtonClick(event) {
        this.setState({ weatherEventQuery: event.target.value })
    }

    handleWeatherZipcodeQueryChange(event) {
        this.setState({ weatherZipcodeQuery: event.target.value })
    }

    handleStartMonthQueryChange(event) {
        this.setState({ startMonthQuery: event.target.value })
    }

    handleEndMonthQueryChange(event) {
        this.setState({ endMonthQuery: event.target.value })
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

    async mostWeatherSearch() {
        if (!weatherEvents.includes(this.state.weatherEventQuery)) {
            this.setState({ radioButtonError: "Please choose a weather event to search by." })
        }
        else {
            this.setState({ radioButtonLoadingMsg: "Loading..." })
            getMostWeatherSpecies(1, this.state.weatherEventQuery).then(res => {
                this.setState({ weatherSpeciesResults: res.results, weatherSpeciesPage: 1, radioButtonError: '', radioButtonLoadingMsg: '' })
            })
        }
    }

    async turnWeatherSpeciesPage() {
        this.setState({ radioButtonLoadingMsg: "Turning page, one sec..." })
        getMostWeatherSpecies(this.state.weatherSpeciesPage + 1, this.state.weatherEventQuery).then(res => {
            this.setState({ weatherSpeciesResults: res.results, weatherSpeciesPage: this.state.weatherSpeciesPage + 1, radioButtonLoadingMsg: '' })
        })
    }

    async turnSpeciesPage() {
        getSpeciesByPark(this.state.speciesPage + 1, this.state.selectedParkId).then(res => {
            this.setState({ speciesResults: res.results, speciesPage: this.state.speciesPage + 1 })
        })
    }

    async updateSearchResults() {
        if (!allStates.includes(this.state.stateQuery)) {
            this.setState({ searchError: "You can only search with valid two-letter state codes." })
        }
        else if (isNaN(this.state.zipcodeQuery) || this.state.zipcodeQuery.length > 5) {
            this.setState({ searchError: "Please enter a valid zipcode." })
        }
        else {
            getParksSearch(this.state.nameQuery, this.state.zipcodeQuery, this.state.stateQuery, null, null).then(res => {
                this.setState({ parksResults: res.results, searchError: '' })
            })
        }
    }

    async updateWeatherSearchResults() {
        if (this.state.weatherZipcodeQuery === "" || isNaN(this.state.weatherZipcodeQuery) || this.state.weatherZipcodeQuery.length > 5) {
            this.setState({ weatherSearchError: "Please enter a valid zipcode." })
        }
        else if (isNaN(this.state.startMonthQuery) || isNaN(this.state.endMonthQuery)) {
            this.setState({ weatherSearchError: "Month query must be a number." })
        }
        else if (parseInt(this.state.startMonthQuery) > 12 || parseInt(this.state.startMonthQuery) < 1
            || parseInt(this.state.endMonthQuery) > 12 || parseInt(this.state.endMonthQuery) < 1) {
            this.setState({ weatherSearchError: "Month query must be between 1 and 12." })
        }
        else if (parseInt(this.state.endMonthQuery) < parseInt(this.state.startMonthQuery)) {
            this.setState({ weatherSearchError: "Start month cannot be greater than end month." })
        }
        else {
            this.setState({ weatherLoadingMsg: "Loading..." })
            postParksWeatherSearch(this.state.weatherZipcodeQuery, this.state.startMonthQuery, this.state.endMonthQuery).then(res => {
                this.setState({ weatherResults: res.results, weatherSearchError: '', weatherLoadingMsg: '' })
            })
        }
    }

    async getFunFact() {
        var rndNum = Math.floor(Math.random() * 3) + 1;
        getParksFunFact(rndNum).then(res => {
            console.log(res)
            this.setState({ funFactPark: res.results[0].ParkName, funFactPrompt: res.prompt, funFactImage: res.results[0].ImageURL })
        })
    }

    async componentDidMount() {
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
        getSpeciesByPark(1, this.state.selectedParkId).then(res => {
            this.setState({ speciesResults: res.results, speciesPage: 1 })
        })
    }

    render() {
        return (
            <VStack backgroundColor="#4E7C50">
                <Flex
                    width="100wh"
                    height="95vh"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#4E7C50"
                >
                    <NavBar />
                    <HStack position="absolute" top="40px" padding={10} spacing="100px">
                        <Box bg="#A7C193" width="600px" height="100%">
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
                                <Text fontSize="14px" fontWeight="semibold" color="#f51d0a"> {this.state.searchError} </Text>

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
                                                        onClick: () => { this.turnSpeciesPage() }, // clicking the table takes you to the next page
                                                    };
                                                }} spacing={0} padding={0} dataSource={this.state.speciesResults} pagination={false}>
                                                    <Column title="Scientific Name" dataIndex="ScientificName" key="ScientificName"></Column>
                                                    <Column title="Common Name" dataIndex="CommonName" key="CommonName"></Column>
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
                </Flex>
                <Flex
                    width="100wh"
                    height="100vh"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#4E7C50"
                >
                    <HStack position="absolute" padding={10} spacing="50px">
                        <Box bg="#A7C193" width="100%" height="600px" padding={5}>
                            <Stack>
                                <Text fontSize="20px" fontWeight="semibold">
                                    Most Common Weather Events from 2021
                                </Text>
                                <FormControl as='fieldset' paddingBottom="15px">

                                    <HStack padding={0}>
                                        <Stack padding={0}><FormLabel spacing={0}>Zipcode</FormLabel>
                                            <Input spacing={0} placeholder="4609" value={this.state.weatherZipcodeQuery} onChange={this.handleWeatherZipcodeQueryChange} bg="A7C193" variant='outline' /></Stack>

                                        <Stack padding={0}><FormLabel spacing={0}>Start Month</FormLabel>
                                            <Input spacing={0} placeholder="1" value={this.state.startMonthQuery} onChange={this.handleStartMonthQueryChange} bg="A7C193" variant='outline' /></Stack>

                                        <Stack padding={0}><FormLabel spacing={0}>End Month</FormLabel>
                                            <Input spacing={0} placeholder="12" value={this.state.endMonthQuery} onChange={this.handleEndMonthQueryChange} bg="A7C193" variant='outline' /></Stack>

                                    </HStack>

                                </FormControl>
                                <Button colorScheme='green' onClick={this.updateWeatherSearchResults}>Search</Button>
                                <Text fontSize="14px" fontWeight="semibold" color="#f51d0a"> {this.state.weatherSearchError} </Text>

                                {this.state.weatherLoadingMsg ?
                                    <Text fontSize="14px" fontWeight="semibold"> {this.state.weatherLoadingMsg} </Text>
                                    : null}

                                {this.state.weatherResults ?
                                    <Table spacing={0} padding={0} dataSource={this.state.weatherResults} pagination={false}>
                                        <Column title="Weather Type" dataIndex="WeatherType" key="WeatherType"></Column>
                                        <Column title="Total Time" dataIndex="TotalTime" key="TotalTime"></Column>
                                    </Table>
                                    : null}
                            </Stack>
                        </Box>

                        <Box bg="#A7C193" width="100%" height="600px" padding={5}>
                            <Stack>
                                <Text fontSize="20px" fontWeight="semibold">
                                    Search for a Random Fun Fact!
                                </Text>
                                <Button onClick={this.getFunFact} colorScheme='green'>Search</Button>
                                <Divider />
                                {this.state.funFactPark ?
                                    <Box padding={2} bg='white' width="100%" height="100%">
                                        <Stack>
                                            <HStack>
                                                <Text fontWeight="semibold" fontSize="17px">Park name:</Text>
                                                <Text fontSize="17px">{this.state.funFactPark}</Text>
                                            </HStack>
                                            <Image height="200px" width="100%" src={this.state.funFactImage}></Image>
                                            <Text fontWeight="semibold" fontSize="17px" padding={0}>Fun fact:</Text>
                                            <Text fontSize="17px" padding={0}>{this.state.funFactPrompt}</Text>
                                        </Stack>
                                    </Box>
                                    : null}
                            </Stack>
                        </Box>

                        <Box bg="#A7C193" width="100%" height="600px" padding={5}>
                            <Stack>
                                <Text fontSize="20px" fontWeight="semibold">What species experienced the most of a weather event in a park?</Text>
                                <FormControl as='fieldset'>
                                    <RadioGroup onClick={this.handleRadioButtonClick}>
                                        <HStack spacing={2}>
                                        {weatherEvents.map((event) =>
                                            <Radio spacing={1} key={event + "1"} value={event}>{event}</Radio>
                                        )}
                                        </HStack>

                                    </RadioGroup>
                                </FormControl>
                                <Button onClick={this.mostWeatherSearch} colorScheme='green'>
                                    Search
                                </Button>
                                <Text fontSize="14px" fontWeight="semibold" color="#f51d0a"> {this.state.radioButtonError} </Text>
                                <Divider />
                                <Text fontWeight="semibold">Species in the park with the highest occurence of your selected event (Click table to see next page):</Text>
                                {this.state.weatherSpeciesResults ?
                                    <Table onRow={() => {
                                        return {
                                            onClick: () => { this.turnWeatherSpeciesPage() }, // clicking the table takes you to the next page
                                        };
                                    }} spacing={0} padding={0} dataSource={this.state.weatherSpeciesResults} pagination={false}>
                                        <Column title="Species ID" dataIndex="SpeciesId" key="SpeciesId"></Column>
                                        <Column title="Common Name" dataIndex="CommonName" key="CommonName"></Column>
                                    </Table>
                                    : null}
                                {this.state.radioButtonLoadingMsg ?
                                    <Text fontSize="14px" fontWeight="semibold"> {this.state.radioButtonLoadingMsg} </Text>
                                    : null}
                            </Stack>
                        </Box>
                    </HStack>
                </Flex>
            </VStack>
        );
    }
}

export default ParksPage;
