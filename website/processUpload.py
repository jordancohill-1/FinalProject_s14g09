from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sklearn.cluster import MiniBatchKMeans
from pathlib import Path
from colorthief import ColorThief
import numpy as np
import pandas as pd
import argparse
import cv2
import os
import glob
import webcolors
import json

path = '../UPLOAD_FOLDER'
colorRange = json.load(open('../colorRange.json'))

def quant(img):
	pathToFile = os.path.join(path, img)

	#QUANT
	image = cv2.imread(pathToFile)
	scale_percent = 50 
	width = int(image.shape[1] * scale_percent / 100)
	height = int(image.shape[0] * scale_percent / 100)
	dim = (width, height)
	image = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
	(h, w) = image.shape[:2]
	image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
	image = image.reshape((image.shape[0] * image.shape[1], 3))
	clt = MiniBatchKMeans(n_clusters = 4)
	labels = clt.fit_predict(image)
	quant = clt.cluster_centers_.astype("uint8")[labels]
	quant = quant.reshape((h, w, 3))
	quant = cv2.cvtColor(quant, cv2.COLOR_LAB2BGR)

	cv2.imwrite( pathToFile, quant)
	dominantColors(pathToFile)

def dominantColors(path):
	color_thief = ColorThief(path)
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

	exactName = colorName


	def get_general_name(colorName):
		for item in colorRange:
			if colorName in item["css3_colors"]:
				general_name = item["parent_color"]
				return general_name

	general_name = get_general_name(colorName)

	print(exactName, general_name)
	return[exactName, general_name]




    