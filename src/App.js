import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { Input, Select, Option, Textarea, Container, Row, Col, Button } from 'muicss/react';
import { PulseLoader } from 'react-spinners';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: 'GET',
      header: {},
      body: {},
      url: "",
      invalidHeader: false,
      invalidBody: false,
      loading: false
    }

    this.selectOptions = [
      { value: 'GET', label: 'GET' },
      { value: 'PUT', label: 'PUT' },
      { value: 'POST', label: 'POST' },
      { value: 'DELETE', label: 'DELETE' }
    ]
  }

  onButtonClick = () => {
    this.setState({
      loading: true
    })
  
    const options = {
      method: this.state.selectedOption,
      headers: this.state.header,
      data: this.state.body ,
      url: this.state.url
    }
    console.log(options);
    axios.interceptors.response.use(
      response => response,
      error => {
        if (typeof error.response === 'undefined') {
          error.data = "A network error occurred. This could be a CORS issue or a dropped internet connection."
        }
        return Promise.reject(error);
     }
    );

    axios(options)
      .then(
        (res) => {
          console.log("RESPONSE RECEIVED: ", res);
          this.setState({
            codeResponse: res.status,
            response: res.data.data
          });
        },
        (error) => {
          console.log("AXIOS ERROR: ", JSON.stringify(error));
          this.setState({
            response: [error.data]
          });
        }
      )
      .finally(() => {
        this.setState({
          loading: false
        })
      })
  }

  onChangeSelect = (evt) => {
		this.setState({ 
      selectedOption: evt.target.value
    });
  }
  
  onBlurHeader = (evt) => {
    try {
      this.setState({
        header: JSON.parse(evt.target.value),
        invalidHeader: false
      });
    } catch(e) {
      if (evt.target.value !== "") {
        this.setState({
          invalidHeader: true
        })
      } else {
        this.setState({
          header: {},
          invalidHeader: false
        });
      }
    }
  }
  
  onBlurBody = (evt) => {
    try {
      this.setState({
        body: JSON.parse(evt.target.value),
        invalidBody: false
      });
    } catch(e) {
      if (evt.target.value !== "") {
        this.setState({
          invalidBody: true
        })
      } else {
        this.setState({
          body: {},
          invalidBody: false
        });
      }
    }
  }

  changeURL = (evt) => {
    this.setState({
      url: evt.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to testing endpoint</h1>
        </header>
        <Container>
          <Row>
            <Col md="2">
              <Select name="methodSelect" defaultValue={this.state.selectedOption} className="selectComponent" onChange={this.onChangeSelect.bind(this)}>
                {
                  this.selectOptions.map(function (option, i) {
                    return <Option key={i} value={option.value} label={option.label} />;
                  })
                }
              </Select>
            </Col>
            <Col md="10">
              <Input 
                label="URL" 
                required={true}
                type="url"
                floatingLabel={true}
                onChange={this.changeURL.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col md="6" className="headerColumn">
              <Textarea 
                label="Header" 
                floatingLabel={true} 
                onBlur={this.onBlurHeader.bind(this)}
                invalid={this.state.invalidHeader}
              />
              <ReactJson 
                src={this.state.header} 
                displayDataTypes={false}
                enableClipboard={false}
              />
            </Col>
            <Col md="6" className="bodyColumn">
              <Textarea 
                label="Body" 
                floatingLabel={true} 
                onBlur={this.onBlurBody.bind(this)}
                invalid={this.state.invalidBody}
              />
              <ReactJson 
                src={this.state.body} 
                displayDataTypes={false}
                enableClipboard={false}
              />
            </Col>
          </Row>
          <Row>
            {this.state.loading ? 
                <div className="pulseLoader">
                  <PulseLoader 
                    color={ '#2196F3' }
                    loading={ this.state.loading }
                  /> 
                </div>
              :
              <Button 
                color="primary" 
                onClick={this.onButtonClick.bind(this)} 
                disabled={(this.state.invalidHeader || this.state.invalidBody || this.state.url === "" ) ? true : false}
              >Test Endpoint
              </Button>
            }
          </Row>
          <Row>
            <Col md="6" md-offset="3">
              { this.state.response ?
                  // this.state.response
                  <ReactJson 
                    src={this.state.response} 
                    displayDataTypes={false}
                    enableClipboard={false}
                  />
                :
                  ''
              }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;