import React from 'react';
import './css/optionButton.css';

export default class OptionButton extends React.Component {

    render() {
      return (
        <div>
        <div className="optionChoice">
          <div className="mapType">
            <p> Seleccione el número de variables: </p>
            <div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(2)}>2</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(3)}>3</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(4)}>4</button></div>
            </div>
            <div>
              <p></p>
              <div>
                <div className="elaborate"><button className="btn-elaborate" id="elabora" onClick={(val) => this.props.onClick(val)}>Solucionar</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }