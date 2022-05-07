import config from './config.json'

export const getPark = async () => {
   return;
}

export const getParksSearch = async () => {
  return;
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