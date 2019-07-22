
from sklearn.cluster import MiniBatchKMeans, KMeans
from pathlib import Path
from colorthief import ColorThief
import numpy as np
import os
import glob
import csv
import io
import ntpath
import webcolors

data = np.empty((0,3), str)
data = np.append(data, np.array([["filename", "RGB Value", "Color"]]), axis = 0)
directory = glob.iglob("/Users/jordancohill/Desktop/Quant/results/*.jpg")
for file in directory:
    filename = os.path.basename(file)
    color_thief = ColorThief(file)
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
            closest_name = actual_name = webcolors.rgb_to_name(dominant_color)
        except ValueError:
            closest_name = closest_colour(dominant_color)
            actual_name = None
        return actual_name, closest_name

    actual_name, closest_name = get_colour_name(dominant_color)

    if(actual_name == None):
        colorName = closest_name
    else:
        colorName = actual_name

    data = np.append(data, np.array([[filename, str(dominant_color), colorName]]), axis = 0)


numpy.savetxt("/Users/jordancohill/Desktop/WebApps/final/dominantColors.csv", data, delimiter=",")





