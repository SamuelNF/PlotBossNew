DROP TABLE IF EXISTS Plants;
DROP TABLE IF EXISTS PlotCrop;
DROP TABLE IF EXISTS Bed;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS Harvested;
DROP TABLE IF EXISTS Pruned;
DROP TABLE IF EXISTS Planted;
DROP TABLE IF EXISTS Crop;
DROP TABLE IF EXISTS Month;

CREATE TABLE Month (
   id INTEGER PRIMARY KEY,
   name VARCHAR(100) NOT NULL
);

INSERT INTO Month (name) VALUES ('January');
INSERT INTO Month (name) VALUES ('February');
INSERT INTO Month (name) VALUES ('March');
INSERT INTO Month (name) VALUES ('April');
INSERT INTO Month (name) VALUES ('May');
INSERT INTO Month (name) VALUES ('June');
INSERT INTO Month (name) VALUES ('July');
INSERT INTO Month (name) VALUES ('August');
INSERT INTO Month (name) VALUES ('September');
INSERT INTO Month (name) VALUES ('October');
INSERT INTO Month (name) VALUES ('November');
INSERT INTO Month (name) VALUES ('December');

CREATE TABLE Crop (
   id INTEGER PRIMARY KEY,
   name VARCHAR(100) NOT NULL UNIQUE,
   location VARCHAR(100),
   planting VARCHAR(100),
   harvesting VARCHAR(100),
   pruning VARCHAR(100),
   colour VARCHAR(100)
);

INSERT INTO Crop (name, location, planting, harvesting, colour) VALUES (
   'Sweet Potatoes',
   'A spacious, warm, well-drained site with rich, fertile soil of pH 5.5-6.5',
   '5-8cm deep, 35-30cm apart',
   'Tubers should be ready in September, though a warm summer is needed for a good crop. If you want to store them, dry them out in the sun first. Finish lifting before the first frosts.',
   '#c0410a'
);
INSERT INTO Crop (name, location, planting, harvesting, colour) VALUES (
   'Beetroot',
   'Any sunny position with reasonably good soil of pH 6.5-7',
   '2.5cm deep, 10cm apart',
   'Pull beetroot from here and there along the length of your rows in order to give those that remain room to grow - do not let them get too large.',
   '#2c0316'
);
INSERT INTO Crop (name, location, planting, harvesting, colour) VALUES (
   'Trench Celery',
   'Celery needs rich, fertile, moisture-retentive soil with a slightly acid pH of around 6.7',
   'Plant 30-45cm apart, with each row 30cm apart',
   'Trench celery is harvested later in the year - be sure to protect it from frosts.',
   '#34f44b'
); 
INSERT INTO Crop (name, location, planting, harvesting, colour) VALUES (
   'Self-blanching Celery',
   'Celery needs rich, fertile, moisture-retentive soil with a slightly acid pH of around 6.7',
   'Plant 25cm apart in blocks',
   'Harvest in midsummer, and give it a good watering before picking to keep it crisp and fresh once picked.',
   '#9feea8'
);
INSERT INTO Crop (name, location, planting, harvesting, colour) VALUES (
   'Carrots',
   'Carrots like an open, dry site and light, fertile soil with a pH of 6.5-7.5. Dig in some manure or compost and sure the ground is free of stones and not compacted - otherwise the roots tend to fork. For this reason, raised beds are ideal.',
   'Sow 1-2cm deep, 2.5cm apart, thinning out to 10cm apart. Space rows 30cm apart',
   'Some early varieties may be ready within just seven weeks of sowing. Maincrops may take 10-11 weeks. If the soil is dry and compacted, use a fork to loosen the roots before pulling them out.',
   '#ff9107'
); 

CREATE TABLE Planted (
   id INTEGER PRIMARY KEY,
   crop INTEGER NOT NULL,
   month INTEGER NOT NULL,
   FOREIGN KEY (crop) REFERENCES Crop(id),
   FOREIGN KEY (month) REFERENCES Month(id) 
);

INSERT INTO Planted (crop, month) VALUES (1,5);
INSERT INTO Planted (crop, month) VALUES (1,6);
INSERT INTO Planted (crop, month) VALUES (2,5);
INSERT INTO Planted (crop, month) VALUES (2,6);
INSERT INTO Planted (crop, month) VALUES (2,7);
INSERT INTO Planted (crop, month) VALUES (3,5);
INSERT INTO Planted (crop, month) VALUES (3,6);
INSERT INTO Planted (crop, month) VALUES (4,5);
INSERT INTO Planted (crop, month) VALUES (4,6);
INSERT INTO Planted (crop, month) VALUES (5,4);
INSERT INTO Planted (crop, month) VALUES (5,5);
INSERT INTO Planted (crop, month) VALUES (5,6);
INSERT INTO Planted (crop, month) VALUES (5,7);
INSERT INTO Planted (crop, month) VALUES (5,8);

CREATE TABLE Harvested (
   id INTEGER PRIMARY KEY,
   crop INTEGER NOT NULL,
   month INTEGER NOT NULL,
   FOREIGN KEY (crop) REFERENCES Crop(id),
   FOREIGN KEY (month) REFERENCES Month(id) 
);

INSERT INTO Harvested (crop, month) VALUES (1,9);
INSERT INTO Harvested (crop, month) VALUES (1,10);
INSERT INTO Harvested (crop, month) VALUES (2,6);
INSERT INTO Harvested (crop, month) VALUES (2,7);
INSERT INTO Harvested (crop, month) VALUES (2,8);
INSERT INTO Harvested (crop, month) VALUES (2,9);
INSERT INTO Harvested (crop, month) VALUES (2,10);
INSERT INTO Harvested (crop, month) VALUES (3,11);
INSERT INTO Harvested (crop, month) VALUES (3,12);
INSERT INTO Harvested (crop, month) VALUES (4,7);
INSERT INTO Harvested (crop, month) VALUES (4,8);
INSERT INTO Harvested (crop, month) VALUES (4,9);
INSERT INTO Harvested (crop, month) VALUES (4,10);
INSERT INTO Harvested (crop, month) VALUES (5,6);
INSERT INTO Harvested (crop, month) VALUES (5,7);
INSERT INTO Harvested (crop, month) VALUES (5,8);
INSERT INTO Harvested (crop, month) VALUES (5,9);
INSERT INTO Harvested (crop, month) VALUES (5,10);
INSERT INTO Harvested (crop, month) VALUES (5,11);
INSERT INTO Harvested (crop, month) VALUES (5,12);

CREATE TABLE Pruned (
   id INTEGER PRIMARY KEY,
   crop INTEGER NOT NULL,
   month INTEGER NOT NULL,
   FOREIGN KEY (crop) REFERENCES Crop(id),
   FOREIGN KEY (month) REFERENCES Month(id) 
);

CREATE TABLE Person (
   id INTEGER PRIMARY KEY,
   username VARCHAR(100) NOT NULL,
   password VARCHAR(100) NOT NULL
);

INSERT INTO Person (username, password) VALUES ('Sam','harambe');
INSERT INTO Person (username, password) VALUES ('Jess','frisbee');

CREATE TABLE Bed (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   owner INTEGER NOT NULL,
   name VARCHAR(100) NOT NULL,
   FOREIGN KEY (owner) REFERENCES person(id)
);

INSERT INTO Bed (owner, name) VALUES (1,'Poly-tunnel');
INSERT INTO Bed (owner, name) VALUES (1,'South Raised Bed');
INSERT INTO Bed (owner, name) VALUES (1,'North Raised Bed');
INSERT INTO Bed (owner, name) VALUES (2,'Vegetable patch');
INSERT INTO Bed (owner, name) VALUES (2,'Fruit patch');

CREATE TABLE PlotCrop (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   bed INTEGER NOT NULL,
   crop INTEGER NOT NULL,
   plant INTEGER NOT NULL,
   harvest INTEGER NOT NULL,
   FOREIGN KEY (bed) REFERENCES Bed(id),
   FOREIGN KEY (crop) REFERENCES Crop(id)
);

INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (1,1,6,9);
INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (3,2,5,10);
INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (2,3,6,11);
INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (4,4,6,9);
INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (4,5,1,4);
INSERT INTO PlotCrop (bed, crop, plant, harvest) VALUES (5,5,7,9);
