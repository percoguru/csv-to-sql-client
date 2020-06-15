import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded:0
      }
   
  }
  checkMimeType=(event)=>{
    let files = event.target.files 
    let err = []
   const types = ['text/csv']
    for(var x = 0; x<files.length; x++) {
         if (types.every(type => files[x].type !== type)) {
         err[x] = files[x].type+' is not a supported format\n';
     };
     for(var z = 0; z<err.length; z++) {
        toast.error(err[z])
        event.target.value = null
    }
   return true;
  }
}
maxSelectFile=(event)=>{
  let files = event.target.files
      if (files.length > 3) { 
          const msg = 'Select only 1 .csv file'
          event.target.value = null
          toast.warn(msg)
          return false;
    }
  return true;
}
checkFileSize=(event)=>{
  let files = event.target.files
  let size = 20000000000 
  let err = []; 
  for(var x = 0; x<files.length; x++) {
  if (files[x].size > size) {
      err[x] = files[x].type+'is too large, please pick a smaller file\n';
    }
  };
  for(var z = 0; z<err.length; z++) {
    toast.error(err[z])
    event.target.value = null
  }
return true;
}

onChangeHandler=event=>{
  var files = event.target.files
  if(this.maxSelectFile(event) && this.checkMimeType(event) &&    this.checkFileSize(event)){ 
     this.setState({
     selectedFile: files,
     loaded:0
  })
}
}

onClickHandler = async () => {
  const data = new FormData() 

  console.log(this.state.selectedFile);

  for(var x = 0; x<this.state.selectedFile.length; x++) {
    data.append('file', this.state.selectedFile[x])
    console.log(this.state.selectedFile[x])
  }
  await axios.post("http://localhost:9000/upload", data, {
    onUploadProgress: ProgressEvent => {
      this.setState({
        loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
      })
    },
  })
    .then(res => { 
      toast.success('upload success')
    })
    .catch(err => {
      toast.error('upload fail')
    })

  await axios.post("http://localhost:9000/createTable", {filename: this.state.selectedFile[0].name})
  .then(res => console.log(res))
  .catch(err => console.log(err))

  await axios.post("http://localhost:9000/bulkCreate", {filename: this.state.selectedFile[0].name})
  .then(res => console.log(res))
  .catch(err => console.log(err))
}

  render() {
    return (
      <div class="container">
	      <div class="row">
      	  <div class="offset-md-3 col-md-6">
               <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" accept=".csv" class="form-control" multiple onChange={this.onChangeHandler}/>
              </div>  
              <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
        
              </div> 
              
              <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>

	      </div>
      </div>
      </div>
    );
}
}

export default App;