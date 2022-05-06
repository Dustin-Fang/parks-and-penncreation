import React from 'react';
import { Form, FormInput, FormGroup} from "shards-react"; //, Button, Card, CardBody, CardTitle, Progress

import {
    Table,
    Pagination,
    Row,
    Col,
    Divider
} from 'antd'

import NavBar from './NavBar';
import {getParksSearch, getPark} from '../fetcher'

const { Column } = Table; //, ColumnGroup

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
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleZipcodeQueryChange = this.handleZipcodeQueryChange.bind(this)
        this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        this.goToPark = this.goToPark.bind(this)
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

    goToPark(parkId) {
        window.location = `/parks?id=${parkId}`
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
        getPlayerSearch(this.state.nameQuery, this.state.zipcodeQuery, this.state.stateQuery, null, null).then(res => {
            this.setState({ parksResults: res.results })
        })
        getPark(this.state.selectedParkId).then(res => {
            this.setState({ selectedParkDetails: res.results[0] })
        })
    }

    render () {
        return (
            <div>
                <NavBar/>
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Name</label>
                            <FormInput placeholder="Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Zipcode</label>
                            <FormInput placeholder="Zipcode" value={this.state.zipcodeQuery} onChange={this.handleZipcodeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>State</label>
                            <FormInput placeholder="State" value={this.state.clubQuery} onChange={this.handleStateQueryChange} />
                        </FormGroup></Col>
                    </Row>
                </Form>
                <Divider />
                <Table onRow={(record, rowIndex) => {
                    return {
                        onClick: event => { this.goToPark(record.ParkId) }, // clicking a row takes the user to a detailed view of the park using the ParkId parameter
                    };
                }} dataSource={this.state.parksResults} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }}>
                    <Column title="Name" dataIndex="Name" key="Name"></Column>
                    <Column title="Acres" dataIndex="Acres" key="Acres"></Column>
                    <Column title="Latitude" dataIndex="Latitude" key="Latitude"></Column>
                    <Column title="Longitude" dataIndex="Longitude" key="Longitude"></Column>
                </Table>
            </div>
        );
    }
}

export default ParksPage;
