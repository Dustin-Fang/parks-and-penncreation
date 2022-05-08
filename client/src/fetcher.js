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
  return response.json();
}

export const getParksFunFact = async (id) => {
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/funfact/${id}`, {
      method: 'GET',
    });
  console.log(id);
  return response.json();
}

export const getSpeciesByPark = async (pageNumber, ParkId) => {
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/species/${pageNumber}?ParkId=${ParkId}`, {
      method: 'GET',
    });
  return response.json();
}

export const getMostWeatherSpecies = async (pageNumber, weatherType) => {
  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/mostWeatherSpecies/${pageNumber}?weatherType=${weatherType}`, {
      method: 'GET',
    });
  return response.json();
}

export const postParksWeatherSearch = async (zipcode, startMonth, endMonth) => {
  const responseBody = {
    zipcode: zipcode,
    startMonth: startMonth,
    endMonth: endMonth
  };
  const inputJSON = JSON.stringify(responseBody);

  const response =
    await fetch(`http://${config.server_host}:${config.server_port}/parks/weatherByRange`, {
      method: "POST",
      body: inputJSON,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export const getParksBySpecies = async (input) => {
  if (input.scientificName) {
    input.scientificName.replace(" ", "+");
    const response =
      await fetch(`http://${config.server_host}:${config.server_port}/species/parks/${input.pageNum}?scientificName=${input.scientificName}`, {
        method: 'GET',
      });
    // console.log(response.json())
    return response.json();
    } else if (input.commonName) {
      input.commonName.replace(" ", "+");
      const response =
        await fetch(`http://${config.server_host}:${config.server_port}/species/parks/${input.pageNum}?commonName=${input.commonName}`, {
          method: 'GET',
        });
      // console.log(response.json())
      return response.json();
    }
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

export const getSpecies = async (input) => {
  if (input.commonName) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species?commonName=${input.commonName}`, {
      method: 'GET',
    });
  return response.json();

  } else if (input.scientificName) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species?scientificName=${input.scientificName}`, {
      method: 'GET',
    });
    return response.json();

  } else if (input.zip) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species?zipcode=${input.zip}`, {
      method: 'GET',
    });
    return response.json();

  } else if (input.state) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species?state=${input.state}`, {
      method: 'GET',
    });
    return response.json();
  }
}

export const getSpeciesWeather = async (input) => {
  if (input.commonName) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species/weather?commonName=${input.commonName}`, {
      method: 'GET',
    });
  return response.json();

  } else if (input.scientificName) {
    const response =
    await fetch(`http://${config.server_host}:${config.server_port}/species/weather?scientificName=${input.scientificName}`, {
      method: 'GET',
    });
    return response.json();
  } 
}

export const getSpeciesData = async (zipcode, category) => {
  const inpts = {
    speciesCategory: category,
    zipcode: zipcode,
  };
  const inputJSON = JSON.stringify(inpts);
  
  const response =
  await fetch(`http://${config.server_host}:${config.server_port}/species/data`, {
    method: 'POST',
    body: inputJSON,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
  } 