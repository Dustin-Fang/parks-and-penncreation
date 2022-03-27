CREATE TABLE Species (
    SpeciesId           varchar(9),
    CommonName          varchar(20),
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

CREATE TABLE Parks (
    Code        varchar(4),
    Name        varchar(64),
    Acres       int,
    Latitude    decimal(2, 2),
    Longitude   decimal(3, 2),
    Zipcode     int,
    PRIMARY KEY (Code)
);

CREATE TABLE LivesIn (
    SpeciesId   varchar(9),
    ParkCode    varchar(4),
    FOREIGN KEY (SpeciesId) REFERENCES Species(SpeciesId),
    FOREIGN KEY (ParkCode) REFERENCES Parks(Code)
);

CREATE TABLE WeatherEvents (
    EventId         varchar(9),
    ParkCode        varchar(4),
    Severity        varchar(10),
    Precipitation   decimal(2, 2),
    Latitude        decimal(2, 4),
    Longitude       decimal(3, 4),
    Type            varchar(8),
    State           varchar(2),
    Zipcode         int,
    StartTime       datetime,
    EndTime         datetime,
    PRIMARY KEY (EventId),
    FOREIGN KEY (ParkCode) REFERENCES Parks(Code)
);
