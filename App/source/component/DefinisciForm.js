'use strict'
//jquery
const $ = require('jquery');
//react
const React = require('react');
const ReactDOM = require('react-dom');
//import gif durante caricamento
const Loading = require('react-loading-animation');
//componenti bootstrap
const FormControl = require('react-bootstrap/lib/FormControl');
const FormControlFeedback = require('react-bootstrap/lib/FormControlFeedback');
const FormGroup = require('react-bootstrap/lib/FormGroup');
const ControlLabel = require('react-bootstrap/lib/ControlLabel');
const HelpBlock = require('react-bootstrap/lib/HelpBlock');

//varie ed eventuali
function restituisciClasse(nomeClasse) {
  let result = {};

  if (nomeClasse == "FormControl") {
    result = FormControl;
  }
  if (nomeClasse == "FormGroup") {
    result = FormGroup;
  }
  if (nomeClasse == "ControlLabel") {
    result = ControlLabel;
  }
  if (nomeClasse == "HelpBlock") {
    result = HelpBlock;
  }
  if (nomeClasse == "FormControlFeedback") {
    result = FormControlFeedback;
  }
  if (nomeClasse == "FormControl.Feedback") {
    result = FormControl.Feedback;
  }
  return result;
}

function restituisciFragment(arrInp) {
  let result = [];

  for (let chiave in arrInp) {
    result.push(
      React.createElement(
        restituisciClasse(arrInp[chiave].type),
        arrInp[chiave].props,
        arrInp[chiave].children ? arrInp[chiave].children : null)
    );
  }
  return result;
}


class DefinisciForm extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        isLoading: true, //sempre a true
        tabella: props.tabella, //nome tabella
        urlCampiForm: props.urlCampiForm, //url per richiamare server ed ottenere l'oggetto con i campi della form
        campiForm: props.campiForm, //campi della form,array così composto
        /*
         [{type:TYPE , props:{prop1:1 , prop2:2 , ...} , children:[{type:TYPE , props:{}, children} , {type:TYPE , props:{}, children} , .... ]} ,
          {type:TYPE , props:{prop1:1 , prop2:2 , ...} , children:[{type:TYPE , props:{}, children} , {type:TYPE , props:{}, children} , .... ]} ,
          ...... ,
          {type:TYPE , props:{prop1:1 , prop2:2 , ...} , children:[{type:TYPE , props:{}, children} , {type:TYPE , props:{}, children} , .... ]}
         ];
        */
        //callbackParent: props.callbackParent
      };
    //estendo classe con funzioni custom se necessario
    this.popolaForm = this.popolaForm.bind(this);
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
    let istanzaClasse = this;
    $.post('/impostaForm', {tabella:this.state.tabella} , function (result) {
      istanzaClasse.setState({ isLoading: false, campiForm: result });
    });
  }
  /* 
  gestioneClick(evento) {
      this.state.callbackParent(evento.target.innerText);
  }
  */
  popolaForm() {
    //https://react-bootstrap.github.io/components/forms/  
    //React.createElement(type , props , child/reactfragment)  
    //React.createElement(Button , {href: '#' , key:indKey , onClick:this.gestioneClick}, valore)
    let totaleNodi = [];

    for (let istanza of this.state.campiForm) {
      totaleNodi.push(
        React.createElement
          (
          restituisciClasse(istanza.type),
          istanza.props,
          restituisciFragment(istanza.children) ? restituisciFragment(istanza.children) : null 
          )
      );
    }
    return totaleNodi;

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
      result =
        <form>
          <br />
          {this.popolaForm()}
        </form>
    }
    return result;
  }
}
module.exports = DefinisciForm;         