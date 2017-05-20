SELECT * FROM (
SELECT *, Bed.id AS bedID 
FROM PlotCrop 
JOIN Crop ON PlotCrop.crop = Crop.id 
JOIN Bed ON PlotCrop.bed = bedID 
WHERE Bed.owner = 1
) d 
JOIN (
   SELECT b.id AS bedID, (SELECT COUNT(*) 
   FROM Bed a WHERE a.owner = 1
   AND a.id>=b.id) AS bedIndex
FROM Bed b
WHERE b.owner = 1
) c 
ON d.bedID = c.bedID; 
