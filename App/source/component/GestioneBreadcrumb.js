'use strict'
//react
const React = require('react');
const ReactDOM = require('react-dom');
//import gif durante caricamento
const Loading = require('react-loading-animation');
//componente bootstrap
const Breadcrumb = require('react-bootstrap/lib/Breadcrumb');

class GestioneBreadcrumb extends React.Component {
    constructor(props){
      super(props);
      this.state =
        {
          isLoading: true , //sempre a true
          briciole: props.briciole ,
          callbackParent: props.callbackParent,
          disattivo: props.disattivo
        };
      //gestione click su link
      this.gestioneClick = this.gestioneClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //imposto oggetto per aggiornare coerentemente stato componente 
        var oggettoModifica = {};
        //se navigo avanti\indietro aggiorno il componente
        if (nextProps.briciole.length != this.state.briciole.length){
            let result = [];
            for (let contenuto of nextProps.briciole){
                result.push(contenuto);
            }
            oggettoModifica.briciole = result;
            //this.setState({briciole:result});
        }
        //aggiungo altre 2 properties provenienti dal mondo esterno
        if (nextProps.callbackParent && nextProps.callbackParent != this.state.callbackParent){
          oggettoModifica.callbackParent = nextProps.callbackParent;
        }
        if (typeof nextProps.disattivo == 'boolean' && nextProps.disattivo != this.state.disattivo){ //verifico che sia boolean e aggiorno se diversa
          oggettoModifica.disattivo = nextProps.disattivo;
        }
        //aggiorno stato
        if (oggettoModifica) {
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
        this.setState({isLoading:false});
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
        let items = [];
        //per creare elementi dinamici non conviene JSX ma le primitive di React
        //questo a causa delle misure anti XSS 
        for (let i = 0; i < this.state.briciole.length; i++){ 
          items.push(React.createElement(Breadcrumb.Item , 
                                              {active: this.state.disattivo ? this.state.disattivo : i == this.state.briciole.length - 1 ? true : false,
                                               href: '#',
                                               title: this.state.briciole[i] ,
                                               target: this.state.briciole[i] ,
                                               key:i,
                                               onClick:this.gestioneClick
                                              }, 
                                              this.state.briciole[i]));
        }
        result = <Breadcrumb>{items}</Breadcrumb>;
      }
     return result; 
    }
  }
  
  module.exports=GestioneBreadcrumb;