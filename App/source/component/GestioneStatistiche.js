'use strict'
//react
const React = require('react');
const ReactDOM = require('react-dom');
//import gif durante caricamento
const Loading = require('react-loading-animation');
//componente bootstrap
const Panel = require('react-bootstrap/lib/Panel');

class GestioneStatistiche extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        isLoading: true, //sempre a true
      };
    //estendo classe con funzioni custom se necessario
    //this.scegliRender = this.scegliRender.bind(this);  
  }
  /*
  componentWillReceiveProps(nextProps) {

  }
  shouldComponentUpdate(nextProps, nextState){
 
  }
  componentWillUpdate(nextProps, nextState){
 
  }  
  componentDidUpdate(prevProps, prevState){
 
  }
  */

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  render() {
    /*
    return(
      this.state.isLoading ? *showLoadingScreen* : *yourPage()*
    );
    */
    let result = {};
    if (this.state.isLoading) {
      result = <Loading />;
    } else {
      result = <div>
        <h2>Statistiche</h2>
        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Totale comandi richiamati nelle ultime 24 ore</Panel.Title>
          </Panel.Heading>
          <Panel.Body>2410</Panel.Body>
        </Panel>
        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Comando più richiamato</Panel.Title>
          </Panel.Heading>
          <Panel.Body>eventi_oggi</Panel.Body>
        </Panel>
        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Località più ricorrente</Panel.Title>
          </Panel.Heading>
          <Panel.Body>Calto</Panel.Body>
        </Panel>
      </div>;
    }
    return result
  }
}

module.exports = GestioneStatistiche;