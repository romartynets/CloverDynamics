import { TextField, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Filters = ({ filtersState, handleRoverChange, handleCameraChange, handleMarsDayChange, handleButtonClick,
  rovers }) => {
  const { selectedRover, selectedCamera, marsDay } = filtersState;
  return (
    <div className="inputs">
      <div className="inputs__item">
        <TextField select fullWidth helperText='Please select a rover' value={selectedRover} onChange={(e) => handleRoverChange(e.target.value)} >
          {rovers.map((rover, i) =>
            <MenuItem value={rover.name} key={i} >{rover.name} </MenuItem>
          )}
        </TextField>
      </div>
      <div className="inputs__item">
        <TextField select  helperText='Please select a camera' value={selectedCamera} onChange={(e) => handleCameraChange(e.target.value)}>
          {rovers.filter((rover) => rover.name === selectedRover)[0].cameras.map((camera, i) =>
            <MenuItem value={camera.abbreviation} key={i}>{camera.name}</MenuItem>
          )}
        </TextField>
      </div>
      <div className="inputs__item">
        <TextField  value={marsDay} helperText='Please select a Sol(Mars day)' onChange={(e) => handleMarsDayChange(e.target.value)} >
        </TextField>
      </div>
      <div className="inputs__item">
        <Button variant="outlined" onClick={handleButtonClick} startIcon={<SearchIcon />}>Search</Button>
      </div>
    </div>)
}







