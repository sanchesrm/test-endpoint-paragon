import React from 'react';
import ReactJson from 'react-json-view';
import { Textarea, Col } from 'muicss/react';

const TypingColumn = (props) => {
    return (
        <Col md="6" className="headerColumn">
            <Textarea 
                label={props.label} 
                floatingLabel={true} 
                onChange={props.onChangeFunction.bind(this, props.label)}
                invalid={props.invalid}
            />
            <ReactJson 
                src={props.parsedJSON} 
                displayDataTypes={false}
                enableClipboard={false}
            />
        </Col>
    );
}

export default TypingColumn;