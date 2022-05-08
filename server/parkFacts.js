const allStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

// placeholder
function randomStateGenerator() {
  const idx = Math.floor(Math.random() * 50);
  return allStates[idx];
}

const state = randomStateGenerator();

const parkFunFacts = [
  {
    query:
      `WITH mostPop AS (
      SELECT ParkId, SpeciesId, ScientificName, COUNT(DISTINCT SpeciesId) as ct
      FROM Species
      GROUP BY ParkId
      ORDER BY ct DESC
      LIMIT 1)
    Select ParkName
    FROM Parks
    WHERE ParkId IN (SELECT ParkId from mostPop);`,
    prompt: 'This park has the largest number of different species!'
  },
  {
    query:
      `With mostEndangered AS (
      SELECT SpeciesId, Nativeness, ConservationStatus, Abundance, S.ParkId, COUNT(SpeciesId) as tot, P.ParkName
      FROM Parks P JOIN Species S ON P.ParkId = S.ParkId
      GROUP BY ParkId
      HAVING ConservationStatus IN ('Endangered', 'Threatened', 'Species of Concern')
      ORDER BY tot DESC
      LIMIT 1
  )
  SELECT S.ParkId AS ParkId, ParkName, Abundance, (SELECT COUNT(SpeciesId) WHERE Nativeness='Native') / COUNT(SpeciesId) AS NotNative,
              (SELECT COUNT(SpeciesId) WHERE Abundance IN ('Uncommon', 'Rare', 'Occasional')) / COUNT(SpeciesId) as Common
  FROM Parks P JOIN Species S ON P.ParkId = S.ParkId
  GROUP BY ParkId
  HAVING ParkId IN (Select ParkId from mostEndangered);`,
    // will have to streamline how we show the facts on the ui but this works for now
    prompt: 'This park has the highest number of endangered/threatened species! what percentage of\
     This % of animals are native to the area. This what % percentage is not common nor abundant in the park'
  },
  {
    query:
      `  With StateParks AS (
      SELECT DISTINCT ParkId, ParkName
      FROM Parks P, WeatherEvents W
      WHERE ABS(W.Latitude - P.Latitude) <= 1.0 AND ABS(W.Longitude - P.Longitude) <= 1.0 AND W.WeatherState = '${state}'
  )
  SELECT ParkName, ConservationStatus,
         (SELECT COUNT(SpeciesId)
         WHERE ConservationStatus IN ('Endangered', 'Threatened', 'Species of Concern')) as Status
  FROM Species s JOIN StateParks p on s.ParkId=p.ParkId
  GROUP BY ParkName
  HAVING ConservationStatus IS NOT NULL
  ORDER BY Status DESC
  LIMIT 1;`,
    prompt: 'This park has the highest number of endangered/threatened species in <state>'
  }
]


module.exports = {
  parkFunFacts,
};