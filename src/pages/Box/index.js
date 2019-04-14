import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import Dropzone from 'react-dropzone';
import  socket from 'socket.io-client';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';

export default class Box extends Component {
    state = {
        box : {}
    }

    async  componentDidMount(){

    this.subcribebeToNewFiles();
      
      const box = this.props.match.params.id;

      const response = await api.get(`/boxes/${box}`);

      this.setState({  box: response.data }); 

    }

    subcribebeToNewFiles = () => {
        const box = this.props.match.params.id;
        const io = socket('https://backend-week-6.herokuapp.com');

        io.emit('connectRoom',box);

        io.on('file', data => {
            this.setState({
                box : { ...this.state.box, files:[ data, ...this.state.box.files ]}
            });
        });

    }

    handleUpload = ( files) => {
        files.forEach(file => {
           const data = new FormData();

           const box = this.props.match.params.id;

           data.append('file', file);
           
           api.post(`boxes/${box}/files`, data);

        

        });

    }

  render() {
    return(
        <div id="box-container">
            <header>
                <img src={logo} alt="logo"  />
                <h1> {this.state.box.title} </h1>
            </header>

            <Dropzone onDropAccepted={this.handleUpload}>
                {({ getInputProps, getRootProps})=>(
                        <div className="upload" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p> Arraste arquivos ou clique aqui </p>
                        </div>
                )}
            </Dropzone>

            <ul>
                { this.state.box.files && 
                  this.state.box.files.map( file => (
                     <li key={file._id}>
                        <a className="fileInfo" href={file.url} target="_blank"  rel="noopener noreferrer">
                            <MdInsertDriveFile size={24} color="#a5cfff" />
                            <strong> { file.title} </strong>
                        </a>

                       <span>
                            há {""}
                            { distanceInWords(file.createdAt, new Date(),{
                                locale: pt
                            }) }
                       </span>
                    </li>
                ))}
               
            </ul>
        </div>
    );
  }
}