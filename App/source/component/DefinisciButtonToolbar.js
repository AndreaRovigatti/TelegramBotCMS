'use strict'
//react
const React = require('react');
const ReactDOM = require('react-dom');
//import gif durante caricamento
const Loading = require('react-loading-animation');
//componenti bootstrap
const Button = require('react-bootstrap/lib/Button');
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');

class DefinisciButtonToolbar extends React.Component {
    constructor(props){
      super(props);
      this.state =
        {
          isLoading: false , //solitamente sempre a true, per ora forzo a false
          tasti: props.tasti ,
          callbackParent: props.callbackParent ? props.callbackParent : function(){}
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
      let oggettoModifica = {};
      if (nextProps.tasti && nextProps.tasti != this.state.tasti){
        oggettoModifica.tasti = nextProps.tasti;
      }
      if (nextProps.callbackParent && nextProps.callbackParent != this.state.callbackParent){
        oggettoModifica.callbackParent = nextProps.callbackParent
      }
      if (oggettoModifica){
        this.setState(oggettoModifica);
      }
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
      //setTimeout(() => this.setState({ isLoading: false }), 1000); // simulates an async action, and hides the spinner
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
          reactTasti.push(React.createElement(Button , {href: '#' , 
                                                        key:indKey , 
                                                        onClick:this.gestioneClick ,
                                                        bsStyle:"primary" , 
                                                        bsSize:"large"}, 
                                                        valore));
          indKey += 1;
        }
        result = <ButtonToolbar>{reactTasti}</ButtonToolbar>;
      }
     return result; 
    }

  } 
  module.exports=DefinisciButtonToolbar;