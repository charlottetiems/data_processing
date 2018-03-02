# Name: Charlotte Tiems 
# Studentnumber: 10774971
# Converts CSV to JSON


import csv 
import json

csvfile = open('scatterplot.csv', 'r')
jsonfile = open('scatterplot.json', 'w')

fieldnames = ("Country","Average_life_expectancy", "Happy_life_year", "HPI", "Population")
reader = csv.DictReader( csvfile, fieldnames, delimiter='\t')
out = json.dumps( [ row for row in reader ] )
jsonfile.write(out)

# close both files
csvfile.close()
jsonfile.close()
