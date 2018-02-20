import csv 
import json

csvfile = open('motorrijbewijs.csv', 'rU')
jsonfile = open('motorrijbewijs.json', 'w')

fieldnames = ("Jaar","Waarde")
reader = csv.DictReader( csvfile, fieldnames)
out = json.dumps( [ row for row in reader ] )
jsonfile.write(out)

# close both files
csvfile.close()
jsonfile.close()
