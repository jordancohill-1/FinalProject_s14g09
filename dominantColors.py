###########
# OPTIONS #
###########

# Phillip's Machine
#source = "results_small/*.jpg"
#destination = "test.csv"

# Jordan's Machine
source = "/Users/jordancohill/Desktop/Quant/results/*.jpg"
destination = "/Users/jordancohill/Desktop/WebApps/final/dominantColors.csv"

################################################################################

from sklearn.cluster import MiniBatchKMeans, KMeans
from pathlib import Path
from PIL import Image
from colorthief import ColorThief
import numpy as np
import pandas as pd
import os
import glob
import csv
import json
import io
import ntpath
import webcolors


data = np.empty((0,3), str)
directory = glob.iglob(source)
colorRange = json.load(open('colorRange.json'))

for file in directory:
    filename = os.path.basename(file)
    img = Image.open(file)
    img = img.resize((100, 100))
    img.save("tmp.jpg")

    color_thief = ColorThief("tmp.jpg")
    # get the dominant color
    dominant_color = color_thief.get_color(quality=1)

    def closest_colour(dominant_color):
        min_colours = {}
        for key, name in webcolors.css3_hex_to_names.items():
            r_c, g_c, b_c = webcolors.hex_to_rgb(key)
            rd = (r_c - dominant_color[0]) ** 2
            gd = (g_c - dominant_color[1]) ** 2
            bd = (b_c - dominant_color[2]) ** 2
            min_colours[(rd + gd + bd)] = name
        return min_colours[min(min_colours.keys())]

    def get_colour_name(dominant_color):
        try:
            actual_name = webcolors.rgb_to_name(dominant_color, spec='css3')
            closest_name = None
        except ValueError:
            closest_name = closest_colour(dominant_color)
            actual_name = None
        return actual_name, closest_name

    actual_name, closest_name = get_colour_name(dominant_color)

    if(actual_name == None):
        colorName = closest_name
    else:
        colorName = actual_name
    
    def get_general_name(colorName):
        for item in colorRange:
            if colorName in item["css3_colors"]:
                general_name = item["parent_color"]
                return general_name
    
    general_name = get_general_name(colorName)

    data = np.append(data, np.array([[filename, str(dominant_color), general_name]]),
                     axis = 0)

pd.DataFrame(data, columns = ["filename", "dominant_color_rgb",
                             "dominant_color_name"]
             ).to_csv(destination)