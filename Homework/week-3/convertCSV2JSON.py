# Name: Charlotte Tiems 
# Studentnumber: 10774971
# Converts CSV to JSON


import csv 
import json

csvfile = open('temperaturen.csv', 'rU')
jsonfile = open('temperaturen.json', 'w')

fieldnames = ("Month","Temperatuur")
reader = csv.DictReader( csvfile, fieldnames)
out = json.dumps( [ row for row in reader ] )
jsonfile.write(out)

# close both files
csvfile.close()
jsonfile.close()
