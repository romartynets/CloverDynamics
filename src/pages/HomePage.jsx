import { Button, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Filters } from '../components/Filters/Filters';

export const HomePage = () => {
  const rovers = [{
    name: 'Curiosity', cameras: [{ abbreviation: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { abbreviation: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { abbreviation: 'MAST', name: 'Mast Camera' },
    { abbreviation: 'CHEMCAM', name: 'Chemistry and Camera Complex' },
    { abbreviation: 'MAHLI', name: 'Mars Hand Lens Imager' },
    { abbreviation: 'MARDI', name: 'Mars Descent Imager' },
    { abbreviation: 'NAVCAM', name: 'Navigation Camera' }]
  },
  {
    name: 'Opportunity', cameras: [{ abbreviation: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { abbreviation: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { abbreviation: 'NAVCAM', name: 'Navigation Camera' },
    { abbreviation: 'PANCAM', name: 'Panoramic Camera' },
    { abbreviation: 'MINITES', name: 'Miniature Thermal Emission Spectrometer (Mini-TES)' }]
  },
  {
    name: 'Spirit', cameras: [{ abbreviation: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { abbreviation: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { abbreviation: 'NAVCAM', name: 'Navigation Camera' },
    { abbreviation: 'PANCAM', name: 'Panoramic Camera' },
    { abbreviation: 'MINITES', name: 'Miniature Thermal Emission Spectrometer (Mini-TES)' }]
  }];

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const startPage = 1;
  const [filters, setFilters] = useState({
    selectedRover: rovers[0].name,
    selectedCamera: '',
    marsDay: 0,
  });
  const { marsDay, selectedCamera, selectedRover } = filters;
  const [errorMessage, setErrorMessage] = useState('');
  const [isNoResults, setIsNoResults] = useState(false);
  const notInitialRender = useRef(false);


  const handleRoverChange = (roverName) => {
    setFilters({
      ...filters,
      selectedRover: roverName
    })
  }
  const handleCameraChange = (cameraAbbreviation) => {
    setFilters({
      ...filters,
      selectedCamera: cameraAbbreviation
    })
  }
  const handleMarsDayChange = (sol) => {
    setFilters({
      ...filters,
      marsDay: +sol
    })
  }
  const handleButtonClick = async () => {
    resetPage();
    await getPhotos()
  }
  const changePage = () => {
    setCurrentPage(currentPage + 1);
  }
  const resetPage = () => {
    setCurrentPage(1);
  }
  const handleButtonLoadMoreClick = () => {
    changePage();
    //  await getPhotos(false);
  }

  const getPhotos = async (isNewSearch = true) => {
    const params = {
      sol: marsDay,
      camera: selectedCamera.toLowerCase(),
      page: isNewSearch ? startPage : currentPage,
      api_key: 'qzxfakFsjLzYfYueDzX1dULbUrzyGdfO2WrFAe9E'
      // api_key: 'DEMO_KEY'
    };
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover.toLowerCase()}/photos`, { params });
      isNewSearch ? setData(response.data.photos) : setData([...data, ...response.data.photos]);
      errorMessage && setErrorMessage('');
    } catch (e) {
      setIsLoading(false)
      setErrorMessage('Something went wrong, please try again');
      return
    } finally {
      console.log(data);
      // !data.length ? setIsNoResults(true) : setIsNoResults(false);
      !data.length && setIsNoResults(true);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentPage !== startPage) {
      (async () => await getPhotos(false))();
    }
  }, [currentPage]);

  useEffect(() => {
    if (!data.length && notInitialRender.current) {
      setIsNoResults(true);
    } else if (data.length) {
      setIsNoResults(false)
    } else {
      notInitialRender.current = true
    }
  }, [data])

  return (
    <div>
      <Filters
        filtersState={filters}
        handleRoverChange={handleRoverChange}
        handleCameraChange={handleCameraChange}
        handleMarsDayChange={handleMarsDayChange}
        handleButtonClick={handleButtonClick}
        rovers={rovers}
      />
      {isLoading && <div className="loader"><CircularProgress /></div>}
      {/* {!data.length && !isLoading && <div>No data</div>} */}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      {isNoResults && <div className="errorMessage">Your search was unsuccessful. Try again with different options.</div>}
      {data.length !== 0 && <div className="content"> <div className="photos">
        {data.map((el, i) => (
          <div className="photos__wrapper">
            <div
              className="photos__item"
              key={i}
              style={{ backgroundImage: `url(${el.img_src})` }}
            >
            </div>
          </div>
        ))}
      </div></div>}
      {data.length !== 0 && <div className="btnLoadMore">
        <Button variant="outlined" onClick={handleButtonLoadMoreClick} startIcon={<ArrowDownwardIcon />}>Load More</Button>
      </div>}
    </div>)

}
