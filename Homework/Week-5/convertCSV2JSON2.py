# Name: Charlotte Tiems 
# Studentnumber: 10774971
# Converts CSV to JSON


import csv 
import json

csvfile = open('KNMI2010.csv', 'r')
jsonfile = open('KNMI2010.json', 'w')

fieldnames = ("Datum:","Gem:", "Min:", "Max:")
reader = csv.DictReader( csvfile, fieldnames)
out = json.dumps( [ row for row in reader ] )
jsonfile.write(out)

# close both files
csvfile.close()
jsonfile.close()
