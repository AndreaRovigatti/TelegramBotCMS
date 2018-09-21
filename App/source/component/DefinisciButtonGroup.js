'use strict'
//react
const React = require('react');
const ReactDOM = require('react-dom');
//import gif durante caricamento
const Loading = require('react-loading-animation');
//componenti bootstrap
const Button = require('react-bootstrap/lib/Button');
const ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

class DefinisciButtonGroup extends React.Component {
    constructor(props){
      super(props);
      this.state =
        {
          isLoading: true , //sempre a true
          tasti: props.tasti ,
          callbackParent: props.callbackParent
        };
      //estendo classe con funzioni custom se necessario
      //this.scegliRender = this.scegliRender.bind(this); 
      this.gestioneClick = this.gestioneClick.bind(this);
    }
    //E' la prima funzione che viene chiamata quando cambia lo stato del componente
    //nella quale fare this.setState() se serve.
    //dopo vengono chiamate nell'ordine
    // shouldComponentUpdate (se restituisce false non vengono eseguite le successive)
    // componentWillUpdate   (da utilizzare prima del render)
    // render                (esegue il render con il nuovo stato)
    // componentDidUpdate    (eseguita dopo il render)
    componentWillReceiveProps(nextProps) {
  
    }
    /*
    shouldComponentUpdate(nextProps, nextState){
  
    }
    componentWillUpdate(nextProps, nextState){
  
    }  
    componentDidUpdate(prevProps, prevState){
  
    }
    */
    componentDidMount() {
      setTimeout(() => this.setState({ isLoading: false }), 1000); // simulates an async action, and hides the spinner
    }

    gestioneClick(evento) {
        this.state.callbackParent(evento.target.innerText);
    }
  
    render() {
      /*
      return(
        this.state.isLoading ? *showLoadingScreen* : *yourPage()*
      );
      */
      let result = {};
      if (this.state.isLoading){
        result = <Loading />;
      } else {
        let reactTasti = [];
        //per creare elementi dinamici non conviene JSX ma le primitive di React
        //questo a causa delle misure anti XSS 
        let indKey = 0;
        for (let valore of this.state.tasti){
          reactTasti.push(React.createElement(Button , {href: '#' , key:indKey , onClick:this.gestioneClick}, valore));
          indKey += 1;
        }
        result = <ButtonGroup justified>{reactTasti}</ButtonGroup>;
      }
     return result; 
    }
  } 
  module.exports=DefinisciButtonGroup;