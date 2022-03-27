CREATE TABLE Species (
    SpeciesId           varchar(9),
    SpeciesOrder        varchar(16),
    Family              varchar(16),
    ScientificName      varchar(64),
    ConservationStatus  varchar(20),
    Abundance           varchar(10),
    Category            varchar(16),
    Seasonality         varchar(16),
    Nativeness          varchar(10),
    PRIMARY KEY (SpeciesId)
);

CREATE TABLE CommonNames (
    CommonName          varchar(20),
    SpeciesId           varchar(9),
    PRIMARY KEY (CommonName),
    FOREIGN KEY (SpeciesId) REFERENCES Species(SpeciesId)
);

CREATE TABLE Parks (
    ParkId      int,
    ParkCode    varchar(4),
    ParkName    varchar(64),
    Acres       int,
    Latitude    decimal(5, 2),
    Longitude   decimal(5, 2),
    PRIMARY KEY (ParkId)
);

CREATE TABLE Zipcode {
    Zipcode     int,
    ParkId      int,
    PRIMARY KEY (Zipcode),
    FOREIGN KEY (ParkId) REFERENCES Parks(ParkId)
}

CREATE TABLE FoundIn (
    SpeciesId   varchar(9),
    ParkId      int,
    FOREIGN KEY (SpeciesId) REFERENCES Species(SpeciesId),
    FOREIGN KEY (ParkId) REFERENCES Parks(ParkId)
);

CREATE TABLE WeatherEvents (
    EventId         varchar(9),
    ParkID          int,
    Severity        varchar(10),
    Precipitation   decimal(5, 2),
    Latitude        decimal(7, 4),
    Longitude       decimal(7, 4),
    Type            varchar(8),
    State           varchar(2),
    Zipcode         int,
    StartTime       datetime,
    EndTime         datetime,
    PRIMARY KEY (EventId),
    FOREIGN KEY (ParkID) REFERENCES Parks(ParkID)
);
