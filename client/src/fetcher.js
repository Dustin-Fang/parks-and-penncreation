import config from './config.json'

export const getPark = async (id) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/parks?id=${id}`, {
    method: 'GET',
})
return res.json()
}

export const getParksSearch = async (parkName, zipcode, state, page, pagesize) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/parks?parkName=${parkName}&zipcode=${zipcode}&state=${state}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
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
  await fetch(`http://${config.server_host}:${config.server_port}/species/parks/${pageNum}?scientificName=${scientificName}` , {
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
  await fetch(`http://${config.server_host}:${config.server_port}/parks/recommend` , {
        method: "POST",
        body: inputJSON,
        headers: {
          "Content-Type": "application/json",
        },
    });
    // console.log(response.json())
    return response.json();
}