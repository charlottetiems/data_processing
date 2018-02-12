#!/usr/bin/env python
# Name: Charlotte Tiems 
# Student number: 10774971
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    #list_elements that contains tv title, rating, genres, actors, runtime  
    list_elements = []

    #find all tvshows in div lister-item-content
    tvshows = dom.find_all("div", "lister-item-content")

    #iterate over every tvshow in tvshows
    for tvshow in tvshows:

        #temp_list to store each element of tvshow in
        temp_list = []

        #find title in "a" and append to the temp_list
        title = tvshow.find("a").get_text()
        temp_list.append(title)

        #find rating in "strong" and append to temp_list 
        rating = tvshow.find("strong").get_text()
        temp_list.append(rating)

        #find genre in class_ = "genre" and append to list 
        genre = tvshow.find(class_ ="genre").get_text().strip()
        temp_list.append(genre)

        #make list to store actors in (because multiple actors per serie)
        actor_list = []

        #get all actors/actress in second "p" lines "a"
        actors = tvshow.find_all("p")[2].find_all("a")

        #iterate over every actor in actors and append to list 
        for actor in actors:
            actor_add = actor.get_text()
            actor_list.append(actor_add)
        temp_list.append(actor_list)

        #get the runtime from class "runtime" and strip the word 'min'
        runtime = tvshow.find(class_ = "runtime").get_text().strip(" min")
        temp_list.append(runtime)

        #append all elements in temp_list to the list_elements (total list)
        list_elements.append(temp_list)

    return list_elements   


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
    for element in tvseries:
        writer.writerow(element)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)