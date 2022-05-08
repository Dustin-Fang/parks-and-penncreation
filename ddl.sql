-- Parks tables --
CREATE TABLE Parks (
    ParkId      int,
    ParkCode    varchar(4),
    ParkName    varchar(64),
    Acres       int,
    Latitude    decimal(5, 2),
    Longitude   decimal(5, 2),
    ImageURL    varchar(500),
    State       varchar(10),
    PRIMARY KEY (ParkId)
);

CREATE TABLE Zipcode (
    Zipcode int,
    ParkId  int,
    PRIMARY KEY (Zipcode),
    FOREIGN KEY (ParkId) REFERENCES Parks (ParkId)
);

-- Species tables --
CREATE TABLE Species (
    SpeciesId           varchar(9),
    Category            varchar(16),
    SpeciesOrder        varchar(16),
    Family              varchar(16),
    ScientificName      varchar(64),
    RecordStatus        varchar(64),
    Occurrence          varchar(64),
    Nativeness          varchar(64),
    Abundance           varchar(64),
    Seasonality         varchar(64),
    ConservationStatus  varchar(64),
    ParkId              int,
    ParkCode            varchar(4),
    PRIMARY KEY (SpeciesId, ScientificName),
    FOREIGN KEY (ParkId) REFERENCES Parks(ParkId)
);

CREATE TABLE CommonNames (
    nameId              int
    CommonName          varchar(64),
    SpeciesId           varchar(9),
    PRIMARY KEY (nameId),
    FOREIGN KEY (SpeciesId) REFERENCES Species(SpeciesId)
);

-- Weather Table --
CREATE TABLE WeatherEvents (
    EventId         varchar(9),
    WeatherType     varchar(8),
    Severity        varchar(10),
    StartTime       datetime,
    EndTime         datetime,
    Precipitation   decimal(5, 2),
    Latitude        decimal(7, 4),
    Longitude       decimal(7, 4),
    WeatherState    varchar(2),
    Zipcode         int,
    Duration        varchar(32),
    DurationInMinutes        int,
    PRIMARY KEY (EventId, Latitude, Longitude)
);
