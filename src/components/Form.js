import { useState } from "react";
import Papa from 'papaparse';
import { FormControl, FormLabel, FormGroup, FormControlLabel, TextField, Checkbox, Input } from "@mui/material";
import { Button, Container, LinearProgress } from "@mui/material";

function Form() {
  const [key, setKey] = useState("");
  const [model, setModel] = useState({"gpt-3.5-turbo": false, "gpt-4": false});
  const [shot, setShot] = useState({"zero": false, "few": false});
  const [feature, setFeature] = useState({
    "Limits": false, 
    "Change": false, 
    "Perspective": false, 
    "Compromise": false, 
    "Resolution": false
  });
  const [csv, setCsv] = useState();
  const [column, setColumn] = useState("");
  const [data, setData] = useState();

  // event handlers
  const handleKeyChange = (event) => {
    setKey(event.target.value);
  }

  const handleColumnChange = (event) => {
    setColumn(event.target.value);
  }

  const handleModelChange = (event) => {
    setModel({...model, [event.target.name]: event.target.checked});
  }

  const handleShotChange = (event) => {
    setShot({...shot, [event.target.name]: event.target.checked});
  }

  const handleFeatureChange = (event) => {
    setFeature({...feature, [event.target.name]: event.target.checked});
  }

  const handleCsvChange = (event) => {
    setCsv(event.target.files[0]);
  }

  const handleSubmit = async () => {
    // the parsed csv is an array of objects
    const d = await parseCsv();
    console.log(d);                 // Validate: column should be in the csv!
  }

  // parse csv
  const parseCsv = () => {
    return new Promise((resolve, reject) => {
      if (csv) {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const text = e.target.result;
          
          // parse the csv
          Papa.parse(text, {
            complete: (result) => {
              setData(result.data);
              resolve(result.data);
            },
            header: true,
            error: (error) => {
              console.error("Error when parsing CSV: ", error);
            }
  
          });
        }
  
        reader.readAsText(csv);
      } else {
        reject("No CSV file provided");
      }
    })
  }

  // query openai

  return (
    <Container component="form" maxWidth="md" sx={{marginBottom: "50px"}}>
      <h1>gpt-annotation</h1>
      <FormControl fullWidth margin="normal">
        <TextField required label="OpenAI API key" onChange={handleKeyChange} value={key}/>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">Model</FormLabel>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={model["gpt-3.5-turbo"]} name="gpt-3.5-turbo" onChange={handleModelChange} />} label="gpt-3.5-turbo" />
          <FormControlLabel control={<Checkbox checked={model["gpt-4"]} name="gpt-4" onChange={handleModelChange} />} label="gpt-4" />
        </FormGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">Zero-shot/Few-shot</FormLabel>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={shot["zero"]} name="zero" onChange={handleShotChange} />} label="Zero-shot" />
          <FormControlLabel control={<Checkbox checked={shot["few"]} name="few" onChange={handleShotChange} />} label="Few-shot" />
        </FormGroup>
      </FormControl>

      <FormControl margin="normal">
        <FormLabel component="legend">Features</FormLabel>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={feature["Limits"]} name="Limits" onChange={handleFeatureChange} />} label="Limits" />
          <FormControlLabel control={<Checkbox checked={feature["Change"]} name="Change" onChange={handleFeatureChange} />} label="Change" />
          <FormControlLabel control={<Checkbox checked={feature["Perspective"]} name="Perspective" onChange={handleFeatureChange} />} label="Perspective" />
          <FormControlLabel control={<Checkbox checked={feature["Compromise"]} name="Compromise" onChange={handleFeatureChange} />} label="Compromise" />
          <FormControlLabel control={<Checkbox checked={feature["Resolution"]} name="Resolution" onChange={handleFeatureChange} />} label="Resolution" />
        </FormGroup>
      </FormControl>

      <FormControl margin="normal" fullWidth>
        <FormLabel component="legend">CSV file</FormLabel>
        <Input type="file" inputProps={{accept: ".csv"}} onChange={handleCsvChange} />
        <TextField required label="Column name" variant="standard" value={column} onChange={handleColumnChange} />
      </FormControl>

      <Button 
        variant="contained" 
        sx={{marginTop: "10px", marginBottom: "10px"}} 
        onClick={handleSubmit}
        disabled={
          !key || 
          (!model["gpt-3.5-turbo"] && !model["gpt-4"]) || 
          (!shot["few"] && !shot["zero"]) || 
          (!feature["Change"] && !feature["Limits"] && !feature["Compromise"] && !feature["Perspective"] && !feature["Resolution"]) || 
          !csv || 
          !column
        }
      >
        Send Request
      </Button>

      <LinearProgress /> 
    </Container>
  );
}

export default Form;