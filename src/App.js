import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { Input, Select, Option, Container, Row, Col, Button } from 'muicss/react';
import { PulseLoader } from 'react-spinners';
import TypingColumn from './TypingColumn'

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
    };

    this.selectOptions = [
      { value: 'GET', label: 'GET' },
      { value: 'PUT', label: 'PUT' },
      { value: 'POST', label: 'POST' },
      { value: 'DELETE', label: 'DELETE' }
    ];
  }

  onButtonClick = () => {
    this.setState({
      loading: true
    });
  
    const options = {
      method: this.state.selectedOption,
      headers: this.state.header,
      data: this.state.body ,
      url: this.state.url
    };
    
    console.log(options);
    axios.interceptors.response.use(
      response => response,
      error => {
        if (typeof error.response === 'undefined') {
          error.response = "A network error occurred. This could be a CORS issue or a dropped internet connection."
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
            response: res.data
          });
        },
        (error) => {
          let response;
          let codeResponse = error.response.status ? error.response.status : false;

          if(error.response.data) {
            response = error.response.data;
          } else {
            console.log("aqui " + error.response);
            response = [error.response];
          }

          this.setState({
            response,
            codeResponse
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

  onChangeFunction = (label, evt) => {
    try {
      let jsonParsed = JSON.parse(evt.target.value);
      let invalidHeader, invalidBody, header, body;

      if (label === "Header") {
        invalidHeader = false;
        header = jsonParsed;
        body = this.state.body;
        invalidBody = this.state.invalidBody;
      } else if (label === "Body") {
        invalidBody = false;
        header = this.state.header;
        body = jsonParsed;
        invalidBody = this.state.invalidHeader;
      }

      this.setState({
        header,
        body,
        invalidHeader,
        invalidBody
      });
    } catch(e) {
      if (evt.target.value !== "") {
        // if (evt.target.value.trim().slice(-3) === "\",}") {
        //   evt.target.value = evt.target.value.slice(0, -1) + "\"\":\"\"}";
        // } else if (evt.target.value.trim().slice(-2) === "\",") {
        //   evt.target.value += "\"\":\"\"}";
        // }

        this.setState({
          invalidHeader: (label === "Header") ? true : this.state.invalidHeader,
          invalidBody: (label === "Body") ? true : this.state.invalidBody
        })
      } else {
        this.setState({
          header: (label === "Header") ? {} : this.state.header,
          body: (label === "Body") ? {} : this.state.body,
          invalidHeader: (label === "Header") ? false : this.state.invalidHeader,
          invalidBody: (label === "Body") ? false : this.state.invalidBody
        });
      }
    }
  }
  
  // onChangeHeader = (evt) => {
  //   try {
  //     let jsonParsed = JSON.parse(evt.target.value);
  //     this.setState({
  //       header: jsonParsed,
  //       invalidHeader: false
  //     });
  //   } catch(e) {
  //     if (evt.target.value !== "") {
  //       if (evt.target.value.trim().slice(-3) === "\",}") {
  //         evt.target.value = evt.target.value.slice(0, -1) + "\"\":\"\"}";
  //       } else if (evt.target.value.trim().slice(-2) === "\",") {
  //         evt.target.value += "\"\":\"\"}";
  //       }

  //       this.setState({
  //         invalidHeader: true
  //       })
  //     } else {
  //       this.setState({
  //         header: {},
  //         invalidHeader: false
  //       });
  //     }
  //   }
  // }
  
  // onChangeBody = (evt) => {
  //   try {
  //     let jsonParsed = JSON.parse(evt.target.value);
  //     this.setState({
  //       body: jsonParsed,
  //       invalidBody: false
  //     });
  //   } catch(e) {
  //     if (evt.target.value !== "") {
  //       if (evt.target.value.trim().slice(-3) === "\",}") {
  //         evt.target.value = evt.target.value.slice(0, -1) + "\"\":\"\"}";
  //       } else if (evt.target.value.trim().slice(-2) === "\",") {
  //         evt.target.value += "\"\":\"\"}";
  //       }

  //       this.setState({
  //         invalidBody: true
  //       })
  //     } else {
  //       this.setState({
  //         body: {},
  //         invalidBody: false
  //       });
  //     }
  //   }
  // }

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
            <TypingColumn 
              label="Header" 
              onChangeFunction={this.onChangeFunction} 
              invalid={this.state.invalidHeader} 
              parsedJSON={this.state.header}
            />

            <TypingColumn 
              label="Body" 
              onChangeFunction={this.onChangeFunction} 
              invalid={this.state.invalidBody} 
              parsedJSON={this.state.body}
            />
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
                  <ReactJson 
                    src={this.state.response} 
                    displayDataTypes={false}
                    enableClipboard={false}
                    theme={(this.state.codeResponse >= 200 && this.state.codeResponse < 400) ? "apathy:inverted" : "hopscotch"}
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