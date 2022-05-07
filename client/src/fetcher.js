import config from './config.json'

export const getPark = async (parkId) => {
  const responseBody = {
    ParkId: parkId
  };
  const inputJSON = JSON.stringify(responseBody);
  
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks`, {
      method: "POST",
      body: inputJSON,
      headers: {
        "Content-Type": "application/json",
      },
    });
  //console.log(response.json())
  return response.json();
}

export const getParksSearch = async (parkName, zipcode, state, page, pagesize) => {
  const responseBody = {
    ParkName: parkName,
    Zipcode: zipcode,
    State: state,
    page: page,
    pagesize: pagesize
  };
  const inputJSON = JSON.stringify(responseBody);

  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks`, {
      method: "POST",
      body: inputJSON,
      headers: {
        "Content-Type": "application/json",
      },
    });
  // console.log(response.json())
  return response.json();
}

export const getParksFunFact = async (id) => {
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/funfact/${id}`, {
      method: 'GET',
    });
  // console.log(response.json())
  return response.json();
}









/**** Shanna's functions below (will remove this comment on final push) *****/


export const getRandomAnimal = async () => {
  const response = await fetch(`http://${config.server_host}:${config.server_port}/species`, {
    method: 'GET',
  });
  // console.log(response.json())
  return response.json();
}

export const getParksBySpecies = async (pageNum, scientificName) => {
  scientificName.replace(" ", "+");
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species/parks/${pageNum}?scientificName=${scientificName}`, {
      method: 'GET',
    });
  // console.log(response.json())
  return response.json();
}

export const recommendPark = async (undesir, desir) => {
  const userWants = {
    desirableEvents: desir,
    undesirableEvents: undesir,
  };
  const inputJSON = JSON.stringify(userWants);

  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/recommend`, {
      method: "POST",
      body: inputJSON,
      headers: {
        "Content-Type": "application/json",
      },
    });
  // console.log(response.json())
  return response.json();
}